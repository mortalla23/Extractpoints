/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/

const emptyUplinkError = "invalid uplink payload: no data received";
const emptyExtractError = "invalid extractPoints input: no data received";
const timeExtractError = "invalid extractPoints input: no time assigned";
const lengthError = "invalid uplink payload: wrong length";
const unknownDeviceError = "invalid uplink payload: unknown device type";

const co2String = "CO2";
const coString = "CO";
const pm25String = "PM2.5";
const unknownString = "unknown device type";

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

//  if the value represent negative number, we need to calculate complement
function complement2Byte2(hexToDec) {
    if (hexToDec < 0x8000) return hexToDec;
    else return -((hexToDec - 1) ^ 0xffff);
}

//  match between the payload and the device types to know which LS11 device used
function getDeviceType(devType) {
    switch (devType) {
        case 0x01:
            return co2String;
        case 0x02:
            return coString;
        case 0x03:
            return pm25String;
        default:
            return unknownString;
    }
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

    var nbBytes = payloadHex.length / 2;

    if (nbBytes !== 7) {
        result.decoderAvailable = false;
        return result;
    }

    result.decoderAvailable = true;
    result.deviceType = hexToDec(payloadHex, 0, 2);
    result.deviceTypeTxt = getDeviceType(result.deviceType);
    const temperature = complement2Byte2(hexToDec(payloadHex, 2, 6));
    result.temperature = temperature * 0.01;
    result.humidity = hexToDec(payloadHex, 6, 10) * 0.01;
    result.gazDensity = hexToDec(payloadHex, 10, 14);

    return result;
}

exports.decodeUplink = decodeUplink;

