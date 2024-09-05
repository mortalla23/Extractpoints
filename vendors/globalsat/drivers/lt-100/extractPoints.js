//  this method which will implement the points "contract"
function extractPoints(input) {
    let result = {};
    const emptyExtractError = "Input message is empty.";
   
    if (input.message == null) {
        throw new Error(emptyExtractError);
    }

   
    if (input.message.batteryCapacity != null) {
        result["batteryLevel"] = { unitId: "%", record: input.message.batteryCapacity };
    }

    if (input.message.longitude != null && input.message.latitude != null) {
        result["location"]= { unitId: "GPS", record: [input.message.longitude, input.message.latitude] };
    }

    return result;
}
exports.extractPoints = extractPoints;