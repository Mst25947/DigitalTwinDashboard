import Chart from "chart.js/auto";
import * as XLSX from "xlsx";

export function initDashboard(root) {
    const get = (id) => root.getElementById(id);

    const tokenInput = get("tokenInput");

    const defaultDesignId = 14;
    const useDummy = false;

    const savedToken = localStorage.getItem('tygronToken');
    if (savedToken) {
        if (tokenInput) {
            tokenInput.value = savedToken;
        }
        console.log("Opgeslagen token gevonden:", savedToken);
        loadDashboard(savedToken);
    }

    let myChart = null;

    const excelBtn = get("excelBtn");

    if (excelBtn) {
        excelBtn.addEventListener("click", () => {
            generateExcel();
        });
    }

    function generateExcel() {
        // Check of er data is
        const kpiValue = get("kpi-building").textContent;
        if (kpiValue === "--" || !myChart) {
            alert("Laad eerst data in voordat je exporteert.");
            return;
        }

        // We bouwen een 'Array of Arrays'. Elke sub-array is een rij in Excel.
        const summaryData = [
            ["RAPPORTAGE DIGITAL TWIN ONTWERP"],
            ["Datum", new Date().toLocaleDateString("nl-NL")],
            [""],
            ["KPI SAMENVATTING"],
            ["Omschrijving", "Waarde"],
            ["Bebouwing (Fractie)", get("kpi-building").textContent],
            ["Groen & Water (Totaal)", get("kpi-green-water").textContent],
            ["Vloeroppervlakte (Totaal)", get("kpi-area").textContent],
            [""],
            ["GRONDGEBRUIK VERDELING (Grafiek Data)"],
            ["Categorie", "Percentage"]
        ];

        const chartLabels = myChart.data.labels;
        const chartValues = myChart.data.datasets[0].data;

        chartLabels.forEach((label, index) => {
            // Zet decimalen om naar percentages voor leesbaarheid in Excel
            const percentage = (chartValues[index] * 100).toFixed(1) + "%";
            summaryData.push([label, percentage]);
        });

        // Hier halen we alles op wat in de accordeons staat
        const detailData = [
            ["DETAIL RAPPORTAGE"],
            [""],
            ["CATEGORIE: GROEN & TUINEN"],
            ["Publiek Groen Fractie", get("val-fraction-public-green").textContent],
            ["Tuin Fractie", get("val-fraction-gardens").textContent],
            [""],
            ["CATEGORIE: INFRASTRUCTUUR"],
            ["Wegen Fractie", get("val-fraction-roads").textContent],
            ["Weg Breedte", get("val-road-width").textContent],
            ["Trottoir Breedte", get("val-sidewalk-width").textContent],
            ["Afstand Y-as", get("val-road-distance-y").textContent],
            [""],
            ["CATEGORIE: WATER"],
            ["Water Fractie", get("val-fraction-water").textContent],
            ["Water Breedte", get("val-water-width").textContent],
            [""],
            ["CATEGORIE: PARKEREN"],
            ["Parkeer Fractie", get("val-fraction-parking").textContent],
            ["Parkeer Lengte", get("val-parking-length").textContent],
            ["Parkeer Breedte", get("val-parking-width").textContent],
            [""],
            ["CATEGORIE: GEBOUWEN & KAVELS"],
            ["Kavel 1 Vloeroppervlakte", get("val-total-area-1").textContent],
            ["Kavel 2 Vloeroppervlakte", get("val-total-area-2").textContent],
            ["Kavel 1 Verdiepingen", get("val-building-floors-1").textContent],
            ["Kavel 2 Verdiepingen", get("val-building-floors-2").textContent],
            ["Afstand tot weg", get("val-building-road-distance").textContent],
            ["Fit Fractie Kavel 1", get("val-fit-fraction-1").textContent],
            ["Fit Fractie Kavel 2", get("val-fit-fraction-2").textContent],
        ];


        // Maak een nieuw werkboek
        const wb = XLSX.utils.book_new();

        // Maak sheet 1 (Samenvatting)
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        wsSummary['!cols'] = [{ wch: 30 }, { wch: 15 }];

        // Maak sheet 2 (Details)
        const wsDetails = XLSX.utils.aoa_to_sheet(detailData);
        wsDetails['!cols'] = [{ wch: 30 }, { wch: 15 }];

        // Voeg sheets toe aan werkboek
        XLSX.utils.book_append_sheet(wb, wsSummary, "Samenvatting");
        XLSX.utils.book_append_sheet(wb, wsDetails, "Details");

        XLSX.writeFile(wb, "Tygron_Resultaten.xlsx");
    }

    const accordionHeaders = root.querySelectorAll(".accordion-header");
    accordionHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;

            root.querySelectorAll(".accordion-header.active").forEach((activeHeader) => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove("active");
                    const otherContent = activeHeader.nextElementSibling;
                    otherContent.classList.remove("open");
                    otherContent.style.maxHeight = 0;
                }
            });

            header.classList.toggle("active");
            content.classList.toggle("open");
            content.style.maxHeight = content.classList.contains("open")
                ? content.scrollHeight + 10 + "px"
                : 0;
        });
    });

    const getAttrValue = (attr, key, index = 0) => attr[key]?.[index] ?? 0;

    const calculateTotalArea = (data) => {
        let totalArea = 0;
        data.plotDesigns?.forEach((plot) => {
            const area = getAttrValue(plot.attributes, "AREA_M2");
            const floors = getAttrValue(plot.attributes, "FLOORS");
            totalArea += area * floors;
        });
        return totalArea;
    };


    function updateKPIs(data) {
        const attr = data.attributes || {};
        const buildingFraction = (getAttrValue(attr, "FRACTION_BUILDINGS") * 100).toFixed(1);
        get("kpi-building").textContent = `${buildingFraction}%`;

        const greenWaterFraction =
            (getAttrValue(attr, "FRACTION_GARDENS") +
                getAttrValue(attr, "FRACTION_PUBLIC_GREEN") +
                getAttrValue(attr, "FRACTION_WATER")) *
            100;
        get("kpi-green-water").textContent = `${greenWaterFraction.toFixed(1)}%`;

        const totalArea = calculateTotalArea(data);
        get("kpi-area").textContent = `${totalArea.toFixed(0)} m²`;
    }

    function createChart(data) {
        const attr = data.attributes || {};
        const labels = ["Bebouwing", "Tuinen", "Parkeren", "Openbaar Groen", "Wegen", "Water", "Overig"];
        const fractions = [
            getAttrValue(attr, "FRACTION_BUILDINGS"),
            getAttrValue(attr, "FRACTION_GARDENS"),
            getAttrValue(attr, "FRACTION_PARKING"),
            getAttrValue(attr, "FRACTION_PUBLIC_GREEN"),
            getAttrValue(attr, "FRACTION_ROADS"),
            getAttrValue(attr, "FRACTION_WATER"),
            getAttrValue(attr, "FRACTION_REMAINDER"),
        ];

        const chartCanvas = get("landUseChart");
        if (!chartCanvas) return;

        if (myChart) myChart.destroy();

        myChart = new Chart(chartCanvas, {
            type: "pie",
            data: {
                labels,
                datasets: [
                    {
                        data: fractions,
                        backgroundColor: [
                            "#a55eea",
                            "#2ecc71",
                            "#bdc3c7",
                            "#27ae60",
                            "#34495e",
                            "#3498db",
                            "#f1c40f",
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.label || "";
                                if (context.parsed !== null) {
                                    label += `: ${(context.parsed * 100).toFixed(1)}%`;
                                }
                                return label;
                            },
                        },
                    },
                },
            },
        });
    }

    function updateAccordionContent(data) {
        const attr = data.attributes || {};
        const plotAttr1 = data.plotDesigns?.[0]?.attributes || {};
        const plotAttr2 = data.plotDesigns?.[1]?.attributes || {};

        const showFraction = (key) => {
            const value = attr[key]?.[0];
            return value !== undefined ? `${(value * 100).toFixed(1)}%` : "--";
        };

        const showAttr = (key, index = 0, suffix = "") => {
            const value = attr[key]?.[index];
            return value !== undefined ? `${value}${suffix}` : "--";
        };

        const showPlotAttr = (plot, key, index = 0, suffix = "") => {
            const value = plot[key]?.[index];
            return value !== undefined ? `${value}${suffix}` : "--";
        };

        get("val-fraction-public-green").textContent = showFraction("FRACTION_PUBLIC_GREEN");
        get("val-fraction-gardens").textContent = showFraction("FRACTION_GARDENS");
        get("val-fraction-roads").textContent = showFraction("FRACTION_ROADS");
        get("val-road-width").textContent = showAttr("ROAD_WIDTH_M", 0, " m");
        get("val-sidewalk-width").textContent = showAttr("SIDEWALK_WIDTH_M", 0, " m");
        get("val-road-distance-y").textContent = showAttr("ROAD_DISTANCE_Y_M", 0, " m");
        get("val-fraction-water").textContent = showFraction("FRACTION_WATER");
        get("val-water-width").textContent = showAttr("WATER_WIDTH_M", 0, " m");
        get("val-fraction-parking").textContent = showFraction("FRACTION_PARKING");
        get("val-parking-length").textContent = showAttr("PARKING_LENGTH_M", 0, " m");
        get("val-parking-width").textContent = showAttr("PARKING_WIDTH_M", 0, " m");

        get("val-total-area-1").textContent = (
            getAttrValue(plotAttr1, "AREA_M2") * getAttrValue(plotAttr1, "FLOORS")
        ).toFixed(0);

        get("val-total-area-2").textContent = (
            getAttrValue(plotAttr2, "AREA_M2") * getAttrValue(plotAttr2, "FLOORS")
        ).toFixed(0);

        get("val-building-floors-1").textContent = showPlotAttr(plotAttr1, "FLOORS");
        get("val-building-floors-2").textContent = showPlotAttr(plotAttr2, "FLOORS");

        get("val-building-road-distance").textContent = showAttr("ROAD_DISTANCE_M", 0, " m");
        get("val-backyard-distance").textContent = showAttr("BACKYARD_DISTANCE_M", 0, " m");

        const updateFractionDisplay = (id, plot) => {
            const value = plot.FIT_FRACTION?.[0];
            get(id).textContent = value !== undefined ? `${(value * 100).toFixed(1)}%` : "--";
        };
        updateFractionDisplay("val-fit-fraction-1", plotAttr1);
        updateFractionDisplay("val-fit-fraction-2", plotAttr2);
    }

    // Dummy data
    const dummyData = {
        name: "Max shizzel (Dummy)",
        attributes: {
            FRACTION_BUILDINGS: [0.15],
            FRACTION_GARDENS: [0.3],
            FRACTION_PARKING: [0.05],
            FRACTION_PUBLIC_GREEN: [0.5],
            FRACTION_WATER: [0.0],
            FRACTION_ROADS: [0.0],
            FRACTION_REMAINDER: [0.0],
        },
        plotDesigns: [
            { attributes: { AREA_M2: [400], FLOORS: [8], FIT_FRACTION: [0.9] } },
            { attributes: { AREA_M2: [500], FLOORS: [10], FIT_FRACTION: [0.9] } },
        ],
    };

    const fetchBtn = get("fetchBtn");
    if (fetchBtn) {
        fetchBtn.addEventListener('click', () => {
            const userToken = tokenInput.value.trim();
            if (userToken) {
                localStorage.setItem('tygronToken', userToken)
                loadDashboard(userToken);
            } else {
                alert("Voer eerst de Tygron Token in.");
            }
        });
    }

    async function loadDashboard(userToken) {
        const currentLoadingEl = get("loading");
        const currentErrorEl = get("error");
        const currentDisplayToken = get("displayToken");

        if (currentLoadingEl) {
            currentLoadingEl.style.display = 'block';
        }
        if (currentErrorEl) {
            currentErrorEl.style.display = 'none';
        }

        if (currentDisplayToken) {
            currentDisplayToken.textContent = userToken;
        }

        let data;

        if (useDummy) {
            console.log("Gebruik dummydata voor design ID:", defaultDesignId);
            data = dummyData;
        } else {
            console.log("Ophalen van design ID:", defaultDesignId);
            try {
                const headers = new Headers();
                headers.append('X-Tygron-Token', userToken);

                const res = await fetch(`/api/tygron/parametric_designs/${defaultDesignId}`, { headers });

                if (!res.ok) throw new Error(`Fetch mislukt: ${res.status}`);
                data = await res.json();
            } catch (err) {
                console.error("Fout bij ophalen van data:", err);

                if (currentErrorEl) {
                    currentErrorEl.textContent = `Fout: ${err.message}. Controleer de ingevoerde token.`;
                    currentErrorEl.style.display = 'block';
                }
                if (currentLoadingEl) {
                    currentLoadingEl.style.display = 'none';
                }

                localStorage.removeItem('tygronToken');
                if (tokenInput) {
                    tokenInput.value = '';
                }
                // ---------------------------------

                return;
            }
        }

        if (currentLoadingEl) {
            currentLoadingEl.style.display = 'none';
        }

        const currentDataOutput = get("dataOutput");
        if (currentDataOutput) {
            currentDataOutput.textContent = JSON.stringify(data, null, 2);
        }

        updateKPIs(data);
        createChart(data);
        updateAccordionContent(data);
    };
}