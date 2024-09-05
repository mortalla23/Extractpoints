function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperature, nature: "Air"};
    }
    return result;
}
exports.extractPoints = extractPoints;