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

    
    return result;
}
exports.extractPoints = extractPoints;