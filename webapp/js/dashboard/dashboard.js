import Chart from "chart.js/auto";
import * as XLSX from "xlsx";

export function initDashboard(root) {
    const get = (id) => root.getElementById(id);
    const tokenInput = get("tokenInput");
    const defaultDesignId = 14;

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

        const colors = values.map(v => v < 0 ? "#e74c3c" : "#2ecc71");

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
                        beginAtZero: true,
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

            // 1. Haal BOB-Input data (Ontwerp)
            const designRes = await fetch(`/api/tygron/parametric_designs/${defaultDesignId}`, { headers });
            if (designRes.ok) {
                const designData = await designRes.json();
                updateTable(designData);
            }

            // 2. Haal GGO-Resultaten (Indicatoren)
            const indicatorRes = await fetch(`https://engine.tygron.com/api/session/indicators/?token=${userToken}`);

            if (indicatorRes.ok) {
                const allIndicators = await indicatorRes.json();

                const filteredIndicators = allIndicators
                    .filter(ind => TARGET_INDICATORS.includes(ind.id))
                    .map(ind => ({
                        id: ind.id,
                        name: ind.name || ind.shortName, 
                        value: ind.value,
                        score: ind.score
                    }));

                filteredIndicators.sort((a, b) => {
                    return TARGET_INDICATORS.indexOf(a.id) - TARGET_INDICATORS.indexOf(b.id);
                });

                console.log("Gevonden indicatoren:", filteredIndicators);
                createChart(filteredIndicators);
            } else {
                console.error("Kon indicatoren niet laden via API.");
            }

        } catch (err) {
            console.error(err);
            alert("Er is een fout opgetreden bij het laden.");
        } finally {
            if(loading) loading.style.display = 'none';
        }
    };
}