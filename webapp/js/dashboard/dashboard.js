const fetchBtn = document.getElementById("fetchBtn");
const backBtn = document.getElementById("backBtn");
const designSelect = document.getElementById("designSelect");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const dataView = document.getElementById("dataView");
const homeView = document.getElementById("home");
const dataOutput = document.getElementById("dataOutput");
const designNameTitle = document.getElementById("designNameTitle");

const landUseChartCanvas = document.getElementById("landUseChart");
let myChart = null;

// --- Accordion Logica ---
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;

            // Sluit andere open accordions
            document.querySelectorAll('.accordion-header.active').forEach(activeHeader => {
                if (activeHeader !== header) {
                    activeHeader.classList.remove('active');
                    const otherContent = activeHeader.nextElementSibling;
                    otherContent.classList.remove('open');
                    otherContent.style.maxHeight = 0;
                }
            });

            header.classList.toggle('active');
            content.classList.toggle('open');
            if (content.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 10 + "px"; // Voeg kleine marge toe
            } else {
                content.style.maxHeight = 0;
            }
        });
    });
});

// --- FUNCTIES VOOR DATA VISUALISATIE ---

// Helper om een waarde uit de array te halen
const getAttrValue = (attr, key, index = 0) => attr[key]?.[index] ?? 0;

// Helper om de totale vloeroppervlakte te berekenen
function calculateTotalArea(data) {
    let totalArea = 0;
    if (data.plotDesigns && data.plotDesigns.length > 0) {
        data.plotDesigns.forEach(plot => {
            const area = getAttrValue(plot.attributes, "AREA_M2");
            const floors = getAttrValue(plot.attributes, "FLOORS");
            totalArea += area * floors;
        });
    }
    return totalArea;
}

function updateKPIs(data) {
    const attr = data.attributes || {};

    // Bebouwing
    const buildingFraction = (getAttrValue(attr, "FRACTION_BUILDINGS") * 100).toFixed(1);
    document.getElementById("kpi-building").textContent = `${buildingFraction}%`;

    // Groen & Water
    const greenWaterFraction = (
        getAttrValue(attr, "FRACTION_GARDENS") +
        getAttrValue(attr, "FRACTION_PUBLIC_GREEN") +
        getAttrValue(attr, "FRACTION_WATER")
    ) * 100;
    document.getElementById("kpi-green-water").textContent = `${greenWaterFraction.toFixed(1)}%`;

    // Totaal Vloeroppervlak
    const totalArea = calculateTotalArea(data);
    document.getElementById("kpi-area").textContent = `${totalArea.toFixed(0)} m²`;
}


function createChart(data) {
    const attr = data.attributes || {};

    // Verzamel labels en data voor de taartgrafiek
    const labels = [
        'Bebouwing', 'Tuinen', 'Parkeren', 'Openbaar Groen', 'Wegen', 'Water', 'Overig'
    ];
    const fractions = [
        getAttrValue(attr, "FRACTION_BUILDINGS"),
        getAttrValue(attr, "FRACTION_GARDENS"),
        getAttrValue(attr, "FRACTION_PARKING"),
        getAttrValue(attr, "FRACTION_PUBLIC_GREEN"),
        getAttrValue(attr, "FRACTION_ROADS"),
        getAttrValue(attr, "FRACTION_WATER"),
        getAttrValue(attr, "FRACTION_REMAINDER")
    ];

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(landUseChartCanvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: fractions,
                backgroundColor: [
                    '#a55eea', '#2ecc71', '#bdc3c7',
                    '#27ae60', '#34495e', '#3498db',
                    '#f1c40f'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            let label = context.label || '';
                            if (context.parsed !== null) {
                                label += `: ${(context.parsed * 100).toFixed(1)}%`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function updateAccordionContent(data) {
    const attr = data.attributes || {};
    const plotAttr1 = data.plotDesigns?.[0]?.attributes || {};
    const plotAttr2 = data.plotDesigns?.[1]?.attributes || {};

    // Helper om waarde veilig te tonen
    const showFraction = (key) => {
        const value = attr[key]?.[0];
        return value !== undefined ? `${(value * 100).toFixed(1)}%` : '--';
    };
    const showAttr = (key, index = 0, suffix = '') => {
        const value = attr[key]?.[index];
        return value !== undefined ? `${value}${suffix}` : '--';
    };
    const showPlotAttr = (plot, key, index = 0, suffix = '') => {
        const value = plot[key]?.[index];
        return value !== undefined ? `${value}${suffix}` : '--';
    };

    // Publiek Groen & Tuinen
    document.getElementById('val-fraction-public-green').textContent = showFraction("FRACTION_PUBLIC_GREEN");
    document.getElementById('val-fraction-gardens').textContent = showFraction("FRACTION_GARDENS");

    // Wegen
    document.getElementById('val-fraction-roads').textContent = showFraction("FRACTION_ROADS");
    document.getElementById('val-road-width').textContent = showAttr("ROAD_WIDTH_M", 0, ' m');
    document.getElementById('val-sidewalk-width').textContent = showAttr("SIDEWALK_WIDTH_M", 0, ' m');
    document.getElementById('val-road-distance-y').textContent = showAttr("ROAD_DISTANCE_Y_M", 0, ' m');

    // Water
    document.getElementById('val-fraction-water').textContent = showFraction("FRACTION_WATER");
    document.getElementById('val-water-width').textContent = showAttr("WATER_WIDTH_M", 0, ' m');

    // Parkeerplaatsen
    document.getElementById('val-fraction-parking').textContent = showFraction("FRACTION_PARKING");
    document.getElementById('val-parking-length').textContent = showAttr("PARKING_LENGTH_M", 0, ' m');
    document.getElementById('val-parking-width').textContent = showAttr("PARKING_WIDTH_M", 0, ' m');

    // Gebouw Details
    document.getElementById('val-total-area-1').textContent = (showPlotAttr(plotAttr1, "AREA_M2") * showPlotAttr(plotAttr1, "FLOORS")).toFixed(0);
    document.getElementById('val-total-area-2').textContent = (showPlotAttr(plotAttr2, "AREA_M2") * showPlotAttr(plotAttr2, "FLOORS")).toFixed(0);

    document.getElementById('val-building-floors-1').textContent = showPlotAttr(plotAttr1, "FLOORS");
    document.getElementById('val-building-floors-2').textContent = showPlotAttr(plotAttr2, "FLOORS");

    document.getElementById('val-building-road-distance').textContent = showAttr("ROAD_DISTANCE_M", 0, ' m');
    document.getElementById('val-backyard-distance').textContent = showAttr("BACKYARD_DISTANCE_M", 0, ' m');

    document.getElementById('val-fit-fraction-1').textContent = showPlotAttr(plotAttr1, "FIT_FRACTION", 0, '%', (v) => (v * 100).toFixed(1) + '%'); // aangepast
    document.getElementById('val-fit-fraction-2').textContent = showPlotAttr(plotAttr2, "FIT_FRACTION", 0, '%', (v) => (v * 100).toFixed(1) + '%'); // aangepast

    // Hulp voor fractions (zoals FIT_FRACTION)
    const updateFractionDisplay = (id, plot) => {
        const value = plot.FIT_FRACTION?.[0];
        document.getElementById(id).textContent = value !== undefined ? `${(value * 100).toFixed(1)}%` : '--';
    };
    updateFractionDisplay('val-fit-fraction-1', plotAttr1);
    updateFractionDisplay('val-fit-fraction-2', plotAttr2);
}


// --- FETCH LOGICA ---

async function loadDesignList() {
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");

    try {
        const res = await fetch(`/api/tygron/parametric_designs`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to fetch list: ${res.status} - ${text}`);
        }

        const designs = await res.json();
        console.log("Design list:", designs);

        designs.forEach(d => {
            const option = document.createElement("option");
            option.value = d.id;
            option.textContent = `${d.name} (ID: ${d.id})`;
            designSelect.appendChild(option);
        });

        if (designs.length === 0) {
            throw new Error("No designs found, using dummy data.");
        }

        fetchBtn.disabled = false;
    } catch (err) {
        console.warn("Kon design lijst niet laden. Gebruik dummy data voor weergave.");
        fetchBtn.disabled = false;

        if (!document.getElementById('dummy-option')) {
            const dummyOption = document.createElement("option");
            dummyOption.value = "9";
            dummyOption.textContent = "Max shizzel (Dummy ID: 9)";
            dummyOption.id = "dummy-option";
            designSelect.appendChild(dummyOption);
            designSelect.value = "9";
        }

        errorEl.textContent = "Kan de designlijst niet laden. (Controleer console)";
        errorEl.classList.remove("hidden");

    } finally {
        loadingEl.classList.add("hidden");
    }
}

fetchBtn.addEventListener("click", async () => {
    const id = designSelect.value;
    if (!id) return;

    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    dataOutput.textContent = "";

    let data;

    // Dummy data
    const dummyData = {
        "alignment" : "ROAD",
        "attributes" : {
            "BACKYARD_DISTANCE_M" : [ 5.0 ],
            "FRACTION_BUILDINGS" : [ 0.15 ],
            "FRACTION_GARDENS" : [ 0.3 ],
            "FRACTION_PARKING" : [ 0.05 ],
            "FRACTION_PUBLIC_GREEN" : [ 0.5 ],
            "FRACTION_REMAINDER" : [ 0.0 ],
            "FRACTION_ROADS" : [ 0.0 ],
            "FRACTION_WATER" : [ 0.0 ],
            "PARKING_LENGTH_M" : [ 6.0 ],
            "PARKING_WIDTH_M" : [ 3.0 ],
            "ROAD_DISTANCE_Y_M" : [ 40.0 ],
            "ROAD_SEARCH_DISTANCE_M" : [ 10.0 ],
            "ROAD_WIDTH_M" : [ 6.0 ],
            "SIDEWALK_WIDTH_M" : [ 2.0 ],
            "WATER_WIDTH_M" : [ 3.0 ],
            "BUILDING_AREA_M2": [ 0 ],
            "BUILDING_FLOORS": [ 0 ],
            "BUILDING_ROAD_DISTANCE_M": [ 3.0 ],
            "BUILDING_SIDE_DISTANCE_M": [ 8.0 ]
        },
        "center" : { "type" : "Point", "coordinates" : [ 580105.236034527, 6815844.557482205 ] },
        "id" : 9,
        "name" : "Max shizzel (Dummy)",
        "plotDesigns" : [ {
            "attributes" : {
                "AREA_M2" : [ 400.0 ],
                "FIT_FRACTION" : [ 0.9 ],
                "FLOORS" : [ 8.0 ],
                "FLOOR_HEIGHT_M" : [ 3.2 ]
            },
            "id" : 1
        }, {
            "attributes" : {
                "AREA_M2" : [ 500.0 ],
                "FIT_FRACTION" : [ 0.9 ],
                "FLOORS" : [ 10.0 ],
                "FLOOR_HEIGHT_M" : [ 3.5 ]
            },
            "id" : 2
        } ],
        "version": 37
    };


    try {
        // Fetch

        const res = await fetch(`/api/tygron/parametric_designs/${id}`);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Fetch failed: ${res.status} - ${text}`);
        }
        data = await res.json();

    } catch (err) {
        console.warn(`Fout bij laden van data voor ID ${id}. Gebruik lokale dummy data.`);
        data = dummyData;
        errorEl.textContent = `Fout bij API-oproep: ${err.message}. Toon dummy data.`;
        errorEl.classList.remove("hidden");
    }

    dataOutput.textContent = JSON.stringify(data, null, 2);
    designNameTitle.textContent = `Data: ${data.name || 'Onbekend Ontwerp'}`;

    updateKPIs(data);
    createChart(data);
    updateAccordionContent(data);

    homeView.classList.add("hidden");
    dataView.classList.remove("hidden");

    loadingEl.classList.add("hidden");

});

backBtn.addEventListener("click", () => {
    homeView.classList.remove("hidden");
    dataView.classList.add("hidden");

    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
});

loadDesignList();