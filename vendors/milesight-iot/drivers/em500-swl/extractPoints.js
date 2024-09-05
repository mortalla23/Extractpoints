function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.distance != null) {
        result.distance = { unitId: "m", record: input.message.distance};
    }
    return result;
}
exports.extractPoints = extractPoints;