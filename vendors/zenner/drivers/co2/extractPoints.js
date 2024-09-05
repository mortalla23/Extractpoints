function extractPoints(input) {
    var result = {};
    if (input.message.data && input.message.data.currentValue !== undefined) {
        result.co2Level = { unitId: "ppm", record: input.message.data.currentValue };
    }
    return result;
}
exports.extractPoints = extractPoints;