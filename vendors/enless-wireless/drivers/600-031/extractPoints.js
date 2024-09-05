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
let tempIndex=0
    // Extract temperature data if available
    if (data && data.values) {
        if (data.values.temperature_1) {
            result["temperature:"+tempIndex++] = {
                unitId: "Cel",
                record: data.values.temperature_1.value,
                nature:"Temperature 1"
            };
        }
        if (data.values.temperature_2) {
            result["temperature:"+tempIndex++] = {
                unitId: "Cel",
                record: data.values.temperature_2.value,
                nature:"Temperature 2"
            };
        }
    }

   

    return result;
}
exports.extractPoints = extractPoints;