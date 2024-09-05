
function decodeUplink(input) {
    let fPort = input.fPort;
    let bytes = input.bytes;

    let result = {
        data: {

        },
        warnings: [],
        errors: []
    }

    switch(bytes[0]) {
        case 0x30:
            result.data.frameType = "I'm alive";
            result.data.cyclicTransmissionsCounter = (bytes[1] >> 4) & 0x0F;
            if(bytes[1] & 0x0F) result.warnings.push("Payload's last 4 bits should all be at 0");
            break;
        case 0x50:
            result.data.frameType = "Instant reading";
            result.data.cyclicTransmissionsCounter = (bytes[1] >> 4) & 0x0F;
            result.data.status = {
                genericAlarm: bytes[1] & 0x01 ? "Alarm" : "Ok",
                flowDirection: bytes[1] & 0x02 ? "Opposite Direction" : "Right Direction",
                fraudAlarm: bytes[1] & 0x04 ? "Alarm" : "Ok",
                batteryAlarm: bytes[1] & 0x08 ? "Low Battery Charge" : "Ok",
                leakageAlarm: (bytes[1] >> 7) & 0x01 ? "Detected Leak" : "Ok"
            }
            result.data.instantMeasurementReading_liters = (bytes[5] << 3) + (bytes[4] << 2) + (bytes[3] << 1) + bytes[2];
            break;
        case 0x70:
            result.data.frameType = "Historical reading";
            result.data.status = {
                genericAlarm: bytes[1] & 0x01 ? "Alarm" : "Ok",
                flowDirection: bytes[1] & 0x02 ? "Opposite Direction" : "Right Direction",
                fraudAlarm: bytes[1] & 0x04 ? "Alarm" : "Ok",
                batteryAlarm: bytes[1] & 0x08 ? "Low Battery Charge" : "Ok",
                leakageAlarm: (bytes[1] >> 7) & 0x01 ? "Detected Leak" : "Ok"
            }
            result.data.timestamp = {
                minutes: bytes[5] & 0x3F,
                hours: ((bytes[4] << 2) & 0x07) + ((bytes[5] >> 6) & 0x03),
                day: (bytes[4] >> 3) & 0x1F,
                month: bytes[3] & 0x0F,
                year: (bytes[2] << 4) + ((bytes[3] >> 4) & 0xF0)
            }
            result.data.firstInstantReading_liters = bytes[6] + (bytes[7] << 8) + (bytes[8] << 16) + (bytes[9] << 24);
            result.data.readings = [];
            for(let byte = 12 ; byte < 32 ; byte += 2) {
                result.data.readings.push(bytes[byte] + (bytes[byte + 1] << 8) + result.data.firstInstantReading_liters);
            }
            break;
        default:
            result.errors.push("Could not find frame type with identifier " + bytes[0]);
    }
    
    return result;
}

exports.decodeUplink = decodeUplink;