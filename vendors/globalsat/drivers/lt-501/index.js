/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/

const emptyUplinkError = "invalid uplink payload: no data received";
const emptyExtractError = "invalid extractPoints input: no data received";
const timeExtractError = "invalid extractPoints input: no time assigned";
const lengthError = "invalid uplink payload: wrong length";
const protocolError = "invalid uplink payload: unknown protocol version";
const notApplicableError = "invalid uplink payload: N/A gps coordinates";

const protocol0CStr = "0C";
const protocol0cStr = "0c";
const protocol80Str = "80";
const reservedStr = "Reserved";
const beaconTrackingReportStr = "Beacon tracking report";
const trackingReportStr = "Tracking report";
const shortHelpReportStr = "Short help report";
const beaconHelpReportStr = "Beacon help report";
const helpReportStr = "Help report";
const shortTrackingReportStr = "Short tracking report";
const beaconNotAvailableStr = "Beacon not available";
const iBeaconStr = "iBeacon";
const eddystoneBeaconStr = "Eddystone Beacon";
const altBeaconStr = "ALT Beacon";
const unknownBeaconStr = "unknown beacon";
const unknownReportTypeStr = "unknown report type";
const pingReportStr = "Ping report";
const periodicModeReportStr = "Periodic mode report";
const motionModeStaticReportStr = "Motion mode static report";
const motionModeMovingReportStr = "Motion mode moving report";
const motionModeStaticToMovingReportStr = "Motion mode static to moving report";
const motionModeMovingToStaticReportStr = "Motion mode moving to static report";
const lowBatteryAlarmReportStr = "Low battery alarm report";
const powerOnTempStr = "Power on (temperature)";
const powerOffTempStr = "Power off (temperature)";
const powerOffLowBatteryStr = "Power off (low battery)";
const externalGpsFailReportStr = "External GPS antenna fail report";
const scheduleReportStr = "Schedule report";
const notFixStr = "Not fix";
const fix2DStr = "2D fix";
const fix3DStr = "3D fix";
const unknownStatusStr = "unknown status";
const notApplicableStr = "N/A";

/*
............................................................................................................................
 this part is needed to convert from/to several types of data
............................................................................................................................
*/

//  convert a string hex to decimal by defining also the starting and ending positions
function hexToDec(payloadHex, beginPos, endPos) {
    if (payloadHex == null || payloadHex.length === 0) return 0;
    return parseInt(payloadHex.substring(beginPos, endPos), 16);
}

//  if the input is an array of bytes, this method convert it to string hex
function bytesToHex(bytes) {
    return Array.from(bytes, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
}

//  reverse bytes of the hex string and return it as a string
function invertBytes(str) {
    if (str == null) return "";
    if (str.length === 0) return "";
    if (str.length % 2 !== 0) return "";

    const size = str.length;
    const buffer = [];
    for (let i = size - 1; i > 0; i -= 2) {
        buffer.push(str.substring(i - 1, i + 1));
    }
    return buffer.join("");
}

//  if the value represent negative number, we need to calculate complement
function complement2Byte4(hexToDec) {
    if (hexToDec < 0x80000000) return hexToDec;
    else return -((hexToDec - 1) ^ 0xffffffff);
}

//  match between the payload and the protocol version of the device used
function getProtocolVersion(devType) {
    switch (devType) {
        case 12:
            return protocol0CStr;
        case 128:
            return protocol80Str;
        default:
            return reservedStr;
    }
}

//  match between the payload and the command id used
function getCommandId(commandId) {
    switch (commandId) {
        case 4866:
            return beaconTrackingReportStr;
        case 4098:
            return trackingReportStr;
        case 1:
            return shortHelpReportStr;
        case 1792:
            return beaconHelpReportStr;
        case 2816:
            return helpReportStr;
        case 131:
            return shortTrackingReportStr;
        default:
            return reservedStr;
    }
}

//  match between the payload and the beacon type of the device
function getBeaconType(stat) {
    switch (stat) {
        case 0:
            return beaconNotAvailableStr;
        case 1:
            return iBeaconStr;
        case 2:
            return eddystoneBeaconStr;
        case 3:
            return altBeaconStr;
        default:
            return unknownBeaconStr;
    }
}

//  match between the payload and the alarm type of the device
function getAlarmType(rep) {
    switch (rep) {
        case 1:
            return helpReportStr;
        default:
            return unknownReportTypeStr;
    }
}

//  match between the payload and the report type of the device
function getReportType(rep) {
    switch (rep) {
        case 1:
            return pingReportStr;
        case 2:
            return periodicModeReportStr;
        case 4:
            return motionModeStaticReportStr;
        case 5:
            return motionModeMovingReportStr;
        case 6:
            return motionModeStaticToMovingReportStr;
        case 7:
            return motionModeMovingToStaticReportStr;
        case 14:
            return helpReportStr;
        case 15:
            return lowBatteryAlarmReportStr;
        case 17:
            return powerOnTempStr;
        case 19:
            return powerOffLowBatteryStr;
        case 20:
            return powerOffTempStr;
        case 25:
            return externalGpsFailReportStr;
        case 26:
            return scheduleReportStr;
        default:
            return unknownReportTypeStr;
    }
}

//  match between the payload and the gps fix status of the device
function getGpsFixStatus(stat) {
    switch (stat) {
        case 0:
            return notFixStr;
        case 1:
            return fix2DStr;
        case 2:
            return fix3DStr;
        default:
            return unknownStatusStr;
    }
}

//  extract timesstamp in UTC format from the payload
function extractTimestamp(data) {
    const value =
        hexToDec(data.substring(0, 2)) +
        hexToDec(data.substring(2, 4)) * 256 +
        hexToDec(data.substring(4, 6)) * 256 * 256 +
        hexToDec(data.substring(6, 8)) * 256 * 256 * 256;
    const date = new Date(value * 1000);
    return date.toUTCString();
}

/*
............................................................................................................................
 this part is implemented by us, four javascript functions that a driver can declare to perform encoding and decoding tasks.
............................................................................................................................
*/

//  this function used by the driver to decode the uplink and return an object decoded
function decodeUplink(input) {
    const result = {};
    let payloadHex;

    if (input.bytes != null) {
        if (typeof input.bytes !== "string") {
            payloadHex = bytesToHex(input.bytes);
        } else {
            payloadHex = input.bytes;
        }
    } else {
        throw new Error(emptyUplinkError);
    }

    const nbBytes = payloadHex.length / 2;
    const protocol = payloadHex.substring(0, 2);

    switch (protocol) {
        case protocol0CStr:
        case protocol0cStr:
            if (!(nbBytes === 17 || nbBytes === 27)) {
                result.decoderAvailable = false;
                result.gpsAvailable = false;
                return result;
            } else {
                result.protocolVersion = hexToDec(payloadHex, 0, 2);
                result.protocolVersionTxt = getProtocolVersion(result.protocolVersion);

                result.commandId = hexToDec(payloadHex, 2, 6);
                result.commandIdTxt = getCommandId(result.commandId);

                if (result.commandId === 4866 || result.commandId === 1792) {
                    //Beacon
                    result.uuid = invertBytes(payloadHex.substring(6, 46));

                    let fixStatusAndReportType = hexToDec(payloadHex, 46, 48);

                    //Bit5-7
                    result.beaconType = (fixStatusAndReportType & 0xe0) >> 5;
                    result.beaconTypeTxt = getBeaconType(result.beaconType);

                    //Bit0-4
                    if (result.commandId === 1792) {
                        result.alarmType = fixStatusAndReportType & 0x1f;
                        result.alarmTypeTxt = getAlarmType(result.alarmType);
                    } else {
                        result.reportType = fixStatusAndReportType & 0x1f;
                        result.reportTypeTxt = getReportType(result.reportType);
                    }

                    result.rssi = hexToDec(payloadHex, 48, 50);
                    result.txPower = hexToDec(payloadHex, 50, 52);
                    result.batteryCapacity = hexToDec(payloadHex, 52, 54);
                } else {
                    //  Tracking or Help
                    const longitudePayload = complement2Byte4(hexToDec(invertBytes(payloadHex.substring(6, 14))));
                    const longitudeVal = longitudePayload * 0.000001;
                    result.longitude = longitudeVal;
                    if (longitudeVal >= -180 && longitudeVal <= 180) {
                        result.longitudeTxt = longitudeVal.toString();
                    } else {
                        result.longitudeTxt = notApplicableStr;
                    }

                    const latitudePayload = complement2Byte4(hexToDec(invertBytes(payloadHex.substring(14, 22))));
                    const latitudeVal = latitudePayload * 0.000001;
                    result.latitude = latitudeVal;
                    if (latitudeVal >= -90 && latitudeVal <= 90) {
                        result.latitudeTxt = latitudeVal.toString();
                    } else {
                        result.latitudeTxt = notApplicableStr;
                    }

                    const fixStatusAndReportType = hexToDec(payloadHex, 22, 24);
                    //Bit5-7
                    result.gpsFixStatus = (fixStatusAndReportType & 0xe0) >> 5;
                    result.gpsFixStatusTxt = getGpsFixStatus(result.gpsFixStatus);
                    //Bit0-4
                    if (result.commandId === 2816) {
                        result.alarmType = fixStatusAndReportType & 0x1f;
                        result.alarmTypeTxt = getAlarmType(result.alarmType);
                    } else {
                        result.reportType = fixStatusAndReportType & 0x1f;
                        result.reportTypeTxt = getReportType(result.reportType);
                    }
                    result.batteryCapacity = hexToDec(payloadHex, 24, 26);

                    result.timestamp = extractTimestamp(payloadHex.substring(26, 34));

                    result.gpsAvailable = true;
                }
            }
            break;

        case protocol80Str:
            if (nbBytes !== 11) {
                result.decoderAvailable = false;
            } else {
                result.protocolVersion = hexToDec(payloadHex, 0, 2);
                result.protocolVersionTxt = getProtocolVersion(result.protocolVersion);

                result.commandId = hexToDec(payloadHex, 2, 4);
                result.commandIdTxt = getCommandId(result.commandId);

                var longitudePayload = complement2Byte4(hexToDec(invertBytes(payloadHex.substring(4, 12))));
                var longitudeVal = longitudePayload * 0.000001;
                result.longitude = longitudeVal;
                if (longitudeVal >= -180 && longitudeVal <= 180) {
                    result.longitudeTxt = longitudeVal.toString();
                } else {
                    result.longitudeTxt = notApplicableStr;
                }

                var latitudePayload = complement2Byte4(hexToDec(invertBytes(payloadHex.substring(12, 20))));
                var latitudeVal = latitudePayload * 0.000001;
                result.latitude = latitudeVal;
                if (latitudeVal >= -90 && latitudeVal <= 90) {
                    result.latitudeTxt = latitudeVal.toString();
                } else {
                    result.latitudeTxt = notApplicableStr;
                }

                var fixStatusAndReportType = hexToDec(payloadHex, 20, 22);
                //Bit5-7
                result.gpsFixStatus = (fixStatusAndReportType & 0xe0) >> 5;
                result.gpsFixStatusTxt = getGpsFixStatus(result.gpsFixStatus);
                //Bit0-4
                if (result.commandId === 1) {
                    result.alarmType = fixStatusAndReportType & 0x1f;
                    result.alarmTypeTxt = getAlarmType(result.alarmType);
                } else {
                    result.reportType = fixStatusAndReportType & 0x1f;
                    result.reportTypeTxt = getReportType(result.reportType);
                }

                result.gpsAvailable = true;
            }
            break;

        default:
            throw new Error(protocolError);
    }

    return result;
}

exports.decodeUplink = decodeUplink;

