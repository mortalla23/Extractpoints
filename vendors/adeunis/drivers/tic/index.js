/*

***********************This driver is written according to the documentation of the TIC_LORAWAN v2.0.0 attached in the specification********************************

*/

/*
............................................................................................................................
 this part is needed to map the bytes needed in uplink and downlink to some variables names
............................................................................................................................
*/

//  these variables are needed to decode the uplink
const PRODUCT_CONFIGURATION = 0x10;
const NETWORK_CONFIGURATION = 0x20;
const KEEP_ALIVE = 0x30;
const REPLY_FRAME_TO_REGISTER_VALUE_REQUEST = 0x31;
const RESPONSE_FRAME_OF_UPDATE_REGISTER = 0x33;
const PERIODIC_DATA_FRAME = 0x49;
const ALARM_FRAME = 0x4a;

//  these variables are needed to encode/decode the downlink
const PRODUCT_CONFIGURATION_REQUEST_FRAME = 0x01;
const NETWORK_CONFIGURATION_REQUEST_FRAME = 0x02;
const REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA = 0x05;
const SPECIFIC_REGISTER_VALUE_REQUEST_FRAME = 0x40;
const FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS = 0x41;

const TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME = 0x00;
const PERIODIC_OF_ISSUE = 0x01;
const ACTIVATION_OF_THE_ACKNOWLEDGE_MODE = 0x03;
const PIN_CODE = 0x04;
const GLOBAL_OPERATION = 0x06;
const ACQUISITION_PERIOD = 0x14;
const LABEL_OF_THE_PERIODIC_DATA_1 = 0x1e;
const LENGTH_OF_THE_PERIODIC_DATA_1 = 0x1f;
const LABEL_OF_THE_PERIODIC_DATA_2 = 0x20;
const LENGTH_OF_THE_PERIODIC_DATA_2 = 0x21;
const LABEL_OF_THE_PERIODIC_DATA_3 = 0x22;
const LENGTH_OF_THE_PERIODIC_DATA_3 = 0x23;
const LABEL_OF_THE_PERIODIC_DATA_4 = 0x24;
const LENGTH_OF_THE_PERIODIC_DATA_4 = 0x25;
const LABEL_OF_THE_PERIODIC_DATA_5 = 0x26;
const LENGTH_OF_THE_PERIODIC_DATA_5 = 0x27;
const LABEL_OF_THE_PERIODIC_DATA_6 = 0x28;
const LENGTH_OF_THE_PERIODIC_DATA_6 = 0x29;
const LABEL_OF_THE_PERIODIC_DATA_7 = 0x2a;
const LENGTH_OF_THE_PERIODIC_DATA_7 = 0x2b;
const LABEL_OF_THE_PERIODIC_DATA_8 = 0x2c;
const LENGTH_OF_THE_PERIODIC_DATA_8 = 0x2d;
const LABEL_OF_THE_PERIODIC_DATA_9 = 0x2e;
const LENGTH_OF_THE_PERIODIC_DATA_9 = 0x2f;
const LABEL_OF_THE_PERIODIC_DATA_10 = 0x30;
const LENGTH_OF_THE_PERIODIC_DATA_10 = 0x31;
const LABEL_OF_THE_PERIODIC_DATA_11 = 0x32;
const LENGTH_OF_THE_PERIODIC_DATA_11 = 0x33;
const LABEL_OF_THE_PERIODIC_DATA_12 = 0x34;
const LENGTH_OF_THE_PERIODIC_DATA_12 = 0x35;
const LABEL_OF_THE_ALARM_1 = 0x3c;
const TYPE_ALARM_1 = 0x3d;
const THRESHOLD_VALUE_HIGH_ALARM_1 = 0x3e;
const HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_1 = 0x3f;
const THRESHOLD_VALUE_LOW_ALARM_1 = 0x40;
const LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_1 = 0x41;
const LABEL_OF_THE_ALARM_2 = 0x42;
const TYPE_ALARM_2 = 0x43;
const THRESHOLD_VALUE_HIGH_ALARM_2 = 0x44;
const HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_2 = 0x45;
const THRESHOLD_VALUE_LOW_ALARM_2 = 0x46;
const LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_2 = 0x47;
const LABEL_OF_THE_ALARM_3 = 0x48;
const TYPE_ALARM_3 = 0x49;
const THRESHOLD_VALUE_HIGH_ALARM_3 = 0x4a;
const HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_3 = 0x4b;
const THRESHOLD_VALUE_LOW_ALARM_3 = 0x4c;
const LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_3 = 0x4d;
const LABEL_OF_THE_ALARM_4 = 0x4e;
const TYPE_ALARM_4 = 0x4f;
const THRESHOLD_VALUE_HIGH_ALARM_4 = 0x50;
const HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_4 = 0x51;
const THRESHOLD_VALUE_LOW_ALARM_4 = 0x52;
const LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_4 = 0x53;
const LABEL_OF_THE_ALARM_5 = 0x54;
const TYPE_ALARM_5 = 0x55;
const THRESHOLD_VALUE_HIGH_ALARM_5 = 0x56;
const HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_5 = 0x57;
const THRESHOLD_VALUE_LOW_ALARM_5 = 0x58;
const LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_5 = 0x59;
const LABEL_OF_THE_ALARM_6 = 0x5a;
const TYPE_ALARM_6 = 0x5b;
const THRESHOLD_VALUE_HIGH_ALARM_6 = 0x5c;
const HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_6 = 0x5d;
const THRESHOLD_VALUE_LOW_ALARM_6 = 0x5e;
const LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_6 = 0x5f;

/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/

const uplinkEmptyError = "invalid uplink payload: no data received";
const downlinkEmptyError = "invalid downlink payload: no data received";
const downlinkFrameTypeError = "invalid downlink payload: unknown frame type";
const uplinkLengthError = "invalid uplink payload: wrong length";
const uplinkFrameTypeError = "invalid uplink payload: unknown frame type";
const downlinkRegisterIdError = "invalid downlink payload: unknown register id";
const downlinkLengthError = "invalid downlink payload: wrong length";

const uplinkProductConfigType = "PRODUCT_CONFIGURATION_DATA_FRAMES";
const uplinkNetworkConfigType = "FRAMES_OF_INFORMATION_ON_THE_NETWORK_CONFIGURATION";
const uplinkKeepAliveType = "KEEP_ALIVE_FRAME";
const uplinkReplyFrameToRegisterValueRequestStr = "REPLY_FRAME_TO_REGISTER_VALUE_REQUEST";
const uplinkRegisterStatusType = "SET_REGISTER_STATUS";
const uplinkPeriodicDataType = "PERIODIC_DATA_FRAME";
const uplinkAlarmType = "ALARM_FRAME";

const transmissionPeriodOfTheKeepAliveFrameStr = "TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME";
const periodicOfIssueStr = "PERIODIC_OF_ISSUE";
const activationOfTheAcknowledgeModeStr = "ACTIVATION_OF_THE_ACKNOWLEDGE_MODE";
const pinCodeStr = "PIN_CODE";
const globalOperationStr = "GLOBAL_OPERATION";
const acquisitionPeriodStr = "ACQUISITION_PERIOD";
const labelOfThePeriodicData1Str = "LABEL_OF_THE_PERIODIC_DATA_1";
const lengthOfThePeriodicData1Str = "LENGTH_OF_THE_PERIODIC_DATA_1";
const labelOfThePeriodicData2Str = "LABEL_OF_THE_PERIODIC_DATA_2";
const lengthOfThePeriodicData2Str = "LENGTH_OF_THE_PERIODIC_DATA_2";
const labelOfThePeriodicData3Str = "LABEL_OF_THE_PERIODIC_DATA_3";
const lengthOfThePeriodicData3Str = "LENGTH_OF_THE_PERIODIC_DATA_3";
const labelOfThePeriodicData4Str = "LABEL_OF_THE_PERIODIC_DATA_4";
const lengthOfThePeriodicData4Str = "LENGTH_OF_THE_PERIODIC_DATA_4";
const labelOfThePeriodicData5Str = "LABEL_OF_THE_PERIODIC_DATA_5";
const lengthOfThePeriodicData5Str = "LENGTH_OF_THE_PERIODIC_DATA_5";
const labelOfThePeriodicData6Str = "LABEL_OF_THE_PERIODIC_DATA_6";
const lengthOfThePeriodicData6Str = "LENGTH_OF_THE_PERIODIC_DATA_6";
const labelOfThePeriodicData7Str = "LABEL_OF_THE_PERIODIC_DATA_7";
const lengthOfThePeriodicData7Str = "LENGTH_OF_THE_PERIODIC_DATA_7";
const labelOfThePeriodicData8Str = "LABEL_OF_THE_PERIODIC_DATA_8";
const lengthOfThePeriodicData8Str = "LENGTH_OF_THE_PERIODIC_DATA_8";
const labelOfThePeriodicData9Str = "LABEL_OF_THE_PERIODIC_DATA_9";
const lengthOfThePeriodicData9Str = "LENGTH_OF_THE_PERIODIC_DATA_9";
const labelOfThePeriodicData10Str = "LABEL_OF_THE_PERIODIC_DATA_10";
const lengthOfThePeriodicData10Str = "LENGTH_OF_THE_PERIODIC_DATA_10";
const labelOfThePeriodicData11Str = "LABEL_OF_THE_PERIODIC_DATA_11";
const lengthOfThePeriodicData11Str = "LENGTH_OF_THE_PERIODIC_DATA_11";
const labelOfThePeriodicData12Str = "LABEL_OF_THE_PERIODIC_DATA_12";
const lengthOfThePeriodicData12Str = "LENGTH_OF_THE_PERIODIC_DATA_12";
const labelOfTheAlarm1Str = "LABEL_OF_THE_ALARM1";
const typeAlarm1Str = "TYPE_ALARM_1";
const thresholdValueHighAlarm1Str = "THRESHOLD_VALUE_HIGH_ALARM_1";
const highThresholdHysteresisValueAlarm1Str = "HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_1";
const thresholdValueLowAlarm1Str = "THRESHOLD_VALUE_LOW_ALARM_1";
const lowThresholdHysteresisValueAlarm1Str = "LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_1";
const labelOfTheAlarm2Str = "LABEL_OF_THE_ALARM2";
const typeAlarm2Str = "TYPE_ALARM_2";
const thresholdValueHighAlarm2Str = "THRESHOLD_VALUE_HIGH_ALARM_2";
const highThresholdHysteresisValueAlarm2Str = "HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_2";
const thresholdValueLowAlarm2Str = "THRESHOLD_VALUE_LOW_ALARM_2";
const lowThresholdHysteresisValueAlarm2Str = "LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_2";
const labelOfTheAlarm3Str = "LABEL_OF_THE_ALARM3";
const typeAlarm3Str = "TYPE_ALARM_3";
const thresholdValueHighAlarm3Str = "THRESHOLD_VALUE_HIGH_ALARM_3";
const highThresholdHysteresisValueAlarm3Str = "HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_3";
const thresholdValueLowAlarm3Str = "THRESHOLD_VALUE_LOW_ALARM_3";
const lowThresholdHysteresisValueAlarm3Str = "LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_3";
const labelOfTheAlarm4Str = "LABEL_OF_THE_ALARM4";
const typeAlarm4Str = "TYPE_ALARM_4";
const thresholdValueHighAlarm4Str = "THRESHOLD_VALUE_HIGH_ALARM_4";
const highThresholdHysteresisValueAlarm4Str = "HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_4";
const thresholdValueLowAlarm4Str = "THRESHOLD_VALUE_LOW_ALARM_4";
const lowThresholdHysteresisValueAlarm4Str = "LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_4";
const labelOfTheAlarm5Str = "LABEL_OF_THE_ALARM5";
const typeAlarm5Str = "TYPE_ALARM_5";
const thresholdValueHighAlarm5Str = "THRESHOLD_VALUE_HIGH_ALARM_5";
const highThresholdHysteresisValueAlarm5Str = "HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_5";
const thresholdValueLowAlarm5Str = "THRESHOLD_VALUE_LOW_ALARM_5";
const lowThresholdHysteresisValueAlarm5Str = "LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_5";
const labelOfTheAlarm6Str = "LABEL_OF_THE_ALARM6";
const typeAlarm6Str = "TYPE_ALARM_6";
const thresholdValueHighAlarm6Str = "THRESHOLD_VALUE_HIGH_ALARM_6";
const highThresholdHysteresisValueAlarm6Str = "HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_6";
const thresholdValueLowAlarm6Str = "THRESHOLD_VALUE_LOW_ALARM_6";
const lowThresholdHysteresisValueAlarm6Str = "LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_6";

//  mapping the downlink message in a map with key = id and value = label
let downlinkMessageMap = new Map();
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME, transmissionPeriodOfTheKeepAliveFrameStr);
downlinkMessageMap.set(PERIODIC_OF_ISSUE, periodicOfIssueStr);
downlinkMessageMap.set(ACTIVATION_OF_THE_ACKNOWLEDGE_MODE, activationOfTheAcknowledgeModeStr);
downlinkMessageMap.set(PIN_CODE, pinCodeStr);
downlinkMessageMap.set(GLOBAL_OPERATION, globalOperationStr);
downlinkMessageMap.set(ACQUISITION_PERIOD, acquisitionPeriodStr);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_1, labelOfThePeriodicData1Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_1, lengthOfThePeriodicData1Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_2, labelOfThePeriodicData2Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_2, lengthOfThePeriodicData2Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_3, labelOfThePeriodicData3Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_3, lengthOfThePeriodicData3Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_4, labelOfThePeriodicData4Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_4, lengthOfThePeriodicData4Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_5, labelOfThePeriodicData5Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_5, lengthOfThePeriodicData5Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_6, labelOfThePeriodicData6Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_6, lengthOfThePeriodicData6Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_7, labelOfThePeriodicData7Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_7, lengthOfThePeriodicData7Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_8, labelOfThePeriodicData8Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_8, lengthOfThePeriodicData8Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_9, labelOfThePeriodicData9Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_9, lengthOfThePeriodicData9Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_10, labelOfThePeriodicData10Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_10, lengthOfThePeriodicData10Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_11, labelOfThePeriodicData11Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_11, lengthOfThePeriodicData11Str);
downlinkMessageMap.set(LABEL_OF_THE_PERIODIC_DATA_12, labelOfThePeriodicData12Str);
downlinkMessageMap.set(LENGTH_OF_THE_PERIODIC_DATA_12, lengthOfThePeriodicData12Str);
downlinkMessageMap.set(LABEL_OF_THE_ALARM_1, labelOfTheAlarm1Str);
downlinkMessageMap.set(TYPE_ALARM_1, typeAlarm1Str);
downlinkMessageMap.set(THRESHOLD_VALUE_HIGH_ALARM_1, thresholdValueHighAlarm1Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_1, highThresholdHysteresisValueAlarm1Str);
downlinkMessageMap.set(THRESHOLD_VALUE_LOW_ALARM_1, thresholdValueLowAlarm1Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_1, lowThresholdHysteresisValueAlarm1Str);
downlinkMessageMap.set(LABEL_OF_THE_ALARM_2, labelOfTheAlarm2Str);
downlinkMessageMap.set(TYPE_ALARM_2, typeAlarm2Str);
downlinkMessageMap.set(THRESHOLD_VALUE_HIGH_ALARM_2, thresholdValueHighAlarm2Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_2, highThresholdHysteresisValueAlarm2Str);
downlinkMessageMap.set(THRESHOLD_VALUE_LOW_ALARM_2, thresholdValueLowAlarm2Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_2, lowThresholdHysteresisValueAlarm2Str);
downlinkMessageMap.set(LABEL_OF_THE_ALARM_3, labelOfTheAlarm3Str);
downlinkMessageMap.set(TYPE_ALARM_3, typeAlarm3Str);
downlinkMessageMap.set(THRESHOLD_VALUE_HIGH_ALARM_3, thresholdValueHighAlarm3Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_3, highThresholdHysteresisValueAlarm3Str);
downlinkMessageMap.set(THRESHOLD_VALUE_LOW_ALARM_3, thresholdValueLowAlarm3Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_3, lowThresholdHysteresisValueAlarm3Str);
downlinkMessageMap.set(LABEL_OF_THE_ALARM_4, labelOfTheAlarm4Str);
downlinkMessageMap.set(TYPE_ALARM_4, typeAlarm4Str);
downlinkMessageMap.set(THRESHOLD_VALUE_HIGH_ALARM_4, thresholdValueHighAlarm4Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_4, highThresholdHysteresisValueAlarm4Str);
downlinkMessageMap.set(THRESHOLD_VALUE_LOW_ALARM_4, thresholdValueLowAlarm4Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_4, lowThresholdHysteresisValueAlarm4Str);
downlinkMessageMap.set(LABEL_OF_THE_ALARM_5, labelOfTheAlarm5Str);
downlinkMessageMap.set(TYPE_ALARM_5, typeAlarm5Str);
downlinkMessageMap.set(THRESHOLD_VALUE_HIGH_ALARM_5, thresholdValueHighAlarm5Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_5, highThresholdHysteresisValueAlarm5Str);
downlinkMessageMap.set(THRESHOLD_VALUE_LOW_ALARM_5, thresholdValueLowAlarm5Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_5, lowThresholdHysteresisValueAlarm5Str);
downlinkMessageMap.set(LABEL_OF_THE_ALARM_6, labelOfTheAlarm6Str);
downlinkMessageMap.set(TYPE_ALARM_6, typeAlarm6Str);
downlinkMessageMap.set(THRESHOLD_VALUE_HIGH_ALARM_6, thresholdValueHighAlarm6Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_6, highThresholdHysteresisValueAlarm6Str);
downlinkMessageMap.set(THRESHOLD_VALUE_LOW_ALARM_6, thresholdValueLowAlarm6Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_6, lowThresholdHysteresisValueAlarm6Str);

const parkModeStr = "PARK_MODE";
const productionModeStr = "PRODUCTION_MODE";
const testModeStr = "TEST_MODE";
const repliModeStr = "REPLI_MODE";

const abpStr = "ABP";
const otaaStr = "OTAA";

const successStr = "SUCCESS";
const errorNoUpdateStr = "ERROR_NO_UPDATE";
const errorCoherenceStr = "ERROR_COHERENCE";
const errorInvalidRegisterStr = "ERROR_INVALID_REGISTER";
const errorInvalidValueStr = "ERROR_INVALID_VALUE";
const errorTruncatedValueStr = "ERROR_TRUNCATED_VALUE";
const errorUnauthorizedAccessStr = "ERROR_UNAUTHORIZED_ACCESS";
const errorDeviceDefectStr = "ERROR_DEVICE_DEFECT";
const errorUnknownStr = "ERROR_UNKNOWN";

const followingRequestStr = "FOLLOWING_A_REQUEST_TO_READ_DATA";
const activationOfAlarmStr = "ACTIVATION_OF_THE_ALARM";
const deactivationOfAlarmStr = "DEACTIVATION_OF_THE_ALARM";
const followingHighThresholdStr = "FOLLOWING_HIGH_THRESHOLD_DETECTION";
const followingLowThresholdStr = "FOLLOWING_LOW_THRESHOLD_DETECTION";
const thresholdDetectionEndedStr = "THRESHOLD_DETECTION_ENDED";
const detectPositiveDeltaStr = "DETECTION_OF_POSITIVE_DELTA_BETWEEN_LABEL_AND_PREVIOUS_ACQUISITION";
const detectNegativeDeltaStr = "DETECTION_OF_NEGATIVE_DELTA_BETWEEN_LABEL_AND_PREVIOUS_ACQUISITION";

const alarmOfAppearanceDisappearanceStr = "ALARM_OF_APPEARANCE_DISAPPEARANCE";
const lowThresholdAlarmOnlyStr = "LOW_THRESHOLD_ALARM_ONLY";
const highThresholdAlarmOnlyStr = "HIGH_THRESHOLD_ALARM_ONLY";
const alarmOnLowAndHighThresholdsStr = "ALARM_ON_LOW_AND_HIGH_THRESHOLDS";
const alarmIfTheValueChangeNegativelyStr = "ALARM_IF_THE_VALUE_CHANGE_NEGATIVELY";
const alarmIfTheValueChangePositivelyStr = "ALARM_IF_THE_VALUE_CHANGE_POSITIVELY";
const alarmIfTheValueChangePositivelyAndNegativelyStr = "ALARM_IF_THE_VALUE_CHANGE_POSITIVELY_AND_NEGATIVELY";

const labelNotRecognized = "LABEL_NOT_RECOGNIZED";
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

//  convert a string hex to ascii by defining also the starting and ending positions
function hexToAscii(payloadHex, beginPos, endPos) {
    var hex = payloadHex.toString();
    hex = hex.substring(beginPos, endPos);
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
        if (parseInt(hex.substr(n, 2), 16) != 0) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
    }
    return str;
}

//  if the input is an array of bytes, this method convert it to string hex
function bytesToHex(bytes) {
    return Array.from(bytes, (byte) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
    }).join("");
}

//  if the input is a string hex an array of bytes, this method convert it to an array of bytes
function hexToBytes(hex) {
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

//  convert a decimal to bytes array
function decToBytes(number) {
    if (number < 0) {
        number = 0xffff + number + 1;
    }
    let result = number.toString(16);
    if (result.length % 2 != 0) {
        result = "0".concat(result);
    }
    return hexToBytes(result);
}

function asciiToBytes(str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    const result = arr1.join("");
    return hexToBytes(result);
}

//  convert a boolean to a byte
function booleanToByte(bool) {
    return bool ? 0x01 : 0x00;
}

//  mapping the operating mode for decoding
function getGlobalOperation(value) {
    switch (value) {
        case 0x00:
            return parkModeStr;
        case 0x01:
            return productionModeStr;
        case 0x02:
            return testModeStr;
        case 0x03:
            return repliModeStr;
    }
}

//  mapping the connection mode for decoding
function getConnectionMode(value) {
    switch (value) {
        case 0:
            return abpStr;
        case 1:
            return otaaStr;
    }
}

//  mapping the request status for 0x33
function getUpdateRequestStatus(hex) {
    switch (hex) {
        case 0x01:
            return successStr;
        case 0x02:
            return errorNoUpdateStr;
        case 0x03:
            return errorCoherenceStr;
        case 0x04:
            return errorInvalidRegisterStr;
        case 0x05:
            return errorInvalidValueStr;
        case 0x06:
            return errorTruncatedValueStr;
        case 0x07:
            return errorUnauthorizedAccessStr;
        case 0x08:
            return errorDeviceDefectStr;
        default:
            return errorUnknownStr;
    }
}

//  mapping the cause of sending the frame for decoding
function getCauseOfSending(value) {
    switch (value) {
        case 0x00:
            return followingRequestStr;
        case 0x01:
            return activationOfAlarmStr;
        case 0x02:
            return deactivationOfAlarmStr;
        case 0x03:
            return followingHighThresholdStr;
        case 0x04:
            return followingLowThresholdStr;
        case 0x05:
            return thresholdDetectionEndedStr;
        case 0x06:
            return detectPositiveDeltaStr;
        case 0x07:
            return detectNegativeDeltaStr;
    }
}

//  mapping the alarm type for decoding downlink
function getAlarmType(value) {
    switch (value) {
        case 0x00:
            return alarmOfAppearanceDisappearanceStr;
        case 0x01:
            return lowThresholdAlarmOnlyStr;
        case 0x02:
            return highThresholdAlarmOnlyStr;
        case 0x03:
            return alarmOnLowAndHighThresholdsStr;
        case 0x04:
            return alarmIfTheValueChangeNegativelyStr;
        case 0x05:
            return alarmIfTheValueChangePositivelyStr;
        case 0x06:
            return alarmIfTheValueChangePositivelyAndNegativelyStr;
    }
}

//  mapping the operating mode for encoding
function encodeGlobalOperation(value) {
    switch (value) {
        case parkModeStr:
            return 0x00;
        case productionModeStr:
            return 0x01;
        case testModeStr:
            return 0x02;
        case repliModeStr:
            return 0x03;
    }
}

//  mapping the alarm type for encoding downlink
function encodeAlarmType(value) {
    switch (value) {
        case alarmOfAppearanceDisappearanceStr:
            return 0x00;
        case lowThresholdAlarmOnlyStr:
            return 0x01;
        case highThresholdAlarmOnlyStr:
            return 0x02;
        case alarmOnLowAndHighThresholdsStr:
            return 0x03;
        case alarmIfTheValueChangeNegativelyStr:
            return 0x04;
        case alarmIfTheValueChangePositivelyStr:
            return 0x05;
        case alarmIfTheValueChangePositivelyAndNegativelyStr:
            return 0x06;
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
    if (input.bytes) {
        if (typeof input.bytes !== "string") {
            payloadHex = bytesToHex(input.bytes);
        } else {
            payloadHex = input.bytes;
        }
    } else {
        throw new Error(uplinkEmptyError);
    }

    const nbBytes = payloadHex.length / 2;
    if (nbBytes < 2) {
        throw new Error(uplinkLengthError);
    }

    const code = hexToDec(payloadHex, 0, 2);

    const status = hexToDec(payloadHex, 2, 4);

    result.frameCounter = status >> 5;
    result.configurationDone = (status & 0x01) == 1;
    result.hardwareError = ((status >> 2) & 0x01) == 1;
    result.configurationError = ((status >> 3) & 0x01) == 1;
    result.ticReadingError = ((status >> 4) & 0x01) == 1;

    switch (code) {
        case PRODUCT_CONFIGURATION:
            if (nbBytes != 8) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfigType;
            result.register = {};

            result.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, 10, 12));
            if (result.register.globalOperation == productionModeStr) {
                result.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, 4, 6) * 600;
            } else if (result.register.globalOperation == testModeStr) {
                result.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, 4, 6) * 20;
            } else {
                result.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, 4, 6);
            }
            result.register.acquisitionPeriod = hexToDec(payloadHex, 12, 14);
            if (result.register.acquisitionPeriod == 0) {
                result.register.periodOfIssue = hexToDec(payloadHex, 6, 10) * 60;
            } else {
                result.register.periodOfIssue = hexToDec(payloadHex, 6, 10) * 60 * result.register.acquisitionPeriod;
            }
            break;

        case NETWORK_CONFIGURATION:
            if (nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkNetworkConfigType;
            result.register = {};

            result.register.adaptiveDataRate = hexToDec(payloadHex, 4, 6) == 1;
            result.register.connectionMode = getConnectionMode(hexToDec(payloadHex, 6, 8));
            break;

        case KEEP_ALIVE:
            if (nbBytes != 2) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkKeepAliveType;
            break;

        case REPLY_FRAME_TO_REGISTER_VALUE_REQUEST:
            result.type = uplinkReplyFrameToRegisterValueRequestStr;
            break;

        case RESPONSE_FRAME_OF_UPDATE_REGISTER:
            if (nbBytes != 5 && nbBytes != 3) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkRegisterStatusType;
            result.register = {};

            result.register.requestStatus = getUpdateRequestStatus(hexToDec(payloadHex, 4, 6));
            if (result.register.requestStatus != successStr) {
                result.register.registerId = hexToDec(payloadHex, 6, 10);
            }
            break;

        case PERIODIC_DATA_FRAME:
            result.type = uplinkPeriodicDataType;
            result.register = {};

            if (hexToDec(payloadHex, 4, 28) != 0) {
                result.register.ADCO = hexToAscii(payloadHex, 4, 28);
            } else {
                result.register.ADCO = labelNotRecognized;
            }
            if (hexToDec(payloadHex, 28, 36) != 2147483648) {
                result.register.BASE = hexToDec(payloadHex, 28, 36);
            } else {
                result.register.BASE = 0;
            }
            if (hexToDec(payloadHex, 36, 44) != 2147483648) {
                result.register.HCHC = hexToDec(payloadHex, 36, 44);
            } else {
                result.register.HCHC = 0;
            }
            if (hexToDec(payloadHex, 44, 52) != 2147483648) {
                result.register.HCHP = hexToDec(payloadHex, 44, 52);
            } else {
                result.register.HCHP = 0;
            }
            if (hexToDec(payloadHex, 52, 60) != 0) {
                result.register.OPTARIF = hexToAscii(payloadHex, 52, 60);
            } else {
                result.register.OPTARIF = labelNotRecognized;
            }
            if (hexToDec(payloadHex, 60, 68) != 0) {
                result.register.DEMAIN = hexToAscii(payloadHex, 60, 68);
            } else {
                result.register.DEMAIN = labelNotRecognized;
            }
            if (hexToDec(payloadHex, 68, 76) != 2147483648) {
                result.register.IINST = hexToDec(payloadHex, 68, 76);
            } else {
                result.register.IINST = 0;
            }
            if (hexToDec(payloadHex, 76, 84) != 2147483648) {
                result.register.IMAX = hexToDec(payloadHex, 76, 84);
            } else {
                result.register.IMAX = 0;
            }
            if (hexToDec(payloadHex, 84, 92) != 2147483648) {
                result.register.BBRHCJB = hexToDec(payloadHex, 84, 92);
            } else {
                result.register.BBRHCJB = 0;
            }
            if (hexToDec(payloadHex, 92, 100) != 2147483648) {
                result.register.BBRHCJB = hexToDec(payloadHex, 92, 100);
            } else {
                result.register.BBRHCJB = 0;
            }
            if (nbBytes > 50) {
                if (hexToDec(payloadHex, 100, 108) != 0) {
                    result.register.PTEC = hexToAscii(payloadHex, 100, 108);
                } else {
                    result.register.PTEC = labelNotRecognized;
                }
            }
            break;

        case ALARM_FRAME:
            result.type = uplinkAlarmType;
            result.register = {};

            result.register.label = hexToAscii(payloadHex, 4, 24);
            result.register.causeOfSending = getCauseOfSending(hexToDec(payloadHex, 24, 26));
            result.register.valueOfLabel = hexToAscii(payloadHex, 26, payloadHex.length);
            break;

        default:
            throw new Error(uplinkFrameTypeError);
    }

    return result;
}

//  this function used by the driver to decode the downlink and return an object decoded
function decodeDownlink(input) {
    var result = {};
    var payloadHex;

    if (input.bytes == null) {
        throw new Error(downlinkEmptyError);
    }

    if (input.bytes) {
        if (typeof input.bytes !== "string") {
            payloadHex = bytesToHex(input.bytes);
        } else {
            payloadHex = input.bytes;
        }
    }

    const nbBytes = payloadHex.length / 2;

    const type = hexToDec(payloadHex, 0, 2);

    switch (type) {
        case PRODUCT_CONFIGURATION_REQUEST_FRAME:
            if (nbBytes != 8) {
                throw new Error(downlinkLengthError);
            }
            result.type = "PRODUCT_CONFIGURATION_REQUEST_FRAME";
            break;

        case NETWORK_CONFIGURATION_REQUEST_FRAME:
            if (nbBytes != 8) {
                throw new Error(downlinkLengthError);
            }
            result.type = "NETWORK_CONFIGURATION_REQUEST_FRAME";
            break;

        case REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA:
            if (nbBytes != 12) {
                throw new Error(downlinkLengthError);
            }
            result.type = "REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA";
            result.payload = {};
            result.payload.type = "TicRequestFrameForReadingAPieceOfData";
            result.payload.maximumNumberOfAcquisitions = hexToDec(payloadHex, 2, 4);
            result.payload.labelOfTheDataToRead = hexToAscii(payloadHex, 4, 24);
            break;

        case SPECIFIC_REGISTER_VALUE_REQUEST_FRAME:
            result.type = "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME";
            result.payload = {};
            result.payload.type = "TicSpecificRegisterValueRequestFrame";
            result.payload.message = [];
            for (let i = 2; i < payloadHex.length; i += 2) {
                result.payload.message.push(downlinkMessageMap.get(hexToDec(payloadHex, i, i + 2)));
            }
            break;

        case FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS:
            result.type = "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS";
            result.payload = {};
            result.payload.type = "TicFrameForUpdatingTheValueOfSpecificRegisters";
            result.payload.register = {};
            let pos = 2;
            while (pos < payloadHex.length) {
                const confId = hexToDec(payloadHex, pos, pos + 2);
                pos += 2;
                switch (confId) {
                    case TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME:
                        result.payload.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case PERIODIC_OF_ISSUE:
                        result.payload.register.periodOfIssue = hexToDec(payloadHex, pos, pos + 4) * 60;
                        pos += 4;
                        break;

                    case ACTIVATION_OF_THE_ACKNOWLEDGE_MODE:
                        result.payload.register.activationOfTheAcknowledgeMode = hexToDec(payloadHex, pos, pos + 2) == 1;
                        pos += 2;
                        break;

                    case PIN_CODE:
                        result.payload.register.pinCode = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case GLOBAL_OPERATION:
                        result.payload.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case ACQUISITION_PERIOD:
                        result.payload.register.acquisitionPeriod = hexToDec(payloadHex, pos, pos + 4) * 20;
                        pos += 4;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_1:
                        result.payload.register.labelOfThePeriodicData1 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_1:
                        result.payload.register.lengthOfThePeriodicData1 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_2:
                        result.payload.register.labelOfThePeriodicData2 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_2:
                        result.payload.register.lengthOfThePeriodicData2 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_3:
                        result.payload.register.labelOfThePeriodicData3 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_3:
                        result.payload.register.lengthOfThePeriodicData3 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_4:
                        result.payload.register.labelOfThePeriodicData4 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_4:
                        result.payload.register.lengthOfThePeriodicData4 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_5:
                        result.payload.register.labelOfThePeriodicData5 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_5:
                        result.payload.register.lengthOfThePeriodicData5 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_6:
                        result.payload.register.labelOfThePeriodicData6 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_6:
                        result.payload.register.lengthOfThePeriodicData6 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_7:
                        result.payload.register.labelOfThePeriodicData7 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_7:
                        result.payload.register.lengthOfThePeriodicData7 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_8:
                        result.payload.register.labelOfThePeriodicData8 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_8:
                        result.payload.register.lengthOfThePeriodicData8 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_9:
                        result.payload.register.labelOfThePeriodicData9 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_9:
                        result.payload.register.lengthOfThePeriodicData9 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_10:
                        result.payload.register.labelOfThePeriodicData10 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_10:
                        result.payload.register.lengthOfThePeriodicData10 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_11:
                        result.payload.register.labelOfThePeriodicData11 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_11:
                        result.payload.register.lengthOfThePeriodicData11 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_PERIODIC_DATA_12:
                        result.payload.register.labelOfThePeriodicData12 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case LENGTH_OF_THE_PERIODIC_DATA_12:
                        result.payload.register.lengthOfThePeriodicData12 = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case LABEL_OF_THE_ALARM_1:
                        result.payload.register.labelOfTheAlarm1 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case TYPE_ALARM_1:
                        result.payload.register.typeAlarm1 = getAlarmType(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case THRESHOLD_VALUE_HIGH_ALARM_1:
                        result.payload.register.thresholdValueHighAlarm1 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_1:
                        result.payload.register.highThresholdHysteresisValueAlarm1 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case THRESHOLD_VALUE_LOW_ALARM_1:
                        result.payload.register.thresholdValueLowAlarm1 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_1:
                        result.payload.register.lowThresholdHysteresisValueAlarm1 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LABEL_OF_THE_ALARM_2:
                        result.payload.register.labelOfTheAlarm2 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case TYPE_ALARM_2:
                        result.payload.register.typeAlarm2 = getAlarmType(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case THRESHOLD_VALUE_HIGH_ALARM_2:
                        result.payload.register.thresholdValueHighAlarm2 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_2:
                        result.payload.register.highThresholdHysteresisValueAlarm2 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case THRESHOLD_VALUE_LOW_ALARM_2:
                        result.payload.register.thresholdValueLowAlarm2 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_2:
                        result.payload.register.lowThresholdHysteresisValueAlarm2 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LABEL_OF_THE_ALARM_3:
                        result.payload.register.labelOfTheAlarm3 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case TYPE_ALARM_3:
                        result.payload.register.typeAlarm3 = getAlarmType(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case THRESHOLD_VALUE_HIGH_ALARM_3:
                        result.payload.register.thresholdValueHighAlarm3 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_3:
                        result.payload.register.highThresholdHysteresisValueAlarm3 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case THRESHOLD_VALUE_LOW_ALARM_3:
                        result.payload.register.thresholdValueLowAlarm3 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_3:
                        result.payload.register.lowThresholdHysteresisValueAlarm3 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LABEL_OF_THE_ALARM_4:
                        result.payload.register.labelOfTheAlarm4 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case TYPE_ALARM_4:
                        result.payload.register.typeAlarm4 = getAlarmType(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case THRESHOLD_VALUE_HIGH_ALARM_4:
                        result.payload.register.thresholdValueHighAlarm4 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_4:
                        result.payload.register.highThresholdHysteresisValueAlarm4 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case THRESHOLD_VALUE_LOW_ALARM_4:
                        result.payload.register.thresholdValueLowAlarm4 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_4:
                        result.payload.register.lowThresholdHysteresisValueAlarm4 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LABEL_OF_THE_ALARM_5:
                        result.payload.register.labelOfTheAlarm5 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case TYPE_ALARM_5:
                        result.payload.register.typeAlarm5 = getAlarmType(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case THRESHOLD_VALUE_HIGH_ALARM_5:
                        result.payload.register.thresholdValueHighAlarm5 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_5:
                        result.payload.register.highThresholdHysteresisValueAlarm5 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case THRESHOLD_VALUE_LOW_ALARM_5:
                        result.payload.register.thresholdValueLowAlarm5 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_5:
                        result.payload.register.lowThresholdHysteresisValueAlarm5 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LABEL_OF_THE_ALARM_6:
                        result.payload.register.labelOfTheAlarm6 = hexToAscii(payloadHex, pos, pos + 20);
                        pos += 20;
                        break;

                    case TYPE_ALARM_6:
                        result.payload.register.typeAlarm6 = getAlarmType(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case THRESHOLD_VALUE_HIGH_ALARM_6:
                        result.payload.register.thresholdValueHighAlarm6 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_6:
                        result.payload.register.highThresholdHysteresisValueAlarm6 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case THRESHOLD_VALUE_LOW_ALARM_6:
                        result.payload.register.thresholdValueLowAlarm6 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_6:
                        result.payload.register.lowThresholdHysteresisValueAlarm6 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    default:
                        throw new Error(downlinkRegisterIdError);
                }
            }
            break;

        default:
            throw new Error(downlinkFrameTypeError);
    }

    return result;
}

//  this function used by the driver to encode the downlink and return an object contains:
//  * bytes: array of numbers as it will be sent to the device.

function encodeDownlink(input) {
    var result = {};
    var bytes = [];

    switch (input.type) {
        case "PRODUCT_CONFIGURATION_REQUEST_FRAME":
            if (input.register == null) {
                bytes = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                bytes.unshift(PRODUCT_CONFIGURATION_REQUEST_FRAME);
            }
            break;

        case "NETWORK_CONFIGURATION_REQUEST_FRAME":
            if (input.register == null) {
                bytes = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
                bytes.unshift(NETWORK_CONFIGURATION_REQUEST_FRAME);
            }
            break;

        case "REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA":
            bytes.push(REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA);
            const payloadReading = input.payload;

            if (payloadReading.maximumNumberOfAcquisitions != null) {
                bytes.push(decToBytes(payloadReading.maximumNumberOfAcquisitions));
            }
            if (payloadReading.labelOfTheDataToRead != null) {
                const toPush = asciiToBytes(payloadReading.labelOfTheDataToRead);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }
            break;

        case "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME":
            bytes.push(SPECIFIC_REGISTER_VALUE_REQUEST_FRAME);
            let payloadArray = [];
            if (input.payload != null) {
                if (input.payload.message != null){
                    payloadArray = input.payload.message;

                    for (let i = 0; i < payloadArray.length; i++) {
                        for (let [key, value] of downlinkMessageMap) {
                            if (value == payloadArray[i]) {
                                bytes.push(key);
                            }
                        }
                    }
                }
            }
            break;

        case "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS":
            bytes.push(FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS);
            const payload = input.payload.register;

            if (payload.transmissionPeriodOfTheKeepAliveFrame != null) {
                bytes.push(TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME);
                bytes.push(decToBytes(payload.transmissionPeriodOfTheKeepAliveFrame));
            }

            if (payload.periodOfIssue != null) {
                bytes.push(PERIODIC_OF_ISSUE);
                const toPush = decToBytes(payload.periodOfIssue / 60);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.activationOfTheAcknowledgeMode != null) {
                bytes.push(ACTIVATION_OF_THE_ACKNOWLEDGE_MODE);
                const toPush = booleanToByte(payload.activationOfTheAcknowledgeMode);
                bytes.push(toPush);
            }

            if (payload.pinCode != null) {
                bytes.push(PIN_CODE);
                const toPush = decToBytes(payload.pinCode);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.globalOperation != null) {
                bytes.push(GLOBAL_OPERATION);
                const toPush = encodeGlobalOperation(payload.globalOperation);
                bytes.push(toPush);
            }

            if (payload.acquisitionPeriod != null) {
                bytes.push(ACQUISITION_PERIOD);
                const toPush = decToBytes(payload.acquisitionPeriod / 20);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData1 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_1);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData1);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData1 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_1);
                const toPush = decToBytes(payload.lengthOfThePeriodicData1);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData2 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_2);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData2);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData2 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_2);
                const toPush = decToBytes(payload.lengthOfThePeriodicData2);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData3 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_3);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData3);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData3 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_3);
                const toPush = decToBytes(payload.lengthOfThePeriodicData3);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData4 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_4);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData4);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData4 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_4);
                const toPush = decToBytes(payload.lengthOfThePeriodicData4);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData5 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_5);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData5);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData5 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_5);
                const toPush = decToBytes(payload.lengthOfThePeriodicData5);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData6 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_6);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData6);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData6 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_6);
                const toPush = decToBytes(payload.lengthOfThePeriodicData6);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData7 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_7);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData7);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData7 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_7);
                const toPush = decToBytes(payload.lengthOfThePeriodicData7);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData8 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_8);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData8);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData8 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_8);
                const toPush = decToBytes(payload.lengthOfThePeriodicData8);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData9 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_9);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData9);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData9 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_9);
                const toPush = decToBytes(payload.lengthOfThePeriodicData9);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData10 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_10);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData10);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData10 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_10);
                const toPush = decToBytes(payload.lengthOfThePeriodicData10);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData11 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_11);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData11);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData11 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_11);
                const toPush = decToBytes(payload.lengthOfThePeriodicData11);
                bytes.push(toPush);
            }

            if (payload.labelOfThePeriodicData12 != null) {
                bytes.push(LABEL_OF_THE_PERIODIC_DATA_12);
                const toPush = asciiToBytes(payload.labelOfThePeriodicData12);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lengthOfThePeriodicData12 != null) {
                bytes.push(LENGTH_OF_THE_PERIODIC_DATA_12);
                const toPush = decToBytes(payload.lengthOfThePeriodicData12);
                bytes.push(toPush);
            }

            if (payload.labelOfTheAlarm1 != null) {
                bytes.push(LABEL_OF_THE_ALARM_1);
                const toPush = asciiToBytes(payload.labelOfTheAlarm1);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.typeAlarm1 != null) {
                bytes.push(TYPE_ALARM_1);
                const toPush = encodeAlarmType(payload.typeAlarm1);
                bytes.push(toPush);
            }

            if (payload.thresholdValueHighAlarm1 != null) {
                bytes.push(THRESHOLD_VALUE_HIGH_ALARM_1);
                const toPush = decToBytes(payload.thresholdValueHighAlarm1);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisValueAlarm1 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_1);
                const toPush = decToBytes(payload.highThresholdHysteresisValueAlarm1);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.thresholdValueLowAlarm1 != null) {
                bytes.push(THRESHOLD_VALUE_LOW_ALARM_1);
                const toPush = decToBytes(payload.thresholdValueLowAlarm1);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisValueAlarm1 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_1);
                const toPush = decToBytes(payload.lowThresholdHysteresisValueAlarm1);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.labelOfTheAlarm2 != null) {
                bytes.push(LABEL_OF_THE_ALARM_2);
                const toPush = asciiToBytes(payload.labelOfTheAlarm2);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.typeAlarm2 != null) {
                bytes.push(TYPE_ALARM_2);
                const toPush = encodeAlarmType(payload.typeAlarm2);
                bytes.push(toPush);
            }

            if (payload.thresholdValueHighAlarm2 != null) {
                bytes.push(THRESHOLD_VALUE_HIGH_ALARM_2);
                const toPush = decToBytes(payload.thresholdValueHighAlarm2);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisValueAlarm2 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_2);
                const toPush = decToBytes(payload.highThresholdHysteresisValueAlarm2);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.thresholdValueLowAlarm2 != null) {
                bytes.push(THRESHOLD_VALUE_LOW_ALARM_2);
                const toPush = decToBytes(payload.thresholdValueLowAlarm2);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisValueAlarm2 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_2);
                const toPush = decToBytes(payload.lowThresholdHysteresisValueAlarm2);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.labelOfTheAlarm3 != null) {
                bytes.push(LABEL_OF_THE_ALARM_3);
                const toPush = asciiToBytes(payload.labelOfTheAlarm3);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.typeAlarm3 != null) {
                bytes.push(TYPE_ALARM_3);
                const toPush = encodeAlarmType(payload.typeAlarm3);
                bytes.push(toPush);
            }

            if (payload.thresholdValueHighAlarm3 != null) {
                bytes.push(THRESHOLD_VALUE_HIGH_ALARM_3);
                const toPush = decToBytes(payload.thresholdValueHighAlarm3);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisValueAlarm3 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_3);
                const toPush = decToBytes(payload.highThresholdHysteresisValueAlarm3);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.thresholdValueLowAlarm3 != null) {
                bytes.push(THRESHOLD_VALUE_LOW_ALARM_3);
                const toPush = decToBytes(payload.thresholdValueLowAlarm3);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisValueAlarm3 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_3);
                const toPush = decToBytes(payload.lowThresholdHysteresisValueAlarm3);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.labelOfTheAlarm4 != null) {
                bytes.push(LABEL_OF_THE_ALARM_4);
                const toPush = asciiToBytes(payload.labelOfTheAlarm4);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.typeAlarm4 != null) {
                bytes.push(TYPE_ALARM_4);
                const toPush = encodeAlarmType(payload.typeAlarm4);
                bytes.push(toPush);
            }

            if (payload.thresholdValueHighAlarm4 != null) {
                bytes.push(THRESHOLD_VALUE_HIGH_ALARM_4);
                const toPush = decToBytes(payload.thresholdValueHighAlarm4);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisValueAlarm4 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_4);
                const toPush = decToBytes(payload.highThresholdHysteresisValueAlarm4);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.thresholdValueLowAlarm4 != null) {
                bytes.push(THRESHOLD_VALUE_LOW_ALARM_4);
                const toPush = decToBytes(payload.thresholdValueLowAlarm4);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisValueAlarm4 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_4);
                const toPush = decToBytes(payload.lowThresholdHysteresisValueAlarm4);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.labelOfTheAlarm5 != null) {
                bytes.push(LABEL_OF_THE_ALARM_5);
                const toPush = asciiToBytes(payload.labelOfTheAlarm5);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.typeAlarm5 != null) {
                bytes.push(TYPE_ALARM_5);
                const toPush = encodeAlarmType(payload.typeAlarm5);
                bytes.push(toPush);
            }

            if (payload.thresholdValueHighAlarm5 != null) {
                bytes.push(THRESHOLD_VALUE_HIGH_ALARM_5);
                const toPush = decToBytes(payload.thresholdValueHighAlarm5);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisValueAlarm5 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_5);
                const toPush = decToBytes(payload.highThresholdHysteresisValueAlarm5);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.thresholdValueLowAlarm5 != null) {
                bytes.push(THRESHOLD_VALUE_LOW_ALARM_5);
                const toPush = decToBytes(payload.thresholdValueLowAlarm5);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisValueAlarm5 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_5);
                const toPush = decToBytes(payload.lowThresholdHysteresisValueAlarm5);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.labelOfTheAlarm6 != null) {
                bytes.push(LABEL_OF_THE_ALARM_6);
                const toPush = asciiToBytes(payload.labelOfTheAlarm6);
                while (toPush.length < 10) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.typeAlarm6 != null) {
                bytes.push(TYPE_ALARM_6);
                const toPush = encodeAlarmType(payload.typeAlarm6);
                bytes.push(toPush);
            }

            if (payload.thresholdValueHighAlarm6 != null) {
                bytes.push(THRESHOLD_VALUE_HIGH_ALARM_6);
                const toPush = decToBytes(payload.thresholdValueHighAlarm6);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisValueAlarm6 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_VALUE_ALARM_6);
                const toPush = decToBytes(payload.highThresholdHysteresisValueAlarm6);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.thresholdValueLowAlarm6 != null) {
                bytes.push(THRESHOLD_VALUE_LOW_ALARM_6);
                const toPush = decToBytes(payload.thresholdValueLowAlarm6);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisValueAlarm6 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_VALUE_ALARM_6);
                const toPush = decToBytes(payload.lowThresholdHysteresisValueAlarm6);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            break;

        default:
            throw new Error(downlinkRegisterIdError);
    }

    //  avoid having an array inside another

    bytes = [].concat.apply([], bytes);
    bytes = [].concat.apply([], bytes);

    result.bytes = bytes;
    result.fPort = 1;

    return result;
}

/*
............................................................................................................................
This part is needed to export the functions that we test and the variables used
............................................................................................................................
*/

exports.decodeUplink = decodeUplink;
exports.decodeDownlink = decodeDownlink;
exports.encodeDownlink = encodeDownlink;
