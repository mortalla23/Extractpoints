//  this method which will implement the points "contract"
function extractPoints(input) {
    let result = {};

    if (input.message == null) {
        throw new Error(emptyExtractError);
    }

    if (input.message.decoderAvailable === false) {
        throw new Error(lengthError);
    }

    if (input.message.deviceTypeTxt != null) {
        result.deviceType = { record: input.message.deviceTypeTxt };
    }
    if (input.message.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperature };
    }
    if (input.message.humidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.humidity };
    }
    if (input.message.gazDensity != null) {
        switch (input.message.deviceType) {
            case 0x01:
                result.co2Level = { unitId: "ppm", record: input.message.gazDensity };
                break;
            case 0x02:
                result.co = { record: input.message.gazDensity };
                break;
            case 0x03:
                result.pm25 = { record: input.message.gazDensity };
                break;
            default:
                throw new Error(unknownDeviceError);
        }
    }

    return result;
}
exports.extractPoints = extractPoints;