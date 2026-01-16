import Chart from "chart.js/auto";
import * as XLSX from "xlsx";

// 1. We voegen 'imgPaths' toe als 2e argument aan de functie
export function initDashboard(root, imgPaths) {
    const get = (id) => root.getElementById(id);
    const tokenInput = get("tokenInput");
    const sessionInput = get("sessionInput");
    const defaultDesignId = 8;

    // Fallback voor veiligheid, mocht imgPaths leeg zijn
    const images = imgPaths || {
        defaultImg: "img/default.png",
        happyImg: "img/happy.png",
        sadImg: "img/sad.png"
    };

    let pollingInterval = null;
    let myChart = null;

    // Token laden
    const savedToken = localStorage.getItem('tygronToken');
    const savedSession = localStorage.getItem('sessionCode');
    if (savedToken && tokenInput) tokenInput.value = savedToken;
    if (savedSession && sessionInput) sessionInput.value = savedSession;

    if (savedToken && savedSession) {
        loadDashboard(savedToken, savedSession);
    }

    const excelBtn = get("excelBtn");
    if (excelBtn) {
        excelBtn.addEventListener("click", generateExcel);
    }

    function generateExcel() {
        const wb = XLSX.utils.book_new();
        const data = [
            ["Categorie", "Waarde"],
            ["Straat & Stoep", get("val-roads").textContent],
            ["Bebouwing", get("val-buildings").textContent],
            ["Parkeren", get("val-parking").textContent],
            ["Draagvlak Partij 1", get("unity-partij1").textContent],
            ["Draagvlak Partij 2", get("unity-partij2").textContent],
            ["Draagvlak Partij 3", get("unity-partij3").textContent],
            ["Draagvlak Partij 4", get("unity-partij4").textContent]
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Resultaten");
        XLSX.writeFile(wb, "Tygron_Resultaten.xlsx");
    }

    // --- HULP FUNCTIES ---
    const getAttrValue = (attr, key) => attr[key]?.[0] ?? 0;
    const toPerc = (val) => (val * 100).toFixed(0) + "%";

    function updateTable(data) {
        const attr = data.attributes || {};
        const safeSet = (id, val) => { if(get(id)) get(id).textContent = val; }
        safeSet("val-roads", toPerc(getAttrValue(attr, "FRACTION_ROADS")));
        safeSet("val-buildings", toPerc(getAttrValue(attr, "FRACTION_BUILDINGS")));
        safeSet("val-parking", toPerc(getAttrValue(attr, "FRACTION_PARKING")));
        safeSet("val-gardens", toPerc(getAttrValue(attr, "FRACTION_GARDENS")));
        safeSet("val-public-green", toPerc(getAttrValue(attr, "FRACTION_PUBLIC_GREEN")));
    }

    function updateUnityCard(data) {

        const setScoreWithVisuals = (textId, imgId, rawValue) => {
            const textEl = get(textId);
            const imgEl = get(imgId);

            if (!textEl) return;

            // Reset alles als er geen data is
            if (rawValue === undefined || rawValue === null) {
                textEl.textContent = "-";
                textEl.classList.remove('status-green', 'status-orange', 'status-red');
                if(imgEl) {
                    // Gebruik de variabele uit de import
                    imgEl.src = images.defaultImg;
                    imgEl.classList.remove('status-icon-red', 'status-icon-orange', 'status-icon-green');
                }
                return;
            }

            const val = Number(rawValue);
            textEl.textContent = val.toFixed(1);

            textEl.classList.remove('status-green', 'status-orange', 'status-red');
            if(imgEl) imgEl.classList.remove('status-icon-red', 'status-icon-orange', 'status-icon-green');

            // --- LOGICA VOOR KLEUR EN PLAATJE ---
            if (val < 5) {
                // ROOD + SAD
                textEl.classList.add('status-red');
                if(imgEl) {
                    imgEl.src = images.sadImg; // Variabele
                    imgEl.classList.add('status-icon-red');
                }
            } else if (val < 7.5) {
                // ORANJE + DEFAULT
                textEl.classList.add('status-orange');
                if(imgEl) {
                    imgEl.src = images.defaultImg; // Variabele
                    imgEl.classList.add('status-icon-orange');
                }
            } else {
                // GROEN + HAPPY
                textEl.classList.add('status-green');
                if(imgEl) {
                    imgEl.src = images.happyImg; // Variabele
                    imgEl.classList.add('status-icon-green');
                }
            }
        };

        setScoreWithVisuals("unity-partij1", "img-partij1", data.draagvlakPartij1);
        setScoreWithVisuals("unity-partij2", "img-partij2", data.draagvlakPartij2);
        setScoreWithVisuals("unity-partij3", "img-partij3", data.draagvlakPartij3);
        setScoreWithVisuals("unity-partij4", "img-partij4", data.draagvlakPartij4);
    }

    function createChart(indicators) {
        const chartCanvas = get("landUseChart");
        if (!chartCanvas) return;
        if (myChart) myChart.destroy();

        const labels = indicators.map(i => i.name);
        const values = indicators.map(i => i.value !== undefined ? i.value : 0);
        const colors = values.map(v => (v < 5 ? "#e74c3c" : v < 7.5 ? "#f39c12" : "#2ecc71"));

        myChart = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: 'Resultaat',
                    data: values,
                    backgroundColor: colors,
                    borderColor: "#333",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'x',
                scales: {
                    y: { min: 1, max: 10 },
                    x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 45, font: { size: 10 } } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // --- BUTTON LISTENER ---
    const fetchBtn = get("fetchBtn");
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            const userToken = tokenInput.value.trim();
            const sessionCode = sessionInput.value.trim();
            if (!userToken || !sessionCode) {
                alert("Vul tokens in");
                return;
            }
            localStorage.setItem('tygronToken', userToken);
            localStorage.setItem('sessionCode', sessionCode);
            loadDashboard(userToken, sessionCode);
        });
    }

    async function fetchLiveUnityData(sessionCode) {
        try {
            const url = `/api/session/${sessionCode}/unity-data`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                updateUnityCard(data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function loadDashboard(userToken, sessionCode) {
        const loading = get("loading");
        if(loading) loading.style.display = 'inline-block';
        if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }

        try {
            const headers = new Headers();
            headers.append('X-Tygron-Token', userToken);

            // Tygron data
            const designRes = await fetch(`/api/tygron/parametric_designs/${defaultDesignId}`, { headers });
            if (designRes.ok) updateTable(await designRes.json());

            // Unity data
            fetchLiveUnityData(sessionCode);

            // Indicatoren (Grafiek)
            const listUrl = `https://engine.tygron.com/api/session/items/indicators/?f=JSON&token=${userToken}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();
            const foundIds = listData.map(item => item.id);

            if (foundIds.length > 0) {
                const detailRequests = foundIds.map(id =>
                    fetch(`https://engine.tygron.com/api/session/items/indicators/${id}/?f=JSON&token=${userToken}`)
                        .then(res => res.ok ? res.json() : null)
                        .catch(() => null)
                );
                const detailedResults = await Promise.all(detailRequests);
                const processedIndicators = detailedResults
                    .filter(item => item !== null)
                    .map(ind => {
                        let finalScore = ind.maquetteOverride?.SCORE_TOTAL?.[0]
                            ?? ind.mapTypeValues?.MAQUETTE
                            ?? ind.attributes?.SCORE_TOTAL?.[0] ?? 0;
                        return { id: ind.id, name: ind.name, value: finalScore * 10 };
                    });
                createChart(processedIndicators);
            }

        } catch (err) {
            console.error(err);
        } finally {
            if(loading) loading.style.display = 'none';
        }
    }
}