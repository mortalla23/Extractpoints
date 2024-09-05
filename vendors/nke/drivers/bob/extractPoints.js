//  this function which will implement the points "contract"
function extractPoints(input) {
    let result = {};
    if (input.message == null) {
        throw new Error(extractPointsEmptyError);
    }
let vibrationIndex=0;
    if (input.message.percentage != null) {
        result["percentage"] = {unitId: "%" ,record: input.message.percentage};
    }
    if (input.message.anomalyLevel != null) {
        result["percentage"] = {unitId: "%" ,record: input.message.anomalyLevel, nature:"Anomaly level"};
    }
    if (input.message.peakFrequency != null) {
        result["frequency"] = {unitId: "hertz" ,record: input.message.peakFrequency};
    }

    if (input.message.vibrationLevel != null) {
        result["vibration:"+vibrationIndex++] = {unitId: "gravity", record: input.message.vibrationLevel,nature:"Vibration level"};
    }
    if (input.message.fft != null) {
        result["vibration:"+vibrationIndex++] = {
            unitId: "gravity",
            records: input.message.fft,  // Stores the entire array
            nature: "fft"
        };
    }
    

    if (input.message.temperature != null) {
        result["temperature"] = {unitId: "Cel", record: input.message.temperature};
    }

    if (input.message.batteryPercentage != null) {
        result["batteryLevel"] = {unitId: "%", record: input.message.batteryPercentage};
    }

    return result;
}
exports.extractPoints = extractPoints;