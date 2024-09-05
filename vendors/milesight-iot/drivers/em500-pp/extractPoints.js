function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.pressure != null) {
        result.pressure = { unitId: "hPa", record: input.message.pressure, nature: "Air"};
    }
    return result;
}
exports.extractPoints = extractPoints;