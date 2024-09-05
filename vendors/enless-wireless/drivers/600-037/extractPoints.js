function extractPoints(input) {

    if (!input || !input.message) {
        throw new Error("Invalid uplink payload: no data received to extract points");
    }

    const result = {};
    const data = input.message;
    
    if (data && data.states && typeof data.states.battery === 'string') {
        const batteryLevel = data.states.battery.replace('%', ''); // Retire the symbole pourcent
        result["batteryLevel"] = {
            unitId: "%",
            record: parseFloat(batteryLevel) 
        };
    }
    // Extract temperature data if available
    if (data && data.values && data.values.temperature) {
        result["temperature"] = {
            unitId: "Cel",
            record: data.values.temperature.value
        };
    }

    // Extract humidity data if available
    if (data && data.values && data.values.humidity) {
        result["humidity"] = {
            unitId: "%RH",
            record: data.values.humidity.value
        };
    }

    // Extract CO2 level data if available
    if (data && data.values && data.values.co2) {
        result["co2Level"] = {
            unitId: "ppm",
            record: data.values.co2.value
        };
    }
    let countIndex=0;
    // Extract VOC data if available
    if (data && data.values && data.values.voc) {
        result["concentration"] = {
            unitId: "ppb",
            record: data.values.voc.value
        };
    }
    if (data && data.values && data.values.pulse_ch1) {
        result["counter:"+countIndex++] = {
            unitId: "count",
            record: data.values.pulse_ch1.value,
            nature:"Pulse Ch1"
        };
    }

    if (data && data.values && data.values.pulse_ch2) {
        result["counter:"+countIndex++] = {
            unitId: "count",
            record: data.values.pulse_ch2.value,
            nature:"Pulse Ch2"
        };
    }
    if (data && data.values && data.values.pulse_oc) {
        result["counter:"+countIndex++] = {
            unitId: "count",
            record: data.values.pulse_oc.value,
            nature:"Pulse OC"
        };
    }


    return result;
}
exports.extractPoints = extractPoints;