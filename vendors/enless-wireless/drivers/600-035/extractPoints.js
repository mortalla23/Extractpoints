function extractPoints(input) {

    if (!input || !input.message) {
        throw new Error("Invalid uplink payload: no data received to extract points");
    }

    const result = {};
    const data = input.message;
    // Extract curent data if available
    if (data && data.values && data.values.current) {
        result["current"] = {
            unitId: "mA",
            record: data.values.current.value
        };
    }
    if (data && data.states && typeof data.states.battery === 'string') {
        const batteryLevel = data.states.battery.replace('%', ''); // Retire the symbole pourcent
        result["batteryLevel"] = {
            unitId: "%",
            record: parseFloat(batteryLevel) 
    };
    }
    
    return result;
}
exports.extractPoints = extractPoints;