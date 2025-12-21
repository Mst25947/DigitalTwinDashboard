import Chart from "chart.js/auto";
import * as XLSX from "xlsx";

export function initDashboard(root) {
    const get = (id) => root.getElementById(id);
    const tokenInput = get("tokenInput");
    const sessionInput = get("sessionInput");
    const defaultDesignId = 8;

    // BELANGRIJK: Zorg dat deze code ergens vandaan komt (bijv URL of input)
    const sessionCode = "test";

    // Token laden
    const savedToken = localStorage.getItem('tygronToken');
    if (savedToken && tokenInput) {
        tokenInput.value = savedToken;
        loadDashboard(savedToken);
    }

    let myChart = null;

    // Excel Export Setup
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
            // Je kunt hier nu ook Unity data aan toevoegen
            ["Draagvlak", get("unity-draagvlak").textContent],
            ["Budget", get("unity-budget").textContent]
        ];
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Resultaten");
        XLSX.writeFile(wb, "Tygron_Resultaten.xlsx");
    }

    const getAttrValue = (attr, key) => attr[key]?.[0] ?? 0;
    const toPerc = (val) => (val * 100).toFixed(0) + "%";

    // Vult het tabelletje linksboven (BOB-Input)
    function updateTable(data) {
        const attr = data.attributes || {};
        const safeSet = (id, val) => { if(get(id)) get(id).textContent = val; }

        safeSet("val-roads", toPerc(getAttrValue(attr, "FRACTION_ROADS")));
        safeSet("val-buildings", toPerc(getAttrValue(attr, "FRACTION_BUILDINGS")));
        safeSet("val-parking", toPerc(getAttrValue(attr, "FRACTION_PARKING")));
        safeSet("val-gardens", toPerc(getAttrValue(attr, "FRACTION_GARDENS")));
        safeSet("val-public-green", toPerc(getAttrValue(attr, "FRACTION_PUBLIC_GREEN")));
    }

    // --- NIEUW: Vult de Unity data in de HTML ---
    function updateUnityCard(data) {
        const safeSet = (id, val) => {
            const el = get(id);
            if(el) el.textContent = val;
        };

        // Afronden op 1 decimaal of default 0
        safeSet("unity-draagvlak", data.draagvlakAverage?.toFixed(1) ?? "-");
        safeSet("unity-doel", data.doelAverage?.toFixed(1) ?? "-");

        // Budget formatteren als Euro
        if(get("unity-budget")) {
            const budget = data.budgetAverage ?? 0;
            get("unity-budget").textContent = `€ ${budget.toLocaleString('nl-NL')}`;
        }

        safeSet("unity-partij1", data.draagvlakPartij1 ?? "-");
        safeSet("unity-partij2", data.draagvlakPartij2 ?? "-");
        safeSet("unity-partij3", data.draagvlakPartij3 ?? "-");
        safeSet("unity-partij4", data.draagvlakPartij4 ?? "-");
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

    // --- API CALLS ---

    const fetchBtn = get("fetchBtn");
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            const userToken = tokenInput.value.trim();
            if (userToken) {
                localStorage.setItem('tygronToken', userToken)
                loadDashboard(userToken);
            } else {
                alert("Voer token in");
            }
        });
    }

    async function loadDashboard(userToken) {
        const loading = get("loading");
        if(loading) loading.style.display = 'inline-block';

        try {
            const headers = new Headers();
            headers.append('X-Tygron-Token', userToken);

            // 1. BOB-Input data
            const designRes = await fetch(`/api/tygron/parametric_designs/${defaultDesignId}`, { headers });
            if (designRes.ok) {
                const designData = await designRes.json();
                updateTable(designData);
            }

            // 2. UNITY Session data
            console.log(`Ophalen sessie data voor: ${sessionCode}`);
            const response = await fetch(`/api/session?sessionCode=${sessionCode}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                console.log("=== UNITY DATA ===", data);

                // HIER: Update de UI met de opgehaalde data
                updateUnityCard(data);

            } else {
                console.error("Kon sessie niet ophalen", response.status);
            }

            // 3. GGO id's ophalen
            console.log("Stap 1: Indicatoren lijst ophalen...");
            const listUrl = `https://engine.tygron.com/api/session/items/indicators/?f=JSON&token=${userToken}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();
            const foundIds = listData.map(item => item.id);

            if (foundIds.length === 0) {
                if(loading) loading.style.display = 'none';
                return;
            }

            // 4. GGO scores ophalen per id
            console.log(`Stap 2: Details ophalen voor ${foundIds.length} items...`);
            const detailRequests = foundIds.map(id =>
                fetch(`https://engine.tygron.com/api/session/items/indicators/${id}/?f=JSON&token=${userToken}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(err => null)
            );

            const detailedResults = await Promise.all(detailRequests);

            // GGO scores verwerken
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