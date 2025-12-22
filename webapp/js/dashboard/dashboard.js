import Chart from "chart.js/auto";
import * as XLSX from "xlsx";

export function initDashboard(root) {
    const get = (id) => root.getElementById(id);
    const tokenInput = get("tokenInput");
    const sessionInput = get("sessionInput");
    const defaultDesignId = 8;

    // Timer variabele
    let pollingInterval = null;
    let myChart = null;

    // Token laden uit localstorage
    const savedToken = localStorage.getItem('tygronToken');
    const savedSession = localStorage.getItem('sessionCode');
    if (savedToken && tokenInput) tokenInput.value = savedToken;
    if (savedSession && sessionInput) sessionInput.value = savedSession;

    if (savedToken && savedSession) {
        loadDashboard(savedToken, savedSession);
    }

    // --- EXCEL EXPORT ---
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
            ["Draagvlakken op een schaal van 1 tot 10:"],
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
        const safeSet = (id, val) => {
            const el = get(id);
            if(el) el.textContent = val;
        };

        // Als data undefined is, toon een streepje. Anders 1 decimaal.
        safeSet("unity-draagvlak", data.draagvlakAverage !== undefined ? Number(data.draagvlakAverage).toFixed(1) : "-");
        safeSet("unity-doel", data.doelAverage !== undefined ? Number(data.doelAverage).toFixed(1) : "-");

        if(get("unity-budget")) {
            const budget = data.budgetAverage ?? 0;
            get("unity-budget").textContent = `€ ${Number(budget).toLocaleString('nl-NL')}`;
        }

        safeSet("unity-partij1", data.draagvlakPartij1 !== undefined ? Number(data.draagvlakPartij1).toFixed(1) : "-");
        safeSet("unity-partij2", data.draagvlakPartij2 !== undefined ? Number(data.draagvlakPartij2).toFixed(1) : "-");
        safeSet("unity-partij3", data.draagvlakPartij3 !== undefined ? Number(data.draagvlakPartij3).toFixed(1) : "-");
        safeSet("unity-partij4", data.draagvlakPartij4 !== undefined ? Number(data.draagvlakPartij4).toFixed(1) : "-");
    }

    function createChart(indicators) {
        const chartCanvas = get("landUseChart");
        if (!chartCanvas) return;
        if (myChart) myChart.destroy();

        const labels = indicators.map(i => i.name);
        const values = indicators.map(i => i.value !== undefined ? i.value : 0);
        const colors = values.map(v => (v < 5 ? "#e74c3c" : v < 8 ? "#f39c12" : "#2ecc71"));

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
                alert("Vul zowel het Token als de Sessie Code in.");
                return;
            }

            localStorage.setItem('tygronToken', userToken);
            localStorage.setItem('sessionCode', sessionCode);

            loadDashboard(userToken, sessionCode);
        });
    }

    // --- FUNCTIE: Live Unity Data Ophalen ---
    async function fetchLiveUnityData(sessionCode) {
        try {

            const url = `/api/session/${sessionCode}/unity-data`;

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                updateUnityCard(data);
            } else {
                if(response.status !== 404) {
                    console.warn("Status live data:", response.status);
                }
            }
        } catch (e) {
            console.error("Netwerkfout bij live data:", e);
        }
    }

    // --- HOOFD FUNCTIE ---
    async function loadDashboard(userToken, sessionCode) {
        const loading = get("loading");
        if(loading) loading.style.display = 'inline-block';

        // 1. Reset timer om dubbele calls te voorkomen
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }

        try {
            const headers = new Headers();
            headers.append('X-Tygron-Token', userToken);

            // 2. Tygron Input Data
            const designRes = await fetch(`/api/tygron/parametric_designs/${defaultDesignId}`, { headers });
            if (designRes.ok) {
                const designData = await designRes.json();
                updateTable(designData);
            }

            // 3. START UNITY POLLING (Elke seconde)
            console.log(`Start polling voor sessie: ${sessionCode}`);
            fetchLiveUnityData(sessionCode); // Direct 1x


            // 4. Tygron GGO Indicatoren
            console.log("Stap 1: Indicatoren lijst ophalen...");
            const listUrl = `https://engine.tygron.com/api/session/items/indicators/?f=JSON&token=${userToken}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();
            const foundIds = listData.map(item => item.id);

            if (foundIds.length === 0) {
                if(loading) loading.style.display = 'none';
                return;
            }

            console.log(`Stap 2: Details ophalen voor ${foundIds.length} items...`);
            const detailRequests = foundIds.map(id =>
                fetch(`https://engine.tygron.com/api/session/items/indicators/${id}/?f=JSON&token=${userToken}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(err => null)
            );

            const detailedResults = await Promise.all(detailRequests);

            const processedIndicators = detailedResults
                .filter(item => item !== null)
                .map(ind => {
                    let finalScore = ind.maquetteOverride?.SCORE_TOTAL?.[0]
                        ?? ind.mapTypeValues?.MAQUETTE
                        ?? ind.attributes?.SCORE_TOTAL?.[0]
                        ?? 0;

                    return {
                        id: ind.id,
                        name: ind.name || ind.shortName,
                        value: finalScore * 10
                    };
                });

            processedIndicators.sort((a, b) => a.id - b.id);
            createChart(processedIndicators);

        } catch (err) {
            console.error("Fout:", err);
        } finally {
            if(loading) loading.style.display = 'none';
        }
    }
}