function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperature};
    }
    if (input.message.humidity!= null) {
        result.humidity = { unitId: "%RH", record: input.message.humidity};
    }
    if (input.message.ec != null) {
        result.conductivity = { unitId: "uS/cm", record: input.message.ec};
    }
    return result;
}
exports.extractPoints = extractPoints;