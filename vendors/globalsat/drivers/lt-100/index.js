/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/

var emptyUplinkError = "invalid uplink payload: no data received";
var emptyExtractError = "invalid extractPoints input: no data received";
var timeExtractError = "invalid extractPoints input: no time assigned";
var lengthError = "invalid uplink payload: wrong length";

var deviceTypeString = "LS100";
var notFixString = "Not fix";
var fixed2DString = "2D fixed";
var fixed3DString = "3D fixed";
var unknownStatusString = "unknown status";
var periodicString = "Periodic mode report";
var motionStaticString = "Motion mode static report";
var motionMovingString = "Motion mode moving report";
var motionStaticToMovingString = "Motion mode static to moving report";
var motionMovingToStaticString = "Motion mode moving to static report";
var helpString = "Help report";
var lowBatteryString = "Low battery alarm report";
var powerOnTempString = "Power on (temperature)";
var powerOffLowBattString = "Power off (low battery)";
var powerOffTempString = "Power off (temperature)";
var unknownReportString = "unknown report type";

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

//  if the input is an array of bytes, this function convert it to a string of hex
function bytesToHex(bytes) {
    return Array.from(bytes, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
}

//  if the input is a string of hex, this function converts it to an array of bytes
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

//  to extract the signed integer from an array of bytes
function extractSignedInt(bytes) {
    if (typeof bytes === "string") {
        bytes = hexToBytes(bytes);
    }
    bytes = bytes.reverse();
    var u8 = new Int8Array(bytes);
    var u32bytes = u8.buffer.slice(-4);
    return new Int32Array(u32bytes)[0];
}

//  match between the payload and the device type
function getDeviceType(devType) {
    return deviceTypeString;
}
//  match between the payload and the device types to know the fix status of the device
function getFixStatus(fix) {
    switch (fix) {
        case 0:
            return notFixString;
        case 1:
            return fixed2DString;
        case 2:
            return fixed3DString;
        default:
            return unknownStatusString;
    }
}

//  match between the payload and the report types to know the status of the device
function getReportType(repType) {
    switch (repType) {
        case 2:
            return periodicString;
        case 4:
            return motionStaticString;
        case 5:
            return motionMovingString;
        case 6:
            return motionStaticToMovingString;
        case 7:
            return motionMovingToStaticString;
        case 14:
            return helpString;
        case 15:
            return lowBatteryString;
        case 17:
            return powerOnTempString;
        case 19:
            return powerOffLowBattString;
        case 20:
            return powerOffTempString;
        default:
            return unknownReportString;
    }
}

/*
............................................................................................................................
 this part is implemented by us, four javascript functions that a driver can declare to perform encoding and decoding tasks.
............................................................................................................................
*/

//  this function used by the driver to decode the uplink and return an object decoded
function decodeUplink(input) {
    var result = {};
    var payloadHex;

    if (input.bytes != null) {
        if (typeof input.bytes !== "string") {
            payloadHex = bytesToHex(input.bytes);
        } else {
            payloadHex = input.bytes;
        }
    } else {
        throw new Error(emptyUplinkError);
    }

    var nbBytes = payloadHex.length / 2;

    if (nbBytes !== 11) {
        result.decoderAvailable = false;
        return result;
    }

    result.decoderAvailable = true;

    result.deviceType = hexToDec(payloadHex, 0, 2);
    result.deviceTypeTxt = getDeviceType(result.deviceType);

    var fixStatusAndReportType = hexToDec(payloadHex, 2, 4);
    //Bit6-7
    result.gpsFixStatus = (fixStatusAndReportType & 0xc0) >> 6;
    result.gpsFixStatusTxt = getFixStatus(result.gpsFixStatus);
    //Bit0-5
    result.reportType = fixStatusAndReportType & 0x3f;
    result.reportTypeTxt = getReportType(result.reportType);

    result.batteryCapacity = hexToDec(payloadHex, 4, 6);

    var lat = extractSignedInt(payloadHex.substring(6, 14), 4);
    result.latitude = lat * 0.000001;
    result.latitudeTxt = result.latitude.toString();
    var lon = extractSignedInt(payloadHex.substring(14, 22), 4);
    result.longitude = lon * 0.000001;
    result.longitudeTxt = result.longitude.toString();

    result.gpsAvailable = true;

    return result;
}

exports.decodeUplink = decodeUplink;

