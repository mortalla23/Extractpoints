/*

***********************This driver is written according to the documentation of the MODBUS_V1_LORAWAN v1.0.2 attached in the specification********************************

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
const PERIODIC_DATA_FRAME = 0x44;
const ALARM_FRAME = 0x45;

//  these variables are needed to encode/decode the downlink
const PRODUCT_CONFIGURATION_REQUEST_FRAME = 0x01;
const NETWORK_CONFIGURATION_REQUEST_FRAME = 0x02;
const SPECIFIC_REGISTER_VALUE_REQUEST_FRAME = 0x40;
const FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS = 0x41;

const TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME = 0x00;
const TRANSMISSION_PERIOD_OF_DATA_SENSORS = 0x01;
const CONFIRMED_MODE_ACTIVATION = 0x03;
const PIN_CODE = 0x04;
const GLOBAL_OPERATION = 0x06;
const DATA_ACQUISITION_PERIOD = 0x14;
const MODBUS_LINK_CONFIGURATION = 0x15;
const SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST = 0x16;
const PERIODIC_DATA_1 = 0x1e;
const PERIODIC_DATA_2 = 0x1f;
const PERIODIC_DATA_3 = 0x20;
const PERIODIC_DATA_4 = 0x21;
const PERIODIC_DATA_5 = 0x22;
const PERIODIC_DATA_6 = 0x23;
const PERIODIC_DATA_7 = 0x24;
const PERIODIC_DATA_8 = 0x25;
const PERIODIC_DATA_9 = 0x26;
const PERIODIC_DATA_10 = 0x27;
const ALARM_CONFIGURATION_1 = 0x28;
const HIGH_THRESHOLD_ALARM_1 = 0x29;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1 = 0x2a;
const LOW_THRESHOLD_ALARM_1 = 0x2b;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1 = 0x2c;
const ALARM_CONFIGURATION_2 = 0x2d;
const HIGH_THRESHOLD_ALARM_2 = 0x2e;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2 = 0x2f;
const LOW_THRESHOLD_ALARM_2 = 0x30;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2 = 0x31;
const ALARM_CONFIGURATION_3 = 0x32;
const HIGH_THRESHOLD_ALARM_3 = 0x33;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3 = 0x34;
const LOW_THRESHOLD_ALARM_3 = 0x35;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3 = 0x36;
const ALARM_CONFIGURATION_4 = 0x37;
const HIGH_THRESHOLD_ALARM_4 = 0x38;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4 = 0x39;
const LOW_THRESHOLD_ALARM_4 = 0x3a;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4 = 0x3b;
const ALARM_CONFIGURATION_5 = 0x3c;
const HIGH_THRESHOLD_ALARM_5 = 0x3d;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5 = 0x3e;
const LOW_THRESHOLD_ALARM_5 = 0x3f;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5 = 0x40;
const ALARM_CONFIGURATION_6 = 0x41;
const HIGH_THRESHOLD_ALARM_6 = 0x42;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6 = 0x43;
const LOW_THRESHOLD_ALARM_6 = 0x44;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6 = 0x45;
const ALARM_CONFIGURATION_7 = 0x46;
const HIGH_THRESHOLD_ALARM_7 = 0x47;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7 = 0x48;
const LOW_THRESHOLD_ALARM_7 = 0x49;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7 = 0x4a;
const ALARM_CONFIGURATION_8 = 0x4b;
const HIGH_THRESHOLD_ALARM_8 = 0x4c;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8 = 0x4d;
const LOW_THRESHOLD_ALARM_8 = 0x4e;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8 = 0x4f;
const ALARM_CONFIGURATION_9 = 0x50;
const HIGH_THRESHOLD_ALARM_9 = 0x51;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9 = 0x52;
const LOW_THRESHOLD_ALARM_9 = 0x53;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9 = 0x54;
const ALARM_CONFIGURATION_10 = 0x55;
const HIGH_THRESHOLD_ALARM_10 = 0x56;
const HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10 = 0x57;
const LOW_THRESHOLD_ALARM_10 = 0x58;
const HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10 = 0x59;

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
const uplinkPeriodicData1Type = "PERIODIC_DATA_FRAME";
const uplinkAlarmType = "ALARM_FRAME";

const transmissionPeriodOfTheKeepAliveFrameStr = "TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME_SECONDS";
const transmissionPeriodOfDataSensorsStr = "TRANSMISSION_PERIOD_OF_DATA_SENSORS";
const confirmedModeActivationStr = "CONFIRMED_MODE_ACTIVATION";
const pinCodeStr = "PIN_CODE";
const globalOperationStr = "GLOBAL_OPERATION";
const dataAcquisitionPeriodStr = "DATA_ACQUISITION_PERIOD";
const modbusLinkConfigurationStr = "MODBUS_LINK_CONFIGURATION";
const supplyTimeOfTheExternalLoadBeforeTheModbusRequestStr = "SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST";
const periodicData1Str = "PERIODIC_DATA_1";
const periodicData2Str = "PERIODIC_DATA_2";
const periodicData3Str = "PERIODIC_DATA_3";
const periodicData4Str = "PERIODIC_DATA_4";
const periodicData5Str = "PERIODIC_DATA_5";
const periodicData6Str = "PERIODIC_DATA_6";
const periodicData7Str = "PERIODIC_DATA_7";
const periodicData8Str = "PERIODIC_DATA_8";
const periodicData9Str = "PERIODIC_DATA_9";
const periodicData10Str = "PERIODIC_DATA_10";
const alarmConfiguration1Str = "ALARM_CONFIGURATION_1";
const highThresholdAlarm1Str = "HIGH_THRESHOLD_ALARM_1";
const hysteresisOfHighThresholdAlarm1Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1";
const lowThresholdAlarm1Str = "LOW_THRESHOLD_ALARM_1";
const hysteresisOfLowThresholdAlarm1Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1";
const alarmConfiguration2Str = "ALARM_CONFIGURATION_2";
const highThresholdAlarm2Str = "HIGH_THRESHOLD_ALARM_2";
const hysteresisOfHighThresholdAlarm2Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2";
const lowThresholdAlarm2Str = "LOW_THRESHOLD_ALARM_2";
const hysteresisOfLowThresholdAlarm2Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2";
const alarmConfiguration3Str = "ALARM_CONFIGURATION_3";
const highThresholdAlarm3Str = "HIGH_THRESHOLD_ALARM_3";
const hysteresisOfHighThresholdAlarm3Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3";
const lowThresholdAlarm3Str = "LOW_THRESHOLD_ALARM_3";
const hysteresisOfLowThresholdAlarm3Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3";
const alarmConfiguration4Str = "ALARM_CONFIGURATION_4";
const highThresholdAlarm4Str = "HIGH_THRESHOLD_ALARM_4";
const hysteresisOfHighThresholdAlarm4Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4";
const lowThresholdAlarm4Str = "LOW_THRESHOLD_ALARM_4";
const hysteresisOfLowThresholdAlarm4Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4";
const alarmConfiguration5Str = "ALARM_CONFIGURATION_5";
const highThresholdAlarm5Str = "HIGH_THRESHOLD_ALARM_5";
const hysteresisOfHighThresholdAlarm5Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5";
const lowThresholdAlarm5Str = "LOW_THRESHOLD_ALARM_5";
const hysteresisOfLowThresholdAlarm5Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5";
const alarmConfiguration6Str = "ALARM_CONFIGURATION_6";
const highThresholdAlarm6Str = "HIGH_THRESHOLD_ALARM_6";
const hysteresisOfHighThresholdAlarm6Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6";
const lowThresholdAlarm6Str = "LOW_THRESHOLD_ALARM_6";
const hysteresisOfLowThresholdAlarm6Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6";
const alarmConfiguration7Str = "ALARM_CONFIGURATION_7";
const highThresholdAlarm7Str = "HIGH_THRESHOLD_ALARM_7";
const hysteresisOfHighThresholdAlarm7Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7";
const lowThresholdAlarm7Str = "LOW_THRESHOLD_ALARM_7";
const hysteresisOfLowThresholdAlarm7Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7";
const alarmConfiguration8Str = "ALARM_CONFIGURATION_8";
const highThresholdAlarm8Str = "HIGH_THRESHOLD_ALARM_8";
const hysteresisOfHighThresholdAlarm8Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8";
const lowThresholdAlarm8Str = "LOW_THRESHOLD_ALARM_8";
const hysteresisOfLowThresholdAlarm8Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8";
const alarmConfiguration9Str = "ALARM_CONFIGURATION_9";
const highThresholdAlarm9Str = "HIGH_THRESHOLD_ALARM_9";
const hysteresisOfHighThresholdAlarm9Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9";
const lowThresholdAlarm9Str = "LOW_THRESHOLD_ALARM_9";
const hysteresisOfLowThresholdAlarm9Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9";
const alarmConfiguration10Str = "ALARM_CONFIGURATION_10";
const highThresholdAlarm10Str = "HIGH_THRESHOLD_ALARM_10";
const hysteresisOfHighThresholdAlarm10Str = "HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10";
const lowThresholdAlarm10Str = "LOW_THRESHOLD_ALARM_10";
const hysteresisOfLowThresholdAlarm10Str = "HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10";

//  mapping the downlink message in a map with key = id and value = label
let downlinkMessageMap = new Map();
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME, transmissionPeriodOfTheKeepAliveFrameStr);
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_DATA_SENSORS, transmissionPeriodOfDataSensorsStr);
downlinkMessageMap.set(CONFIRMED_MODE_ACTIVATION, confirmedModeActivationStr);
downlinkMessageMap.set(PIN_CODE, pinCodeStr);
downlinkMessageMap.set(GLOBAL_OPERATION, globalOperationStr);
downlinkMessageMap.set(DATA_ACQUISITION_PERIOD, dataAcquisitionPeriodStr);
downlinkMessageMap.set(MODBUS_LINK_CONFIGURATION, modbusLinkConfigurationStr);
downlinkMessageMap.set(
    SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST,
    supplyTimeOfTheExternalLoadBeforeTheModbusRequestStr,
);
downlinkMessageMap.set(PERIODIC_DATA_1, periodicData1Str);
downlinkMessageMap.set(PERIODIC_DATA_2, periodicData2Str);
downlinkMessageMap.set(PERIODIC_DATA_3, periodicData3Str);
downlinkMessageMap.set(PERIODIC_DATA_4, periodicData4Str);
downlinkMessageMap.set(PERIODIC_DATA_5, periodicData5Str);
downlinkMessageMap.set(PERIODIC_DATA_6, periodicData6Str);
downlinkMessageMap.set(PERIODIC_DATA_7, periodicData7Str);
downlinkMessageMap.set(PERIODIC_DATA_8, periodicData8Str);
downlinkMessageMap.set(PERIODIC_DATA_9, periodicData9Str);
downlinkMessageMap.set(PERIODIC_DATA_10, periodicData10Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_1, alarmConfiguration1Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_1, highThresholdAlarm1Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1, hysteresisOfHighThresholdAlarm1Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_1, lowThresholdAlarm1Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1, hysteresisOfLowThresholdAlarm1Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_2, alarmConfiguration2Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_2, highThresholdAlarm2Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2, hysteresisOfHighThresholdAlarm2Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_2, lowThresholdAlarm2Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2, hysteresisOfLowThresholdAlarm2Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_3, alarmConfiguration3Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_3, highThresholdAlarm3Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3, hysteresisOfHighThresholdAlarm3Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_3, lowThresholdAlarm3Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3, hysteresisOfLowThresholdAlarm3Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_4, alarmConfiguration4Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_4, highThresholdAlarm4Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4, hysteresisOfHighThresholdAlarm4Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_4, lowThresholdAlarm4Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4, hysteresisOfLowThresholdAlarm4Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_5, alarmConfiguration5Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_5, highThresholdAlarm5Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5, hysteresisOfHighThresholdAlarm5Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_5, lowThresholdAlarm5Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5, hysteresisOfLowThresholdAlarm5Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_6, alarmConfiguration6Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_6, highThresholdAlarm6Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6, hysteresisOfHighThresholdAlarm6Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_6, lowThresholdAlarm6Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6, hysteresisOfLowThresholdAlarm6Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_7, alarmConfiguration7Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_7, highThresholdAlarm7Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7, hysteresisOfHighThresholdAlarm7Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_7, lowThresholdAlarm7Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7, hysteresisOfLowThresholdAlarm7Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_8, alarmConfiguration8Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_8, highThresholdAlarm8Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8, hysteresisOfHighThresholdAlarm8Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_8, lowThresholdAlarm8Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8, hysteresisOfLowThresholdAlarm8Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_9, alarmConfiguration9Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_9, highThresholdAlarm9Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9, hysteresisOfHighThresholdAlarm9Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_9, lowThresholdAlarm9Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9, hysteresisOfLowThresholdAlarm9Str);
downlinkMessageMap.set(ALARM_CONFIGURATION_10, alarmConfiguration10Str);
downlinkMessageMap.set(HIGH_THRESHOLD_ALARM_10, highThresholdAlarm10Str);
downlinkMessageMap.set(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10, hysteresisOfHighThresholdAlarm10Str);
downlinkMessageMap.set(LOW_THRESHOLD_ALARM_10, lowThresholdAlarm10Str);
downlinkMessageMap.set(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10, hysteresisOfLowThresholdAlarm10Str);

const rs485Str = "RS485";
const rs232Str = "RS232";

const oneBitStr = "_1_BIT";
const twoBitsStr = "_2_BITS";

const noneStr = "NONE";
const evenStr = "EVEN";
const oddStr = "ODD";

const _1200Str = "_1200";
const _2400Str = "_2400";
const _4800Str = "_4800";
const _9600Str = "_9600";
const _19200Str = "_19200";
const _38400Str = "_38400";
const _57600Str = "_57600";
const _115200Str = "_115200";

const otaaStr = "OTAA";
const abpStr = "ABP";

const noAlarmStr = "NO_ALARM";
const highThresholdStr = "HIGH_THRESHOLD";
const lowThresholdStr = "LOW_THRESHOLD";
const highAndLowThresholdsStr = "HIGH_AND_LOW_THRESHOLD";

const holdingStr = "HOLDING_REGISTERS";
const inputStr = "INPUT_REGISTERS";

const parkModeStr = "PARK_MODE";
const productionModeStr = "PRODUCTION_MODE";
const testModeStr = "TEST_MODE";

const unsignedInteger16Str = "_16_BIT_UNSIGNED_INTEGER";
const signedInteger16Str = "_16_BIT_SIGNED_INTEGER";
const unsignedInteger32Str = "_32_BIT_UNSIGNED_INTEGER";
const signedInteger32Str = "_32_BIT_SIGNED_INTEGER";
const unsignedInteger32WordSwapStr = "_32_BIT_UNSIGNED_INTEGER_WORD_SWAP";
const signedInteger32WordSwapStr = "_32_BIT_SIGNED_INTEGER_WORD_SWAP";

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

//  convert a boolean to a byte
function booleanToByte(bool) {
    return bool ? 0x01 : 0x00;
}

//  mapping the bus type for decoding
function getBusType(value) {
    switch (value) {
        case 0:
            return rs485Str;
        case 1:
            return rs232Str;
    }
}

//  mapping the stop bits for decoding
function getStopBits(value) {
    switch (value) {
        case 0:
            return oneBitStr;
        case 1:
            return twoBitsStr;
    }
}

//  mapping the parity for decoding
function getParity(value) {
    switch (value) {
        case 0:
            return noneStr;
        case 1:
            return evenStr;
        case 2:
            return oddStr;
    }
}

//  mapping the baud rate for decoding
function getBaudRate(value) {
    switch (value) {
        case 0:
            return _1200Str;
        case 1:
            return _2400Str;
        case 2:
            return _4800Str;
        case 3:
            return _9600Str;
        case 4:
            return _19200Str;
        case 5:
            return _38400Str;
        case 6:
            return _57600Str;
        case 7:
            return _115200Str;
    }
}

//  mapping the connection for network configuration frame for decoding
function getConnectionMode(value) {
    switch (value) {
        case 0:
            return abpStr;
        case 1:
            return otaaStr;
    }
}

//  mapping the alarm status for decoding
function getAlarmStatus(value) {
    switch (value) {
        case 0:
            return noAlarmStr;
        case 1:
            return highThresholdStr;
        case 2:
            return lowThresholdStr;
    }
}

//  mapping the register type for decoding
function getRegisterType(value) {
    switch (value) {
        case 0:
            return holdingStr;
        case 1:
            return inputStr;
    }
}

//  mapping global operation for decoding
function getGlobalOperation(value) {
    switch (value) {
        case 0:
            return parkModeStr;
        case 1:
            return productionModeStr;
        case 2:
            return testModeStr;
    }
}

//  mapping the active thresholds for decoding
function getActiveThresholds(value) {
    switch (value) {
        case 1:
            return lowThresholdStr;
        case 2:
            return highThresholdStr;
        case 3:
            return highAndLowThresholdsStr;
    }
}

//  mapping the data type for decoding
function getDataType(value) {
    switch (value) {
        case 0:
            return unsignedInteger16Str;
        case 1:
            return signedInteger16Str;
        case 2:
            return unsignedInteger32Str;
        case 3:
            return signedInteger32Str;
        case 4:
            return unsignedInteger32WordSwapStr;
        case 5:
            return signedInteger32WordSwapStr;
    }
}

//  mapping the register type for encoding
function encodeRegisterType(value) {
    switch (value) {
        case holdingStr:
            return 0x00;
        case inputStr:
            return 0x01;
    }
}

//  mapping global operation for encoding
function encodeGlobalOperation(value) {
    switch (value) {
        case parkModeStr:
            return 0x00;
        case productionModeStr:
            return 0x01;
        case testModeStr:
            return 0x02;
    }
}

//  mapping the active thresholds for encoding
function encodeActiveThresholds(value) {
    switch (value) {
        case lowThresholdStr:
            return 0x01;
        case highThresholdStr:
            return 0x02;
        case highAndLowThresholdsStr:
            return 0x03;
    }
}

//  mapping the data type for encoding
function encodeDataType(value) {
    switch (value) {
        case unsignedInteger16Str:
            return 0x00;
        case signedInteger16Str:
            return 0x01;
        case unsignedInteger32Str:
            return 0x02;
        case signedInteger32Str:
            return 0x03;
        case unsignedInteger32WordSwapStr:
            return 0x04;
        case signedInteger32WordSwapStr:
            return 0x05;
    }
}

//  mapping the bus type for encoding
function encodeBusType(value) {
    switch (value) {
        case rs485Str:
            return 0x00;
        case rs232Str:
            return 0x01;
    }
}

//  mapping the stop bits for encoding
function encodeStopBits(value) {
    switch (value) {
        case oneBitStr:
            return 0x00;
        case twoBitsStr:
            return 0x01;
    }
}

//  mapping the parity for encoding
function encodeParity(value) {
    switch (value) {
        case noneStr:
            return 0x00;
        case evenStr:
            return 0x01;
        case oddStr:
            return 0x02;
    }
}

//  mapping the baud rate for encoding
function encodeBaudRate(value) {
    switch (value) {
        case _1200Str:
            return 0x00;
        case _2400Str:
            return 0x01;
        case _4800Str:
            return 0x02;
        case _9600Str:
            return 0x03;
        case _19200Str:
            return 0x04;
        case _38400Str:
            return 0x05;
        case _57600Str:
            return 0x06;
        case _115200Str:
            return 0x07;
    }
}

/*
............................................................................................................................
 this part is is used to avoid re-using the same code for several frames
............................................................................................................................
*/

//  read the registers values for uplink decoding
function readRegistersValues(payload, register) {
    register.modbusRegisters = [];
    for (let i = 4; i < payload.length; i += 4) {
        let readings = {};
        readings.numberOfRegister = i / 4;
        readings.value = hexToDec(payload, i, i + 4);
        register.modbusRegisters.push(readings);
    }
}

//  read periodic data for downlink decoding
function readPeriodicData(payload) {
    let periodicData = {};
    periodicData.numberOfRegisters = payload & 0x0f;
    periodicData.modbusRegisterType = getRegisterType((payload >> 4) & 0x01);
    periodicData.associatedPeriodicFrame = (payload >> 5) & 0x07;
    periodicData.firstRegisterAddress = (payload >> 8) & 0xffff;
    periodicData.slaveAddress = payload >> 24;
    return periodicData;
}

//  read alarm configuration for downlink decoding
function readAlarmConfiguration(payload) {
    let alarmConfiguration = {};
    alarmConfiguration.activeThreshold = getActiveThresholds(payload & 0x03);
    alarmConfiguration.modbusRegisterType = getRegisterType((payload >> 2) & 0x01);
    alarmConfiguration.dataType = getDataType((payload >> 4) & 0x07);
    alarmConfiguration.firstRegisterAddress = (payload >> 8) & 0xffff;
    alarmConfiguration.slaveAddress = payload >> 24;
    return alarmConfiguration;
}

//  encode periodic data for downlink encoding
function encodePeriodicData(payload) {
    const lowerFirstByte = payload.numberOfRegisters;
    let upperFirstByte = encodeRegisterType(payload.modbusRegisterType);
    upperFirstByte |= payload.associatedPeriodicFrame << 1;
    const byte = (upperFirstByte << 4) | lowerFirstByte;
    const toPush = [byte];

    const firstRegisterAddressBytes = decToBytes(payload.firstRegisterAddress);
    while (firstRegisterAddressBytes.length < 2) {
        firstRegisterAddressBytes.unshift(0x00);
    }
    toPush.unshift(firstRegisterAddressBytes);

    toPush.unshift(decToBytes(payload.slaveAddress));

    return toPush;
}

//  encode alarm configuration for downlink encoding
function encodeAlarmConfiguration(payload) {
    let lowerFirstByte = encodeActiveThresholds(payload.activeThreshold);
    lowerFirstByte |= encodeRegisterType(payload.modbusRegisterType) << 2;
    const upperFirstByte = encodeDataType(payload.dataType);
    const byte = (upperFirstByte << 4) | lowerFirstByte;
    const toPush = byte;

    const firstRegisterAddressBytes = decToBytes(payload.firstRegisterAddress);
    while (firstRegisterAddressBytes.length < 2) {
        firstRegisterAddressBytes.unshift(0x00);
    }
    toPush.unshift(firstRegisterAddressBytes);

    toPush.unshift(decToBytes(payload.slaveAddress));

    return toPush;
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
    result.configurationSuccessful = (status & 0x01) == 1;
    result.lowBattery = ((status >> 1) & 0x01) == 1;
    result.hardwareError = ((status >> 2) & 0x01) == 1;
    result.configurationError = ((status >> 3) & 0x01) == 1;
    result.slaveReadError = ((status >> 4) & 0x01) == 1;

    switch (code) {
        case PRODUCT_CONFIGURATION:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfigType;
            result.register = {};

            result.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, 6, 10) * 10;
            result.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, 10, 12));
            if (result.register.globalOperation == productionModeStr) {
                result.register.transmissionPeriodOfTheKeepAliveFrameSeconds = hexToDec(payloadHex, 4, 6) * 600;
            } else if (result.register.globalOperation == testModeStr) {
                result.register.transmissionPeriodOfTheKeepAliveFrameSeconds = hexToDec(payloadHex, 4, 6) * 20;
            } else {
                result.register.transmissionPeriodOfTheKeepAliveFrameSeconds = hexToDec(payloadHex, 4, 6);
            }
            result.register.dataAcquisitionPeriod = hexToDec(payloadHex, 12, 16) * 10;
            result.register.modbusLinkConfiguration = {};
            const config = hexToDec(payloadHex, 16, 18);
            const lower = config & 0x0f;
            const upper = config >> 4;
            result.register.modbusLinkConfiguration.type = getBusType(lower & 0x01);
            result.register.modbusLinkConfiguration.stopBits = getStopBits((lower >> 1) & 0x01);
            result.register.modbusLinkConfiguration.parity = getParity((lower >> 2) & 0x03);
            result.register.modbusLinkConfiguration.baudrate = getBaudRate(upper);
            result.register.supplyTimeOfTheExternalLoadBeforeTheModbusRequest = hexToDec(payloadHex, 18, 22) / 10;
            break;

        case NETWORK_CONFIGURATION:
            if (nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkNetworkConfigType;
            result.register = {};

            const option = hexToDec(payloadHex, 4, 6);
            result.register.lorawanOptions = {};
            result.register.lorawanOptions.adaptiveDataRate = (option & 0x01) == 1;
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

        case PERIODIC_DATA_FRAME:
            if (nbBytes > 50) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkPeriodicData1Type;
            result.register = {};

            readRegistersValues(payloadHex, result.register);

            break;

        case ALARM_FRAME:
            result.type = uplinkAlarmType;
            result.register = {};

            result.register.modbusSlaveAddress = hexToDec(payloadHex, 4, 6);
            result.register.modbusRegisterAddress = hexToDec(payloadHex, 6, 10);
            result.register.valueOfModbusRegister1 = hexToDec(payloadHex, 10, 14);
            if (nbBytes == 9) {
                result.register.valueOfModbusRegister2 = hexToDec(payloadHex, 14, 18);
            }
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
            if (nbBytes != 1) {
                throw new Error(downlinkLengthError);
            }
            result.type = "PRODUCT_CONFIGURATION_REQUEST_FRAME";
            break;

        case NETWORK_CONFIGURATION_REQUEST_FRAME:
            if (nbBytes != 1) {
                throw new Error(downlinkLengthError);
            }
            result.type = "NETWORK_CONFIGURATION_REQUEST_FRAME";
            break;

        case SPECIFIC_REGISTER_VALUE_REQUEST_FRAME:
            result.type = "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME";
            result.payload = {};
            result.payload.type = "ModbusSpecificRegisterValueRequestFrame";
            result.payload.message = [];
            for (let i = 2; i < payloadHex.length; i += 2) {
                result.payload.message.push(downlinkMessageMap.get(hexToDec(payloadHex, i, i + 2)));
            }
            break;

        case FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS:
            result.type = "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS";
            result.payload = {};
            result.payload.type = "ModbusFrameForUpdatingTheValueOfSpecificRegisters";
            result.payload.register = {};
            let pos = 2;
            while (pos < payloadHex.length) {
                const confId = hexToDec(payloadHex, pos, pos + 2);
                pos += 2;
                switch (confId) {
                    case TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME:
                        result.payload.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, pos, pos + 4) * 10;
                        pos += 4;
                        break;

                    case TRANSMISSION_PERIOD_OF_DATA_SENSORS:
                        result.payload.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, pos, pos + 4) * 10;
                        pos += 4;
                        break;

                    case CONFIRMED_MODE_ACTIVATION:
                        result.payload.register.confirmedModeActivation = hexToDec(payloadHex, pos, pos + 2) == 1;
                        pos += 2;
                        break;

                    case PIN_CODE:
                        result.payload.register.pinCode = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case GLOBAL_OPERATION:
                        result.payload.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, pos, pos + 4));
                        pos += 4;
                        break;

                    case DATA_ACQUISITION_PERIOD:
                        result.payload.register.dataAcquisitionPeriod = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case MODBUS_LINK_CONFIGURATION:
                        result.payload.register.modbusLinkConfiguration = {};
                        const config = hexToDec(payloadHex, pos, pos + 2);
                        const lower = config & 0x0f;
                        const upper = config >> 4;
                        result.payload.register.modbusLinkConfiguration.type = getBusType(lower & 0x01);
                        result.payload.register.modbusLinkConfiguration.stopBits = getStopBits((lower >> 1) & 0x01);
                        result.payload.register.modbusLinkConfiguration.parity = getParity((lower >> 2) & 0x03);
                        result.payload.register.modbusLinkConfiguration.baudrate = getBaudRate(upper);
                        pos += 2;
                        break;

                    case SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST:
                        result.payload.register.supplyTimeOfTheExternalLoadBeforeTheModbusRequest =
                            hexToDec(payloadHex, pos, pos + 4) / 10;
                        pos += 4;
                        break;

                    case PERIODIC_DATA_1:
                        result.payload.register.periodicData1 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_2:
                        result.payload.register.periodicData2 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_3:
                        result.payload.register.periodicData3 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_4:
                        result.payload.register.periodicData4 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_5:
                        result.payload.register.periodicData5 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_6:
                        result.payload.register.periodicData6 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_7:
                        result.payload.register.periodicData7 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_8:
                        result.payload.register.periodicData8 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_9:
                        result.payload.register.periodicData9 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case PERIODIC_DATA_10:
                        result.payload.register.periodicData10 = readPeriodicData(hexToDec(payloadHex, pos, pos + 8));
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_1:
                        result.payload.register.alarmConfiguration1 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_2:
                        result.payload.register.alarmConfiguration2 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_3:
                        result.payload.register.alarmConfiguration3 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_4:
                        result.payload.register.alarmConfiguration4 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_5:
                        result.payload.register.alarmConfiguration5 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_6:
                        result.payload.register.alarmConfiguration6 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_7:
                        result.payload.register.alarmConfiguration7 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_8:
                        result.payload.register.alarmConfiguration8 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_9:
                        result.payload.register.alarmConfiguration9 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case ALARM_CONFIGURATION_10:
                        result.payload.register.alarmConfiguration10 = readAlarmConfiguration(
                            hexToDec(payloadHex, pos, pos + 8),
                        );
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_1:
                        result.payload.register.highThresholdAlarm1 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1:
                        result.payload.register.hysteresisOfHighThresholdAlarm1 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_1:
                        result.payload.register.lowThresholdAlarm1 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1:
                        result.payload.register.hysteresisOfLowThresholdAlarm1 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_2:
                        result.payload.register.highThresholdAlarm2 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2:
                        result.payload.register.hysteresisOfHighThresholdAlarm2 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_2:
                        result.payload.register.lowThresholdAlarm2 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2:
                        result.payload.register.hysteresisOfLowThresholdAlarm2 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_3:
                        result.payload.register.highThresholdAlarm3 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3:
                        result.payload.register.hysteresisOfHighThresholdAlarm3 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_3:
                        result.payload.register.lowThresholdAlarm3 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3:
                        result.payload.register.hysteresisOfLowThresholdAlarm3 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_4:
                        result.payload.register.highThresholdAlarm4 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4:
                        result.payload.register.hysteresisOfHighThresholdAlarm4 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_4:
                        result.payload.register.lowThresholdAlarm4 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4:
                        result.payload.register.hysteresisOfLowThresholdAlarm4 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_5:
                        result.payload.register.highThresholdAlarm5 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5:
                        result.payload.register.hysteresisOfHighThresholdAlarm5 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_5:
                        result.payload.register.lowThresholdAlarm5 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5:
                        result.payload.register.hysteresisOfLowThresholdAlarm5 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_6:
                        result.payload.register.highThresholdAlarm6 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6:
                        result.payload.register.hysteresisOfHighThresholdAlarm6 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_6:
                        result.payload.register.lowThresholdAlarm6 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6:
                        result.payload.register.hysteresisOfLowThresholdAlarm6 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_7:
                        result.payload.register.highThresholdAlarm7 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7:
                        result.payload.register.hysteresisOfHighThresholdAlarm7 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_7:
                        result.payload.register.lowThresholdAlarm7 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7:
                        result.payload.register.hysteresisOfLowThresholdAlarm7 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_8:
                        result.payload.register.highThresholdAlarm8 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8:
                        result.payload.register.hysteresisOfHighThresholdAlarm8 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_8:
                        result.payload.register.lowThresholdAlarm8 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8:
                        result.payload.register.hysteresisOfLowThresholdAlarm8 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_9:
                        result.payload.register.highThresholdAlarm9 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9:
                        result.payload.register.hysteresisOfHighThresholdAlarm9 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_9:
                        result.payload.register.lowThresholdAlarm9 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9:
                        result.payload.register.hysteresisOfLowThresholdAlarm9 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case HIGH_THRESHOLD_ALARM_10:
                        result.payload.register.highThresholdAlarm10 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10:
                        result.payload.register.hysteresisOfHighThresholdAlarm10 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case LOW_THRESHOLD_ALARM_10:
                        result.payload.register.lowThresholdAlarm10 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10:
                        result.payload.register.hysteresisOfLowThresholdAlarm10 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
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
                bytes = [PRODUCT_CONFIGURATION_REQUEST_FRAME];
            }
            break;

        case "NETWORK_CONFIGURATION_REQUEST_FRAME":
            if (input.register == null) {
                bytes = [NETWORK_CONFIGURATION_REQUEST_FRAME];
            }
            break;

        case "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME":
            bytes.push(SPECIFIC_REGISTER_VALUE_REQUEST_FRAME);
            let payloadArray = [];
            if (input.payload != null) {
                if(input.payload.message != null){
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
                const toPush = decToBytes(payload.transmissionPeriodOfTheKeepAliveFrame / 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.transmissionPeriodOfDataSensors != null) {
                bytes.push(TRANSMISSION_PERIOD_OF_DATA_SENSORS);
                const toPush = decToBytes(payload.transmissionPeriodOfPeriodicData1 / 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.confirmedModeActivation != null) {
                bytes.push(CONFIRMED_MODE_ACTIVATION);
                const toPush = booleanToByte(payload.confirmedModeActivation);
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
                bytes.push(PRODUCT_MODE);
                const toPush = encodeGlobalOperation(payload.globalOperation);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.dataAcquisitionPeriod != null) {
                bytes.push(DATA_ACQUISITION_PERIOD);
                const toPush = decToBytes(payload.dataAcquisitionPeriod);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.modbusLinkConfiguration != null) {
                bytes.push(MODBUS_LINK_CONFIGURATION);
                let lowerByte = encodeBusType(payload.modbusLinkConfiguration.type);
                lowerByte |= encodeStopBits(payload.modbusLinkConfiguration.stopBits) << 1;
                lowerByte |= encodeParity(payload.modbusLinkConfiguration.parity) << 2;
                const upperByte = encodeBaudRate(payload.modbusLinkConfiguration.baudrate);
                const byte = (upperByte << 4) | lowerByte;
                bytes.push(byte);
            }
            if (payload.supplyTimeOfTheExternalLoadBeforeTheModbusRequest != null) {
                bytes.push(SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST);
                const toPush = decToBytes(payload.supplyTimeOfTheExternalLoadBeforeTheModbusRequest * 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.periodicData1 != null) {
                bytes.push(PERIODIC_DATA_1);
                bytes.push(encodePeriodicData(payload.periodicData1));
            }
            if (payload.periodicData2 != null) {
                bytes.push(PERIODIC_DATA_2);
                bytes.push(encodePeriodicData(payload.periodicData2));
            }
            if (payload.periodicData3 != null) {
                bytes.push(PERIODIC_DATA_3);
                bytes.push(encodePeriodicData(payload.periodicData3));
            }
            if (payload.periodicData4 != null) {
                bytes.push(PERIODIC_DATA_4);
                bytes.push(encodePeriodicData(payload.periodicData4));
            }
            if (payload.periodicData5 != null) {
                bytes.push(PERIODIC_DATA_5);
                bytes.push(encodePeriodicData(payload.periodicData5));
            }
            if (payload.periodicData6 != null) {
                bytes.push(PERIODIC_DATA_6);
                bytes.push(encodePeriodicData(payload.periodicData6));
            }
            if (payload.periodicData7 != null) {
                bytes.push(PERIODIC_DATA_7);
                bytes.push(encodePeriodicData(payload.periodicData7));
            }
            if (payload.periodicData8 != null) {
                bytes.push(PERIODIC_DATA_8);
                bytes.push(encodePeriodicData(payload.periodicData8));
            }
            if (payload.periodicData9 != null) {
                bytes.push(PERIODIC_DATA_9);
                bytes.push(encodePeriodicData(payload.periodicData9));
            }
            if (payload.periodicData10 != null) {
                bytes.push(PERIODIC_DATA_10);
                bytes.push(encodePeriodicData(payload.periodicData10));
            }
            if (payload.alarmConfiguration1 != null) {
                bytes.push(ALARM_CONFIGURATION_1);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration1));
            }
            if (payload.alarmConfiguration2 != null) {
                bytes.push(ALARM_CONFIGURATION_2);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration2));
            }
            if (payload.alarmConfiguration3 != null) {
                bytes.push(ALARM_CONFIGURATION_3);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration3));
            }
            if (payload.alarmConfiguration4 != null) {
                bytes.push(ALARM_CONFIGURATION_4);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration4));
            }
            if (payload.alarmConfiguration5 != null) {
                bytes.push(ALARM_CONFIGURATION_5);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration5));
            }
            if (payload.alarmConfiguration6 != null) {
                bytes.push(ALARM_CONFIGURATION_6);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration6));
            }
            if (payload.alarmConfiguration7 != null) {
                bytes.push(ALARM_CONFIGURATION_7);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration7));
            }
            if (payload.alarmConfiguration8 != null) {
                bytes.push(ALARM_CONFIGURATION_8);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration8));
            }
            if (payload.alarmConfiguration9 != null) {
                bytes.push(ALARM_CONFIGURATION_9);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration9));
            }
            if (payload.alarmConfiguration10 != null) {
                bytes.push(ALARM_CONFIGURATION_10);
                bytes.push(encodeAlarmConfiguration(payload.alarmConfiguration10));
            }
            if (payload.highThresholdAlarm1 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_1);
                const toPush = decToBytes(payload.highThresholdAlarm1);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm1 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm1);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm1 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_1);
                const toPush = decToBytes(payload.lowThresholdAlarm1);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm1 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm1);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm2 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_2);
                const toPush = decToBytes(payload.highThresholdAlarm2);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm2 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm2);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm2 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_2);
                const toPush = decToBytes(payload.lowThresholdAlarm2);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm2 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm2);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm3 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_3);
                const toPush = decToBytes(payload.highThresholdAlarm3);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm3 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm3);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm3 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_3);
                const toPush = decToBytes(payload.lowThresholdAlarm3);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm3 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm3);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm4 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_4);
                const toPush = decToBytes(payload.highThresholdAlarm4);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm4 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm4);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm4 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_4);
                const toPush = decToBytes(payload.lowThresholdAlarm4);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm4 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm4);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm5 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_5);
                const toPush = decToBytes(payload.highThresholdAlarm5);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm5 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm5);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm5 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_5);
                const toPush = decToBytes(payload.lowThresholdAlarm5);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm5 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm5);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm6 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_6);
                const toPush = decToBytes(payload.highThresholdAlarm6);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm6 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm6);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm6 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_6);
                const toPush = decToBytes(payload.lowThresholdAlarm6);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm6 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm6);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm7 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_7);
                const toPush = decToBytes(payload.highThresholdAlarm7);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm7 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm7);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm7 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_7);
                const toPush = decToBytes(payload.lowThresholdAlarm7);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm7 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm7);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm8 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_8);
                const toPush = decToBytes(payload.highThresholdAlarm8);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm8 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm8);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm8 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_8);
                const toPush = decToBytes(payload.lowThresholdAlarm8);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm8 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm8);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm9 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_9);
                const toPush = decToBytes(payload.highThresholdAlarm9);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm9 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm9);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm9 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_9);
                const toPush = decToBytes(payload.lowThresholdAlarm9);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm9 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm9);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.highThresholdAlarm10 != null) {
                bytes.push(HIGH_THRESHOLD_ALARM_10);
                const toPush = decToBytes(payload.highThresholdAlarm10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOfHighThresholdAlarm10 != null) {
                bytes.push(HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10);
                const toPush = decToBytes(payload.hysteresisOfHighThresholdAlarm10);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.lowThresholdAlarm10 != null) {
                bytes.push(LOW_THRESHOLD_ALARM_10);
                const toPush = decToBytes(payload.lowThresholdAlarm10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.hysteresisOflowThresholdAlarm10 != null) {
                bytes.push(HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10);
                const toPush = decToBytes(payload.hysteresisOflowThresholdAlarm10);
                while (toPush.length < 4) {
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


exports.PRODUCT_CONFIGURATION = PRODUCT_CONFIGURATION;
exports.NETWORK_CONFIGURATION = NETWORK_CONFIGURATION;
exports.KEEP_ALIVE = KEEP_ALIVE;
exports.REPLY_FRAME_TO_REGISTER_VALUE_REQUEST = REPLY_FRAME_TO_REGISTER_VALUE_REQUEST;
exports.PERIODIC_DATA_FRAME = PERIODIC_DATA_FRAME;
exports.ALARM_FRAME = ALARM_FRAME;
exports.PRODUCT_CONFIGURATION_REQUEST_FRAME = PRODUCT_CONFIGURATION_REQUEST_FRAME;
exports.NETWORK_CONFIGURATION_REQUEST_FRAME = NETWORK_CONFIGURATION_REQUEST_FRAME;
exports.SPECIFIC_REGISTER_VALUE_REQUEST_FRAME = SPECIFIC_REGISTER_VALUE_REQUEST_FRAME;
exports.FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS = FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS;
exports.TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME = TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME;
exports.TRANSMISSION_PERIOD_OF_PERIODIC_DATA_1 = TRANSMISSION_PERIOD_OF_DATA_SENSORS;
exports.CONFIRMED_MODE_ACTIVATION = CONFIRMED_MODE_ACTIVATION;
exports.PIN_CODE = PIN_CODE;
exports.GLOBAL_OPERATION = GLOBAL_OPERATION;
exports.DATA_ACQUISITION_PERIOD = DATA_ACQUISITION_PERIOD;
exports.MODBUS_LINK_CONFIGURATION = MODBUS_LINK_CONFIGURATION;
exports.SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST = SUPPLY_TIME_OF_THE_EXTERNAL_LOAD_BEFORE_THE_MODBUS_REQUEST;
exports.PERIODIC_DATA_1 = PERIODIC_DATA_1;
exports.PERIODIC_DATA_2 = PERIODIC_DATA_2;
exports.PERIODIC_DATA_3 = PERIODIC_DATA_3;
exports.PERIODIC_DATA_4 = PERIODIC_DATA_4;
exports.PERIODIC_DATA_5 = PERIODIC_DATA_5;
exports.PERIODIC_DATA_6 = PERIODIC_DATA_6;
exports.PERIODIC_DATA_7 = PERIODIC_DATA_7;
exports.PERIODIC_DATA_8 = PERIODIC_DATA_8;
exports.PERIODIC_DATA_9 = PERIODIC_DATA_9;
exports.PERIODIC_DATA_10 = PERIODIC_DATA_10;
exports.ALARM_CONFIGURATION_1 = ALARM_CONFIGURATION_1;
exports.HIGH_THRESHOLD_ALARM_1 = HIGH_THRESHOLD_ALARM_1;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_1;
exports.LOW_THRESHOLD_ALARM_1 = LOW_THRESHOLD_ALARM_1;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_1;
exports.ALARM_CONFIGURATION_2 = ALARM_CONFIGURATION_2;
exports.HIGH_THRESHOLD_ALARM_2 = HIGH_THRESHOLD_ALARM_2;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_2;
exports.LOW_THRESHOLD_ALARM_2 = LOW_THRESHOLD_ALARM_2;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_2;
exports.ALARM_CONFIGURATION_3 = ALARM_CONFIGURATION_3;
exports.HIGH_THRESHOLD_ALARM_3 = HIGH_THRESHOLD_ALARM_3;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_3;
exports.LOW_THRESHOLD_ALARM_3 = LOW_THRESHOLD_ALARM_3;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_3;
exports.ALARM_CONFIGURATION_4 = ALARM_CONFIGURATION_4;
exports.HIGH_THRESHOLD_ALARM_4 = HIGH_THRESHOLD_ALARM_4;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_4;
exports.LOW_THRESHOLD_ALARM_4 = LOW_THRESHOLD_ALARM_4;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_4;
exports.ALARM_CONFIGURATION_5 = ALARM_CONFIGURATION_5;
exports.HIGH_THRESHOLD_ALARM_5 = HIGH_THRESHOLD_ALARM_5;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_5;
exports.LOW_THRESHOLD_ALARM_5 = LOW_THRESHOLD_ALARM_5;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_5;
exports.ALARM_CONFIGURATION_6 = ALARM_CONFIGURATION_6;
exports.HIGH_THRESHOLD_ALARM_6 = HIGH_THRESHOLD_ALARM_6;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_6;
exports.LOW_THRESHOLD_ALARM_6 = LOW_THRESHOLD_ALARM_6;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_6;
exports.ALARM_CONFIGURATION_7 = ALARM_CONFIGURATION_7;
exports.HIGH_THRESHOLD_ALARM_7 = HIGH_THRESHOLD_ALARM_7;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_7;
exports.LOW_THRESHOLD_ALARM_7 = LOW_THRESHOLD_ALARM_7;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_7;
exports.ALARM_CONFIGURATION_8 = ALARM_CONFIGURATION_8;
exports.HIGH_THRESHOLD_ALARM_8 = HIGH_THRESHOLD_ALARM_8;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_8;
exports.LOW_THRESHOLD_ALARM_8 = LOW_THRESHOLD_ALARM_8;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_8;
exports.ALARM_CONFIGURATION_9 = ALARM_CONFIGURATION_9;
exports.HIGH_THRESHOLD_ALARM_9 = HIGH_THRESHOLD_ALARM_9;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_9;
exports.LOW_THRESHOLD_ALARM_9 = LOW_THRESHOLD_ALARM_9;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_9;
exports.ALARM_CONFIGURATION_10 = ALARM_CONFIGURATION_10;
exports.HIGH_THRESHOLD_ALARM_10 = HIGH_THRESHOLD_ALARM_10;
exports.HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10 = HYSTERESIS_OF_HIGH_THRESHOLD_ALARM_10;
exports.LOW_THRESHOLD_ALARM_10 = LOW_THRESHOLD_ALARM_10;
exports.HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10 = HYSTERESIS_OF_LOW_THRESHOLD_ALARM_10;
exports.uplinkEmptyError = uplinkEmptyError;
exports.downlinkEmptyError = downlinkEmptyError;
exports.downlinkFrameTypeError = downlinkFrameTypeError;
exports.uplinkLengthError = uplinkLengthError;
exports.uplinkFrameTypeError = uplinkFrameTypeError;
exports.downlinkRegisterIdError = downlinkRegisterIdError;
exports.downlinkLengthError = downlinkLengthError;
exports.uplinkProductConfigType = uplinkProductConfigType;
exports.uplinkNetworkConfigType = uplinkNetworkConfigType;
exports.uplinkKeepAliveType = uplinkKeepAliveType;
exports.uplinkReplyFrameToRegisterValueRequestStr = uplinkReplyFrameToRegisterValueRequestStr;
exports.uplinkPeriodicData1Type = uplinkPeriodicData1Type;
exports.uplinkAlarmType = uplinkAlarmType;
exports.transmissionPeriodOfTheKeepAliveFrameStr = transmissionPeriodOfTheKeepAliveFrameStr;
exports.transmissionPeriodOfDataSensorsStr = transmissionPeriodOfDataSensorsStr;
exports.confirmedModeActivationStr = confirmedModeActivationStr;
exports.pinCodeStr = pinCodeStr;
exports.globalOperationStr = globalOperationStr;
exports.dataAcquisitionPeriodStr = dataAcquisitionPeriodStr;
exports.modbusLinkConfigurationStr = modbusLinkConfigurationStr;
exports.supplyTimeOfTheExternalLoadBeforeTheModbusRequestStr = supplyTimeOfTheExternalLoadBeforeTheModbusRequestStr;
exports.periodicData1Str = periodicData1Str;
exports.periodicData2Str = periodicData2Str;
exports.periodicData3Str = periodicData3Str;
exports.periodicData4Str = periodicData4Str;
exports.periodicData5Str = periodicData5Str;
exports.periodicData6Str = periodicData6Str;
exports.periodicData7Str = periodicData7Str;
exports.periodicData8Str = periodicData8Str;
exports.periodicData9Str = periodicData9Str;
exports.periodicData10Str = periodicData10Str;
exports.alarmConfiguration1Str = alarmConfiguration1Str;
exports.highThresholdAlarm1Str = highThresholdAlarm1Str;
exports.hysteresisOfHighThresholdAlarm1Str = hysteresisOfHighThresholdAlarm1Str;
exports.lowThresholdAlarm1Str = lowThresholdAlarm1Str;
exports.hysteresisOfLowThresholdAlarm1Str = hysteresisOfLowThresholdAlarm1Str;
exports.alarmConfiguration2Str = alarmConfiguration2Str;
exports.highThresholdAlarm2Str = highThresholdAlarm2Str;
exports.hysteresisOfHighThresholdAlarm2Str = hysteresisOfHighThresholdAlarm2Str;
exports.lowThresholdAlarm2Str = lowThresholdAlarm2Str;
exports.hysteresisOfLowThresholdAlarm2Str = hysteresisOfLowThresholdAlarm2Str;
exports.alarmConfiguration3Str = alarmConfiguration3Str;
exports.highThresholdAlarm3Str = highThresholdAlarm3Str;
exports.hysteresisOfHighThresholdAlarm3Str = hysteresisOfHighThresholdAlarm3Str;
exports.lowThresholdAlarm3Str = lowThresholdAlarm3Str;
exports.hysteresisOfLowThresholdAlarm3Str = hysteresisOfLowThresholdAlarm3Str;
exports.alarmConfiguration4Str = alarmConfiguration4Str;
exports.highThresholdAlarm4Str = highThresholdAlarm4Str;
exports.hysteresisOfHighThresholdAlarm4Str = hysteresisOfHighThresholdAlarm4Str;
exports.lowThresholdAlarm4Str = lowThresholdAlarm4Str;
exports.hysteresisOfLowThresholdAlarm4Str = hysteresisOfLowThresholdAlarm4Str;
exports.alarmConfiguration5Str = alarmConfiguration5Str;
exports.highThresholdAlarm5Str = highThresholdAlarm5Str;
exports.hysteresisOfHighThresholdAlarm5Str = hysteresisOfHighThresholdAlarm5Str;
exports.lowThresholdAlarm5Str = lowThresholdAlarm5Str;
exports.hysteresisOfLowThresholdAlarm5Str = hysteresisOfLowThresholdAlarm5Str;
exports.alarmConfiguration6Str = alarmConfiguration6Str;
exports.highThresholdAlarm6Str = highThresholdAlarm6Str;
exports.hysteresisOfHighThresholdAlarm6Str = hysteresisOfHighThresholdAlarm6Str;
exports.lowThresholdAlarm6Str = lowThresholdAlarm6Str;
exports.hysteresisOfLowThresholdAlarm6Str = hysteresisOfLowThresholdAlarm6Str;
exports.alarmConfiguration7Str = alarmConfiguration7Str;
exports.highThresholdAlarm7Str = highThresholdAlarm7Str;
exports.hysteresisOfHighThresholdAlarm7Str = hysteresisOfHighThresholdAlarm7Str;
exports.lowThresholdAlarm7Str = lowThresholdAlarm7Str;
exports.hysteresisOfLowThresholdAlarm7Str = hysteresisOfLowThresholdAlarm7Str;
exports.alarmConfiguration8Str = alarmConfiguration8Str;
exports.highThresholdAlarm8Str = highThresholdAlarm8Str;
exports.hysteresisOfHighThresholdAlarm8Str = hysteresisOfHighThresholdAlarm8Str;
exports.lowThresholdAlarm8Str = lowThresholdAlarm8Str;
exports.hysteresisOfLowThresholdAlarm8Str = hysteresisOfLowThresholdAlarm8Str;
exports.alarmConfiguration9Str = alarmConfiguration9Str;
exports.highThresholdAlarm9Str = highThresholdAlarm9Str;
exports.hysteresisOfHighThresholdAlarm9Str = hysteresisOfHighThresholdAlarm9Str;
exports.lowThresholdAlarm9Str = lowThresholdAlarm9Str;
exports.hysteresisOfLowThresholdAlarm9Str = hysteresisOfLowThresholdAlarm9Str;
exports.alarmConfiguration10Str = alarmConfiguration10Str;
exports.highThresholdAlarm10Str = highThresholdAlarm10Str;
exports.hysteresisOfHighThresholdAlarm10Str = hysteresisOfHighThresholdAlarm10Str;
exports.lowThresholdAlarm10Str = lowThresholdAlarm10Str;
exports.hysteresisOfLowThresholdAlarm10Str = hysteresisOfLowThresholdAlarm10Str;
exports.rs485Str = rs485Str;
exports.rs232Str = rs232Str;
exports.oneBitStr = oneBitStr;
exports.twoBitsStr = twoBitsStr;
exports.noneStr = noneStr;
exports.evenStr = evenStr;
exports.oddStr = oddStr;
exports._1200Str = _1200Str;
exports._2400Str = _2400Str;
exports._4800Str = _4800Str;
exports._9600Str = _9600Str;
exports._19200Str = _19200Str;
exports._38400Str = _38400Str;
exports._57600Str = _57600Str;
exports._115200Str = _115200Str;
exports.otaaStr = otaaStr;
exports.abpStr = abpStr;
exports.noAlarmStr = noAlarmStr;
exports.highThresholdStr = highThresholdStr;
exports.lowThresholdStr = lowThresholdStr;
exports.highAndLowThresholdsStr = highAndLowThresholdsStr;
exports.holdingStr = holdingStr;
exports.inputStr = inputStr;
exports.parkModeStr = parkModeStr;
exports.productionModeStr = productionModeStr;
exports.testModeStr = testModeStr;
exports.unsignedInteger16Str = unsignedInteger16Str;
exports.signedInteger16Str = signedInteger16Str;
exports.unsignedInteger32Str = unsignedInteger32Str;
exports.signedInteger32Str = signedInteger32Str;
exports.unsignedInteger32WordSwapStr = unsignedInteger32WordSwapStr;
exports.signedInteger32WordSwapStr = signedInteger32WordSwapStr;