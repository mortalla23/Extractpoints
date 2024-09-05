function extractPoints(input)
{
    let result = {};
    if (input.message.voltage != null) {
        result.voltage = { unitId: "V", record: input.message.voltage};
    }
    if (input.message.power != null) {
        result.power = { unitId: "W", record: input.message.power};
    }
    if (input.message.current != null) {
        result.current = { unitId: "mA", record: input.message.current};
    }
    if (input.message.power_sum != null) {
        result.energy = { unitId: "Wh", record: input.message.power_sum};
    }
    if (input.message.factor != null) {
        result.powerFactor = { unitId: "/", record: input.message.factor/100,nature:"Power factor"};
    }
    if (input.message.state != null) {
        result.status = { unitId: "state", record: true,nature:"Open operational status"};
    }
    return result;
}
exports.extractPoints = extractPoints;