function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.illumination != null) {
        result.illuminance = { unitId: "lx", record: input.message.illumination};
    }
    return result;
}
exports.extractPoints = extractPoints;