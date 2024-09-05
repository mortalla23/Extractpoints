//  this function which will implement the points "contract"
function extractPoints(input) {
    let result = {};

    if (input.message == null) {
        throw new Error(emptyExtractError);
    }

    if (input.message.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperature };
    }
    if (input.message.uplinkFrameCounter != null) {
        result.uplinkFrameCounter = { record: input.message.uplinkFrameCounter };
    }
    if (input.message.downlinkFrameCounter != null) {
        result.downlinkFrameCounter = { record: input.message.downlinkFrameCounter };
    }
    if (input.message.gps != null) {
        let longitude = extractCoordinates(
            input.message.gps.longitude.hemisphere,
            input.message.gps.longitude.degrees,
            input.message.gps.longitude.minutes,
        );
        let latitude = extractCoordinates(
            input.message.gps.latitude.hemisphere,
            input.message.gps.latitude.degrees,
            input.message.gps.latitude.minutes,
        );

        if (longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90) {
            result.location = { unitId: "GPS", record: [longitude, latitude] };
        } else {
            throw new Error(notApplicableError);
        }
    }
    if (input.message.batteryVoltage != null) {
        result.batteryVoltage = input.message.batteryVoltage;
        let batteryLevel = Number(((input.message.batteryVoltage * 100) / 3700).toFixed(2));
        if(batteryLevel > 100){
            result.batteryLevel = { unitId: "%", record: 100 };
        } else if(batteryLevel < 0){
            result.batteryLevel = { unitId: "%", record: 0 };
        } else {
            result.batteryLevel = { unitId: "%", record: batteryLevel };
        }
    }
    if (input.message.rssi != null) {
        result.rssi = { unitId: "dBm", record: input.message.rssi };
    }
    if (input.message.snr != null) {
        result.snr = { unitId: "dB", record: input.message.snr };
    }

    return result;
}
exports.extractPoints = extractPoints;