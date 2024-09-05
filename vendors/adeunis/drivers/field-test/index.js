/*

***********************This driver is written according to the documentation of the FTD_LORAWAN V2.0.0 attached in the specification********************************

*/

/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/

const emptyUplinkError = "invalid uplink payload: no data received";
const emptyExtractError = "invalid extractPoints input: no data received";
const timeExtractError = "invalid extractPoints input: no time assigned";
const lengthError = "invalid uplink payload: wrong length";
const notApplicableError = "invalid uplink payload: N/A gps coordinates";

const goodStr = "GOOD";
const averageStr = "AVERAGE";
const poorStr = "POOR";

const westStr = "WEST";
const eastStr = "EAST";
const northStr = "NORTH";
const southStr = "SOUTH";

var legacyMode;
var tempAvailable;
var gpsAvailable;
var upcntAvailable;
var downcntAvailable;
var batteryAvailable;
var rssisnrAvailable;
var triggeredByAccelerometer;
var triggeredByPushbutton;

/*
............................................................................................................................
 this part is needed to convert from/to several types of data
............................................................................................................................
*/

//  convert a string hex to decimal by defining also the starting and ending positions
function hexToDec(payloadHex, beginPos, endPos) {
    if (payloadHex == null || payloadHex.length == 0) return 0;
    return parseInt(payloadHex.substring(beginPos, endPos), 16);
}

//  if the input is an array of bytes, this method convert it to string hex
function bytesToHex(bytes) {
    return Array.from(bytes, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
}

//  if the value represent negative number, we need to calculate complement
function complement2Byte(hexToDec) {
    if (hexToDec < 0x80) return hexToDec;
    else return -((hexToDec - 1) ^ 0xff);
}

// match the hemisphere for latitude with the payload
function getHemisphere(data, coordinate) {
    if (coordinate == "latitude") {
        switch (data) {
            case 0:
                return northStr;
            case 1:
                return southStr;
        }
    } else if (coordinate == "longitude") {
        switch (data) {
            case 0:
                return eastStr;
            case 1:
                return westStr;
        }
    }
}

//  extract the longitude and latitude from minutes, degrees, hemisphere
function extractCoordinates(hemisphere, degrees, minutes) {
    let value = degrees + minutes * 0.01666666666666666666666666666666667;
    if (hemisphere == westStr || hemisphere == southStr) {
        value *= -1;
    }
    return parseFloat(value.toFixed(4));
}

//  match between the payload and the status that gives the sensors enabled
function setStatus(hexToDec) {
    /*
      Bit 7 = 1 : T°C info is present
      Bit 6 = 1 : accelerometer was triggered
      Bit 5 = 1 : BTN1 was triggered
      Bit 4 = 1 : GPS info is present
      Bit 3 : Up Counter is present
      Bit 2 : Down Counter is present
      Bit 1 = 1 : Battery voltage information is present
      Bit 0 : RSSI-SNR information is present
    */

    if ((hexToDec & 0x80) >= 1) {
        tempAvailable = true;
    }
    if ((hexToDec & 0x40) >= 1) {
        triggeredByAccelerometer = true;
    }
    if ((hexToDec & 0x20) >= 1) {
        triggeredByPushbutton = true;
    }
    if ((hexToDec & 0x10) >= 1) {
        gpsAvailable = true;
    }
    if ((hexToDec & 0x08) >= 1) {
        upcntAvailable = true;
    }
    if ((hexToDec & 0x04) >= 1) {
        downcntAvailable = true;
    }
    if ((hexToDec & 0x02) >= 1) {
        batteryAvailable = true;
    }
    if ((hexToDec & 0x01) >= 1) {
        rssisnrAvailable = true;
    }
}

/*
............................................................................................................................
 this part is implemented by us, four javascript functions that a driver can declare to perform encoding and decoding tasks.
............................................................................................................................
*/

//  this function used by the driver to decode the uplink and return an object decoded
function decodeUplink(input) {
    let result = {};
    let payloadHex;
    legacyMode = false;
    tempAvailable = false;
    gpsAvailable = false;
    upcntAvailable = false;
    downcntAvailable = false;
    batteryAvailable = false;
    rssisnrAvailable = false;
    triggeredByAccelerometer = false;
    triggeredByPushbutton = false;

    if (input.bytes) {
        if (typeof input.bytes !== "string") {
            payloadHex = bytesToHex(input.bytes);
        } else {
            payloadHex = input.bytes;
        }
    } else {
        throw new Error(emptyUplinkError);
    }

    let nbBytes = payloadHex.length / 2;

    setStatus(hexToDec(payloadHex, 0, 2));

    const payloadLegacyMode =
        1 +
        tempAvailable +
        gpsAvailable * 8 +
        upcntAvailable +
        downcntAvailable +
        batteryAvailable * 2 +
        rssisnrAvailable * 2;

    const payloadNormalMode =
        1 +
        tempAvailable +
        gpsAvailable * 9 +
        upcntAvailable +
        downcntAvailable +
        batteryAvailable * 2 +
        rssisnrAvailable * 2;

    if (nbBytes == payloadLegacyMode) {
        legacyMode = true;
    } else if (nbBytes != payloadNormalMode) {
        throw new Error(lengthError);
    }

    if (triggeredByAccelerometer) {
        result.triggeredByAccelerometer = true;
    } else {
        result.triggeredByAccelerometer = false;
    }

    if (triggeredByPushbutton) {
        result.triggeredByPushbutton = true;
    } else {
        result.triggeredByPushbutton = false;
    }

    let pos = 2;
    if (tempAvailable) {
        pos += 2;
        result.temperature = hexToDec(payloadHex, 2, 4);
        if (result.temperature >= 128) {
            result.temperature = -result.temperature + 1;
        }
    }

    if (gpsAvailable) {
        result.gps = {};
        // result.gps.latitude = getLatitude(payloadHex.substring(pos, pos + 8));
        let latTensDegrees = hexToDec(payloadHex, pos + 0, pos + 1);
        let latUnitsDegrees = hexToDec(payloadHex, pos + 1, pos + 2);
        let latTensMinutes = hexToDec(payloadHex, pos + 2, pos + 3);
        let latUnitsMinutes = hexToDec(payloadHex, pos + 3, pos + 4);
        let latTenthsMinutes = hexToDec(payloadHex, pos + 4, pos + 5);
        let latHundredthsMinutes = hexToDec(payloadHex, pos + 5, pos + 6);
        let latThousandthsMinutes = hexToDec(payloadHex, pos + 6, pos + 7);
        result.gps.latitude = {};
        result.gps.latitude.hemisphere = getHemisphere(hexToDec(payloadHex, pos + 7, pos + 8), "latitude");
        result.gps.latitude.degrees = latTensDegrees * 10 + latUnitsDegrees;
        result.gps.latitude.minutes =
            latTensMinutes * 10 +
            latUnitsMinutes +
            latTenthsMinutes * 0.1 +
            latHundredthsMinutes * 0.01 +
            latThousandthsMinutes * 0.001;
        pos += 8;

        // result.gps.longitude = getLongitude(payloadHex.substring(pos, pos + 8));
        let longHundredsDegrees = hexToDec(payloadHex, pos + 0, pos + 1);
        let longTensDegrees = hexToDec(payloadHex, pos + 1, pos + 2);
        let longUnitsDegrees = hexToDec(payloadHex, pos + 2, pos + 3);
        let longTensMinutes = hexToDec(payloadHex, pos + 3, pos + 4);
        let longUnitsMinutes = hexToDec(payloadHex, pos + 4, pos + 5);
        let longTenthsMinutes = hexToDec(payloadHex, pos + 5, pos + 6);
        let longHundredthsMinutes = hexToDec(payloadHex, pos + 6, pos + 7);
        result.gps.longitude = {};
        result.gps.longitude.hemisphere = getHemisphere(hexToDec(payloadHex, pos + 7, pos + 8), "longitude");
        result.gps.longitude.degrees = longHundredsDegrees * 100 + longTensDegrees * 10 + longUnitsDegrees;
        result.gps.longitude.minutes =
            longTensMinutes * 10 + longUnitsMinutes + longTenthsMinutes * 0.1 + longHundredthsMinutes * 0.01;
        pos += 8;
        if (!legacyMode) {
            let qualityGPS = hexToDec(payloadHex, pos, pos + 2);
            pos += 2;
            let quality = qualityGPS >> 4;
            if (quality == 1) {
                result.gps.quality = goodStr;
            }
            if (quality == 2) {
                result.gps.quality = averageStr;
            }
            if (quality == 3) {
                result.gps.quality = poorStr;
            }
            result.gps.satellites = qualityGPS & 0x0f;
        }
    }

    if (upcntAvailable) {
        result.uplinkFrameCounter = hexToDec(payloadHex, pos, pos + 2);
        pos += 2;
    }
    if (downcntAvailable) {
        result.downlinkFrameCounter = hexToDec(payloadHex, pos, pos + 2);
        pos += 2;
    }
    if (batteryAvailable) {
        result.batteryVoltage = hexToDec(payloadHex, pos, pos + 4);
        pos += 4;
    }
    if (rssisnrAvailable) {
        result.rssi = 0 - hexToDec(payloadHex, pos, pos + 2);
        pos += 2;
        result.snr = complement2Byte(hexToDec(payloadHex, pos, pos + 2));
        pos += 2;
    }

    return result;
}

exports.decodeUplink = decodeUplink;


