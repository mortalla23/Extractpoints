//  this function which will implement the points "contract"
function extractPoints(input) {
    const result = {};

    if (input.message == null) {
        throw new Error(emptyExtractError);
    }

    if (input.message.decoderAvailable === false || input.message.gpsAvailable === false) {
        throw new Error(lengthError);
    }

    if (input.message.rssi != null) {
        result.rssi = { unitId: "dBm", record: input.message.rssi };
    }
    if (input.message.batteryCapacity != null) {
        result.batteryLevel = { unitId: "%", record: input.message.batteryCapacity };
    }
    if (input.message.longitude != null && input.message.latitude != null) {
        if ((input.message.longitude >= -180 && input.message.longitude <= 180) && (input.message.latitude >= -90 && input.message.latitude <= 90)) {
            result.location = { unitId: "GPS", record: [input.message.longitude, input.message.latitude] };
        } else {
            throw new Error(notApplicableError);
        }
    }

    return result;
}
exports.extractPoints = extractPoints;