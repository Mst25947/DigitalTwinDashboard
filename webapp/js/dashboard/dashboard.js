import Chart from "chart.js/auto";
import * as XLSX from "xlsx";

export function initDashboard(root) {
    const get = (id) => root.getElementById(id);
    const tokenInput = get("tokenInput");
    const defaultDesignId = 8;

    // De specifieke IDs die je in de grafiek wilt zien
    const TARGET_INDICATORS = [48, 50, 53, 71, 72, 73, 74, 75, 76];

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
        // Simpele export van de tabel data
        const data = [
            ["Categorie", "Waarde"],
            ["Straat & Stoep", get("val-roads").textContent],
            ["Bebouwing", get("val-buildings").textContent],
            ["Parkeren", get("val-parking").textContent],
            ["Tuin Prive", get("val-gardens").textContent],
            ["Groen Publiek", get("val-public-green").textContent]
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
        get("val-roads").textContent = toPerc(getAttrValue(attr, "FRACTION_ROADS"));
        get("val-buildings").textContent = toPerc(getAttrValue(attr, "FRACTION_BUILDINGS"));
        get("val-parking").textContent = toPerc(getAttrValue(attr, "FRACTION_PARKING"));
        get("val-gardens").textContent = toPerc(getAttrValue(attr, "FRACTION_GARDENS"));
        get("val-public-green").textContent = toPerc(getAttrValue(attr, "FRACTION_PUBLIC_GREEN"));
    }


    function getColor(value) {
        return "#2ecc71";
    }

    function createChart(indicators) {
        const chartCanvas = get("landUseChart");
        if (!chartCanvas) return;
        if (myChart) myChart.destroy();

        // Data voorbereiden voor Chart.js
        const labels = indicators.map(i => i.name);

        const values = indicators.map(i => i.value !== undefined ? i.value : 0);

        const colors = values.map(v => {
            if (v < 5) return "#e74c3c"; 
            if (v < 8) return "#f39c12";
            return "#2ecc71";
        });
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
                    y: {
                        min: 1,
                        max: 10,
                        ticks: {
                            stepSize: 0.1,
                            callback: (value) => value.toFixed(1)
                        },
                        grid: { color: "#ccc" }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 45,
                            font: { size: 10 }
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
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

            //BOB-Input data
            const designRes = await fetch(`/api/tygron/parametric_designs/${defaultDesignId}`, { headers });
            if (designRes.ok) {
                const designData = await designRes.json();
                updateTable(designData);
            }

            // GGO id's ophalen
            console.log("Stap 1: Indicatoren lijst ophalen...");
            const listUrl = `https://engine.tygron.com/api/session/items/indicators/?f=JSON&token=${userToken}`;
            const listRes = await fetch(listUrl);
            const listData = await listRes.json();
            const foundIds = listData.map(item => item.id);

            if (foundIds.length === 0) {
                if(loading) loading.style.display = 'none';
                return;
            }

            //GGO scores ophalen per id
            console.log(`Stap 2: Details ophalen voor ${foundIds.length} items...`);
            const detailRequests = foundIds.map(id =>
                fetch(`https://engine.tygron.com/api/session/items/indicators/${id}/?f=JSON&token=${userToken}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(err => null)
            );

            const detailedResults = await Promise.all(detailRequests);

            //GGO scores verwerken
            const processedIndicators = detailedResults
                .filter(item => item !== null)
                .map(ind => {
                    let finalScore = ind.maquetteOverride?.SCORE_TOTAL?.[0];

                    if (finalScore === undefined) {
                        finalScore = ind.mapTypeValues?.MAQUETTE;
                    }

                    if (finalScore === undefined) {
                        finalScore = ind.attributes?.SCORE_TOTAL?.[0];
                    }

                    finalScore = finalScore ?? 0;

                    return {
                        id: ind.id,
                        name: ind.name || ind.shortName,
                        value: finalScore * 10
                    };
                });

            processedIndicators.sort((a, b) => a.id - b.id);
            console.log("Dashboard Data:", processedIndicators);

            createChart(processedIndicators);

        } catch (err) {
            console.error("Fout:", err);
        } finally {
            if(loading) loading.style.display = 'none';
        }
    }

}