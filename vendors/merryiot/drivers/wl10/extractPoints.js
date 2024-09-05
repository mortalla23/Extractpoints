function extractPoints(input) {
    var result = {};
    if (input.message.battery_volt != undefined) {
        result.batteryVoltage = { unitId: "V", record: input.message.battery_volt };
    }
    if (input.message.temperature != undefined) {
        result.temperature = { unitId: "Cel", record: input.message.temperature, nature: "air" };
    }
    if (input.message.humi != undefined) {
        result.humidity = { unitId: "%RH", record: input.message.humidity, nature: "air" };
    }
    return result;
}

exports.extractPoints = extractPoints;