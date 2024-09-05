function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.co2 != null) {
        result.co2Level = { unitId: "ppm", record: input.message.co2};
    }
    if (input.message.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperature, nature: "Air"};
    }
    if (input.message.humidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.humidity, nature: "Air"};
    }
    if (input.message.pressure != null) {
        result.pressure = { unitId: "hPa", record: input.message.pressure, nature: "Air"};
    }
    return result;
}
exports.extractPoints = extractPoints;