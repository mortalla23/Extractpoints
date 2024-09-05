function extractPoints(input) {
    var result = {};
    if (input.message.batteryLevel != undefined) {
        result.batteryLevel = { unitId: "%", record: input.message.batteryLevel };
    }
    if (input.message.sensorData.temperature != undefined) {
        result.temperature = { unitId: "Cel", record: input.message.sensorData.temperature };
    }
    if (input.message.sensorData.pressure != undefined) {
        result.pressure = { unitId: "bar", record: input.message.sensorData.pressure };
    }
    return result;
}
exports.extractPoints = extractPoints;