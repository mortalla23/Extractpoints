function extractPoints(input)
{
    let result = {};
    if (input.message.voltage != null) {
        result.batteryVoltage = { unitId: "V", record: input.message.voltage};
    }
    if (input.message.active_power != null) {
        result.power = { unitId: "W", record: input.message.active_power,nature:"Active power"};
    }
    if (input.message.power_consumption != null) {
        result.energy = { unitId: "Wh", record: input.message.power_consumption,nature:"Power consumption"};
    }
    if (input.message.total_current != null) {
        result.current = { unitId: "mA", record: input.message.total_current,nature:"Total current"};
    }
    if (input.message.power_factor != null) {
        result.per= { unitId: "%", record: input.message.power_factor,nature:"Power factor"};
    }
    return result;
}
exports.extractPoints = extractPoints;