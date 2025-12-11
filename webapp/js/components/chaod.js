//deel 1
const apiResponse = {
    attributes: {
        FRACTION_BUILDINGS: [0.15],
        FRACTION_WATER: [0.05]
    }
};

function updateKPIs(data) {
    const buildingVal = data.attributes.FRACTION_BUILDINGS[0];

    const percentage = (buildingVal * 100).toFixed(1);
    console.log("Bebouwing: " + percentage + "%");
}

updateKPIs(apiResponse);


//deel 2
const tygronData = {
    attributes: {
        ArrayWaarde: 375000
    }
};

function berekenGemiddelde(data) {
    return data.attributes.ArrayWaarde.reduce((a, b) => a + b, 0) / 2;
}


console.log(berekenGemiddelde(tygronData));