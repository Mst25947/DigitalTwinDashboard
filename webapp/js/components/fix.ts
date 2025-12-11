//deel 1
interface TygronData {
    attributes: {
        FRACTION_BUILDING: number[];
        FRACTION_WATER: number[];
    }
}

const responseTS: TygronData = {
    attributes: {
        FRACTION_BUILDING: [0.15],
        FRACTION_WATER: [0.05]
    }
};

function updateKPIsTS(data: TygronData) {

    const val = data.attributes.FRACTION_BUILDING[0];

    // @ts-ignore
    const percentage = (val * 100).toFixed(1);
    console.log("Bebouwing: " + percentage + "%");
}


//deel 2
interface TygronResponse {
    attributes: {
        WOZ_WAARDE: number[];
    }
}

const nieuweApiData = {
    attributes: {
        WOZ_WAARDE: 375000
    }
};

function berekenGemiddeldeTS(data: TygronResponse) {
    return data.attributes.WOZ_WAARDE.reduce((a, b) => a + b, 0) / 2;
}
