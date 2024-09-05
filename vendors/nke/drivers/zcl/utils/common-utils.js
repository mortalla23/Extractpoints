function checkRequiredField(object, fieldName) {
  if (object[fieldName] === undefined) {
    throw "field " + fieldName + " is missing";
  }
}

exports.checkRequiredField = checkRequiredField;

function checkIntField(object, fieldName) {
  if (!Number.isInteger(object[fieldName])) {
    throw fieldName + " must be an integer, found: " + object[fieldName];
  }
}

exports.checkIntField = checkIntField;

function decimalToHex(d, padding) {
  let hex = Number(d).toString(16).toUpperCase();
  padding =
    typeof padding === "undefined" || padding === null
      ? (padding = 2)
      : padding;

  while (hex.length < padding) {
    hex = "0" + hex;
  }

  return "0x" + hex;
}

exports.decimalToHex = decimalToHex;

function parseHexString(str) {
  let result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));

    str = str.substring(2, str.length);
  }

  return result;
}

exports.parseHexString = parseHexString;

function decimalToHexStr(d, padding) {
  let hex = Number(d).toString(16).toUpperCase();
  padding =
    typeof padding === "undefined" || padding === null
      ? (padding = 2)
      : padding;

  while (hex.length < padding) {
    hex = "0" + hex;
  }
  return hex;
}

exports.decimalToHexStr = decimalToHexStr;

function bytesToHex(byteArray) {
  let result = "";
  for (let i = 0; i <= byteArray.length - 1; i++) {
    result = result + decimalToHexStr(byteArray[i]).toLowerCase();
  }
  return result;
}

exports.bytesToHex = bytesToHex;

function bytesToAscii(bytes) {
  let hex = bytesToHex(bytes);
  let str = "";
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

exports.bytesToAscii = bytesToAscii;

function specificBytesToAscii(bytes, start, end) {
  let hex = bytesToHex(bytes);
  let str = "";
  for (let n = start; n < end; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

exports.specificBytesToAscii = specificBytesToAscii;

function asciiToBytes(s) {
  let bytes = [];
  for (let i = 0; i < s.length; i++) {
    bytes.push(s.charCodeAt(i));
  }
  return bytes;
}

exports.asciiToBytes = asciiToBytes;

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
}

exports.hexToBytes = hexToBytes;

function hexToDec(payloadHex) {
  if (payloadHex == null || payloadHex.length == 0) return 0;
  return parseInt(payloadHex, 16);
}

exports.hexToDec = hexToDec;

function bytesToDec(payloadBytes) {
  const hex = bytesToHex(payloadBytes);
  const result = hexToDec(hex);
  return result;
}

exports.bytesToDec = bytesToDec;

function signedBytesToDec(payloadBytes, size) {
  const hex = bytesToHex(payloadBytes);
  const result = hexToDec(hex);
  if (size === 1) {
    if (result < 0x80) return result;
    else return -((result - 1) ^ 0xff);
  } else if (size == 2) {
    if (result < 0x8000) return result;
    else return -((result - 1) ^ 0xffff);
  } else if (size === 3) {
    if (result < 0x800000) return result;
    else return -((result - 1) ^ 0xffffff);
  } else if (size === 4) {
    if (result < 0x80000000) return result;
    else return -((result - 1) ^ 0xffffffff);
  }
}

exports.signedBytesToDec = signedBytesToDec;

function decToBytes(number) {
  if (number < 0) {
    number = 0xffff + number + 1;
  }
  var result = number.toString(16);
  if (result.length % 2 != 0) {
    result = "0".concat(result);
  }
  return hexToBytes(result);
}

exports.decToBytes = decToBytes;

function stringToUtf8ByteArray(str) {
  var out = [], p = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = (c >> 6) | 192;
      out[p++] = (c & 63) | 128;
    } else if (
        ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
        ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
      // Surrogate Pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      out[p++] = (c >> 18) | 240;
      out[p++] = ((c >> 12) & 63) | 128;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    } else {
      out[p++] = (c >> 12) | 224;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    }
  }
  return out;
};

exports.stringToUtf8ByteArray = stringToUtf8ByteArray;

function utf8ByteArrayToString(bytes) {
  var out = [], pos = 0, c = 0;
  while (pos < bytes.length) {
    var c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      var c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      // Surrogate Pair
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      var c4 = bytes[pos++];
      var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
          0x10000;
      out[c++] = String.fromCharCode(0xD800 + (u >> 10));
      out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
    } else {
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      out[c++] =
          String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join("");
};

exports.utf8ByteArrayToString = utf8ByteArrayToString;

function bytes2Float32(payloadBytes) {
  const hex = bytesToHex(payloadBytes);
  const bytes = hexToDec(hex);
  var sign = bytes & 0x80000000 ? -1 : 1,
      exponent = ((bytes >> 23) & 0xff) - 127,
      significand = bytes & ~(-1 << 23)

  if (exponent === 128) {
    return sign * (significand ? Number.NaN : Number.POSITIVE_INFINITY)
  }

  if (exponent === -127) {
    if (significand === 0) {
      return 0
    }
    exponent = -126
    significand /= 1 << 22
  } else {
    significand = (significand | (1 << 23)) / (1 << 23)
  }

  return sign * significand * Math.pow(2, exponent)
}

exports.bytes2Float32 = bytes2Float32;

function float32ToBytes(float32){
  const getHex = i => ('00' + i.toString(16)).slice(-2);
  var view = new DataView(new ArrayBuffer(4))
  view.setFloat32(0, float32);
  return this.hexToBytes(Array.apply(null, { length: 4 }).map((_, i) => getHex(view.getUint8(i))).join(''));

}
exports.float32ToBytes = float32ToBytes;

function getPowerMode(byte) {
  switch (byte) {
    case 0x00:
      return "ON_WHEN_IDLE";
    case 0x01:
      return "PERIODICALLY_ON";
    case 0x02:
      return "ON_ON_USER_EVENT";
  }
}

exports.getPowerMode = getPowerMode;

function encodePowerMode(byte) {
  switch (byte) {
    case "ON_WHEN_IDLE":
      return 0x00;
    case "PERIODICALLY_ON":
      return 0x01;
    case "ON_ON_USER_EVENT":
      return 0x02;
  }
}

exports.encodePowerMode = encodePowerMode;

function getPowerSource(byte) {
  switch (byte) {
    case 0x01:
      return "CONSTANT_OR_EXTERNAL_POWER";
    case 0x02:
      return "RECHARGEABLE_BATTERY";
    case 0x04:
      return "DISPOSABLE_BATTERTY";
    case 0x08:
      return "SOLAR_HARVESTING";
    case 0x10:
      return "TIC_HARVESTING";
    default:
      return "NO";
  }
}

exports.getPowerSource = getPowerSource;

function encodePowerSource(byte) {
  switch (byte) {
    case "CONSTANT_OR_EXTERNAL_POWER":
      return 0x01;
    case "RECHARGEABLE_BATTERY":
      return 0x02;
    case "DISPOSABLE_BATTERTY":
      return 0x04;
    case "SOLAR_HARVESTING":
      return 0x08;
    case "TIC_HARVESTING":
      return 0x10;
    case "NO":
      return 0x00;
  }
}

exports.encodePowerSource = encodePowerSource;

function getDataRateStart(byte) {
  if (byte == 0xfe) {
    return "min";
  } else if (byte == 0xff) {
    return "max";
  } else {
    return byte.toString();
  }
}

exports.getDataRateStart = getDataRateStart;

function encodeDataRateStart(string) {
  if (string == "min") {
    return 0xfe;
  } else if (string == "max") {
    return 0xff;
  } else {
    return parseInt(string, 10);
  }
}

exports.encodeDataRateStart = encodeDataRateStart;

function getReportType(byte) {
  switch (byte) {
    case 0x01:
      return "StandardReports";
    case 0x02:
      return "BatchReports";
    case 0x03:
      return "StandardAndBatchReports";
  }
}

exports.getReportType = getReportType;

function encodeReportType(string) {
  switch (string) {
    case "StandardReports":
      return 0x01;
    case "BatchReports":
      return 0x02;
    case "StandardAndBatchReports":
      return 0x03;
  }
}

exports.encodeReportType = encodeReportType;

function getPolarity(byte) {
  switch (byte) {
    case 0x00:
      return "NORMAL";
    case 0x01:
      return "REVERSED";
  }
}

exports.getPolarity = getPolarity;

function getEdgeSelection(byte) {
  switch (byte) {
    case 0x01:
      return "FALLING_EDGE";
    case 0x02:
      return "RISING_EDGE";
    case 0x03:
      return "BOTH_RISING_AND_FALLING";
    case 0x05:
      return "POLLING_AND_FALLING_EDGE";
    case 0x06:
      return "POLLING_AND_RISING_EDGE";
    case 0x07:
      return "POLLING_AND_BOTH_RISING_FALLING_EDGE";
  }
}

exports.getEdgeSelection = getEdgeSelection;

function getApplicationType(bytes) {
  if (bytesToDec(bytes) == 0x010002) {
    return "MOTION_DETECTION";
  } else if (bytesToDec(bytes) === 0xffffff) {
    return "UNDEFINED";
  }
}

exports.getApplicationType = getApplicationType;

function encodePolarity(string) {
  switch (string) {
    case "NORMAL":
      return 0x00;
    case "REVERSED":
      return 0x01;
  }
}

exports.encodePolarity = encodePolarity;

function encodeEdgeSelection(byte) {
  switch (byte) {
    case "FALLING_EDGE":
      return 0x01;
    case "RISING_EDGE":
      return 0x02;
    case "BOTH_RISING_AND_FALLING":
      return 0x03;
    case "POLLING_AND_FALLING_EDGE":
      return 0x05;
    case "POLLING_AND_RISING_EDGE":
      return 0x06;
    case "POLLING_AND_BOTH_RISING_FALLING_EDGE":
      return 0x07;
  }
}

exports.encodeEdgeSelection = encodeEdgeSelection;

function encodeApplicationType(string) {
  if (string == "MOTION_DETECTION") {
    return [0x01, 0x00, 0x02];
  } else if (string == "UNDEFINED") {
    return [0xff, 0xff, 0xff];
  }
}

exports.encodeApplicationType = encodeApplicationType;

function getVolumeUnit(byte) {
  switch (byte) {
    case 0x00:
      return "DECILITER";
    case 0x01:
      return "LITER";
  }
}

exports.getVolumeUnit = getVolumeUnit;

function encodeVolumeUnit(string) {
  switch (string) {
    case "DECILITER":
      return 0x00;
    case "LITER":
      return 0x01;
  }
}

exports.encodeVolumeUnit = encodeVolumeUnit;

function getResetValue(byte) {
  switch (byte) {
    case 0x00:
      return "RESET_VOLUME";
    case 0x01:
      return "RESET_MIN_FLOW";
    case 0x10:
      return "RESET_MAX_FLOW";
  }
}

exports.getResetValue = getResetValue;

function encodeResetValue(string) {
  switch (string) {
    case "RESET_VOLUME":
      return 0x00;
    case "RESET_MIN_FLOW":
      return 0x01;
    case "RESET_MAX_FLOW":
      return 0x10;
  }
}

exports.encodeResetValue = encodeResetValue;


function getFlowUnit(byte) {
  switch (byte) {
    case 0x00:
      return "LITER_PER_MINUTE";
    case 0x01:
      return "DECILITER_PER_HOUR";
  }
}

exports.getFlowUnit = getFlowUnit;

function encodeFlowUnit(string) {
  switch (string) {
    case "LITER_PER_MINUTE":
      return 0x00;
    case "DECILITER_PER_HOUR":
      return 0x01;
  }
}

exports.encodeFlowUnit = encodeFlowUnit;

function getMeterType(byte){
  switch (byte){
    case 0x01:
      return "CONCENTRATEUR_TELEPORT";
    case 0x02:
      return "CBE_MONOPHASE";
    case 0x03:
      return "CBE_MONOPHASE_ICC";
    case 0x04:
      return "CBE_TRIPHASE";
    case 0x05:
      return "CJE";
    case 0x06:
      return "CICE";
    case 0x07:
      return "TIC_STD";
    case 0x08:
      return "TIC_PMEPMI";
    case 0x09:
      return "TIC_PMEPMI_2013";
    default:
      return "UNKNOWN";
  }
}

exports.getMeterType = getMeterType;

function encodeMeterType(data){
  switch (data){
    case "CONCENTRATEUR_TELEPORT":
      return 0x01;
    case "CBE_MONOPHASE":
      return 0x02;
    case "CBE_MONOPHASE_ICC":
      return 0x03;
    case "CBE_TRIPHASE":
      return 0x04;
    case "CJE":
      return 0x05;
    case "CICE":
      return 0x06;
    case "TIC_STD":
      return 0x07;
    case "TIC_PMEPMI":
      return 0x08;
    case "TIC_PMEPMI_2013":
      return 0x09;
    default:
      return 0x00;
  }
}

exports.encodeMeterType = encodeMeterType;

function decodeReportParamters(byte){

    const Batch = byte >> 7 & 0x01 === 1 ? "Yes": "No";
    const NoHeaderPort = byte >> 6 & 0x01 === 1 ? "Yes": "No";
    const Secured = byte >> 5 & 0x01 === 1 ? "Yes": "No";
    const SecuredIfAlarm = byte >> 4 & 0x01 === 1 ? "Yes": "No";
    let CauseRequest;
    switch(byte >> 3 & 0x11){
      case 0x00:
        CauseRequest = "No";
        break;
      case 0x01:
        CauseRequest = "Short";
        break;
      case 0x10:
        CauseRequest = "Long";
        break;
      case 0x11:
        CauseRequest = "Reserved";
        break;
    }
    const Reserved = byte >> 1 & 0x01;
    const New = byte  & 0x01 === 1 ? "Yes": "No";
    return {
      Batch: Batch,
      NoHeaderPort: NoHeaderPort,
      Secured: Secured,
      SecuredIfAlarm: SecuredIfAlarm,
      CauseRequest: CauseRequest,
      Reserved: Reserved,
      New: New
    }

}

exports.decodeReportParamters = decodeReportParamters;

function getReportUnit(byte) {
  switch (byte >> 7 & 0x01) {
    case 0x00:
      return "Seconds";
    case 0x01:
      return "Minutes";
  }
}

exports.getReportUnit = getReportUnit;

function encodeReportUnit(unit) {
  switch (unit) {
    case "Seconds":
      return 0x00;
    case "Minutes":
      return 0x80;
  }
}

exports.encodeReportUnit = encodeReportUnit;

function getAnalogInputApplicationType(bytes){
  switch (bytesToDec(bytes)){
    case 0x00050000:
      return {
        ApplicationType: "Carbon Dioxide Analog Input",
        Unit: "PPM"
      }
    case 0x00ff0000:
      return {
        ApplicationType: "Others",
        Unit: "mA"
      }
    case 0x00ff0001:
      return {
        ApplicationType: "Others",
        Unit: "mV"
      }
    default:
      return {
        SinglePrecisionValue: bytes2Float32(bytes)
      }
  }
}

exports.getAnalogInputApplicationType = getAnalogInputApplicationType;