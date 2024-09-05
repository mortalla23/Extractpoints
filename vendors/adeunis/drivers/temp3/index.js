
/*

***********************This driver is written according to the documentation of the TEMP_TEMP3_LORAWAN v2.0.0 attached in the specification********************************

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
const PERIODIC_FRAME = 0x57;
const ALARM_FRAME = 0x58;
const REPLY_FRAME_TO_REGISTER_VALUE_REQUEST = 0x31;
const RESPONSE_FRAME_OF_UPDATE_REGISTER = 0x33;
const ALERT_FRAME = 0x36;

//  these variables are needed to encode/decode the downlink
const PRODUCT_CONFIGURATION_REQUEST_FRAME = 0x01;
const NETWORK_CONFIGURATION_REQUEST_FRAME = 0x02;
const REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA = 0x05;
const SPECIFIC_REGISTER_VALUE_REQUEST_FRAME = 0x40;
const FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS = 0x41;

const KEEP_ALIVE_PERIOD = 0x00;
const TRANSMISSION_PERIOD_OF_DATA_SENSORS = 0x01;
const PIN_CODE = 0x04;
const PRODUCT_MODE = 0x06;
const LED_ACTIVITY = 0x08;
const HISTORY_PERIOD = 0x14;
const SAMPLING_PERIOD = 0x15;
const ALARM_REPETITION_PERIOD = 0x16;
const NUMBER_OF_ADDITIONAL_SAMPLES_PER_FRAME = 0x17;
const SENSORS_ACTIVATION = 0x18;
const ALARM_TYPE_SENSOR_1 = 0x1e;
const HIGH_THRESHOLD_VALUE_SENSOR_1 = 0x1f;
const HIGH_THRESHOLD_HYSTERESIS_SENSOR_1 = 0x20;
const LOW_THRESHOLD_VALUE_SENSOR_1 = 0x21;
const LOW_THRESHOLD_HYSTERESIS_SENSOR_1 = 0x22;
const ALARM_TYPE_SENSOR_2 = 0x28;
const HIGH_THRESHOLD_VALUE_SENSOR_2 = 0x29;
const HIGH_THRESHOLD_HYSTERESIS_SENSOR_2 = 0x2a;
const LOW_THRESHOLD_VALUE_SENSOR_2 = 0x2b;
const LOW_THRESHOLD_HYSTERESIS_SENSOR_2 = 0x2c;

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

const uplinkProductConfigType = "PRODUCT_CONFIGURATION_1";
const uplinkNetworkConfigType = "NETWORK_CONFIGURATION";
const uplinkKeepAliveType = "KEEP_ALIVE";
const uplinkPeriodicType = "PERIODIC_DATA";
const uplinkAlarmType = "ALARM";
const uplinkReplyFrameToRegisterValueRequestStr = "REPLY_FRAME_TO_REGISTER_VALUE_REQUEST";
const uplinkRegisterStatusType = "SET_REGISTER_STATUS";
const uplinkAlertType = "ALERT";

const keepAlivePeriodStr = "KEEP_ALIVE_PERIOD";
const transmissionPeriodOfDataSensorsStr = "TRANSMISSION_PERIOD_OF_DATA_SENSORS";
const pinCodeStr = "PIN_CODE";
const productModeStr = "PRODUCT_MODE";
const ledActivityStr = "LED_ACTIVITY";
const historyPeriodStr = "HISTORY_PERIOD";
const samplingPeriodStr = "SAMPLING_PERIOD";
const alarmRepetitionPeriodStr = "ALARM_REPETITION_PERIOD";
const numberOfAdditionalSamplesPerFrameStr = "NUMBER_OF_ADDITIONAL_SAMPLES_PER_FRAME";
const sensorsActivationStr = "SENSORS_ACTIVATION";
const alarmTypeSensor1Str = "ALARM_TYPE_SENSOR_1";
const highThresholdValueSensor1Str = "HIGH_THRESHOLD_VALUE_SENSOR_1";
const highThresholdHysteresisSensor1Str = "HIGH_THRESHOLD_HYSTERESIS_SENSOR_1";
const lowThresholdValueSensor1Str = "LOW_THRESHOLD_VALUE_SENSOR_1";
const lowThresholdHysteresisSensor1Str = "LOW_THRESHOLD_HYSTERESIS_SENSOR_1";
const alarmTypeSensor2Str = "ALARM_TYPE_SENSOR_2";
const highThresholdValueSensor2Str = "HIGH_THRESHOLD_VALUE_SENSOR_2";
const highThresholdHysteresisSensor2Str = "HIGH_THRESHOLD_HYSTERESIS_SENSOR_2";
const lowThresholdValueSensor2Str = "LOW_THRESHOLD_VALUE_SENSOR_2";
const lowThresholdHysteresisSensor2Str = "LOW_THRESHOLD_HYSTERESIS_SENSOR_2";

//  mapping the downlink message in a map with key = id and value = label
let downlinkMessageMap = new Map();
downlinkMessageMap.set(KEEP_ALIVE_PERIOD, keepAlivePeriodStr);
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_DATA_SENSORS, transmissionPeriodOfDataSensorsStr);
downlinkMessageMap.set(PIN_CODE, pinCodeStr);
downlinkMessageMap.set(PRODUCT_MODE, productModeStr);
downlinkMessageMap.set(LED_ACTIVITY, ledActivityStr);
downlinkMessageMap.set(HISTORY_PERIOD, historyPeriodStr);
downlinkMessageMap.set(SAMPLING_PERIOD, samplingPeriodStr);
downlinkMessageMap.set(ALARM_REPETITION_PERIOD, alarmRepetitionPeriodStr);
downlinkMessageMap.set(NUMBER_OF_ADDITIONAL_SAMPLES_PER_FRAME, numberOfAdditionalSamplesPerFrameStr);
downlinkMessageMap.set(SENSORS_ACTIVATION, sensorsActivationStr);
downlinkMessageMap.set(ALARM_TYPE_SENSOR_1, alarmTypeSensor1Str);
downlinkMessageMap.set(HIGH_THRESHOLD_VALUE_SENSOR_1, highThresholdValueSensor1Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_SENSOR_1, highThresholdHysteresisSensor1Str);
downlinkMessageMap.set(LOW_THRESHOLD_VALUE_SENSOR_1, lowThresholdValueSensor1Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_SENSOR_1, lowThresholdHysteresisSensor1Str);
downlinkMessageMap.set(ALARM_TYPE_SENSOR_2, alarmTypeSensor2Str);
downlinkMessageMap.set(HIGH_THRESHOLD_VALUE_SENSOR_2, highThresholdValueSensor2Str);
downlinkMessageMap.set(HIGH_THRESHOLD_HYSTERESIS_SENSOR_2, highThresholdHysteresisSensor2Str);
downlinkMessageMap.set(LOW_THRESHOLD_VALUE_SENSOR_2, lowThresholdValueSensor2Str);
downlinkMessageMap.set(LOW_THRESHOLD_HYSTERESIS_SENSOR_2, lowThresholdHysteresisSensor2Str);

const classAStr = "CLASS_A";
const classCStr = "CLASS_C";

const otaaStr = "OTAA";
const abpStr = "ABP";

const noAlarmStr = "NO_ALARM";
const highThresholdStr = "HIGH_THRESHOLD";
const lowThresholdStr = "LOW_THRESHOLD";
const bothThresholdsStr = "BOTH_THRESHOLDS";

const successStr = "SUCCESS";
const errorNoUpdateStr = "ERROR_NO_UPDATE";
const errorCoherenceStr = "ERROR_COHERENCE";
const errorInvalidRegisterStr = "ERROR_INVALID_REGISTER";
const errorInvalidValueStr = "ERROR_INVALID_VALUE";
const errorTruncatedValueStr = "ERROR_TRUNCATED_VALUE";
const errorUnauthorizedAccessStr = "ERROR_UNAUTHORIZED_ACCESS";
const errorDeviceDefectStr = "ERROR_DEVICE_DEFECT";
const errorUnknownStr = "ERROR_UNKNOWN";

const normalStateStr = "NORMAL_STATE";
const uplinkDownlinkForbiddenStr = "UPLINK_DOWNLINK_FORBIDDEN";

const parkModeStr = "PARK";
const runModeStr = "RUN";

const sensor1Str = "SENSOR_1";
const sensor2Str = "SENSOR_2";
const bothSensorsStr = "BOTH";

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

//  if the value represent negative number of 2 bytes, we need to calculate complement
function complement2Byte2(hexToDec) {
    if (hexToDec < 0x8000) return hexToDec;
    else return -((hexToDec - 1) ^ 0xffff);
}

//  convert a boolean to a byte
function booleanToByte(bool) {
    return bool ? 0x01 : 0x00;
}

//  mapping to lorawan class for decoding
function getLorawanClass(value) {
    switch (value) {
        case 0:
            return classAStr;
        case 1:
            return classCStr;
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
        case 3:
            return bothThresholdsStr;
    }
}

//  mapping the request status for 0x33
function getRequestStatus(hex) {
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

//  mapping alert code for decoding
function getAlert(value) {
    switch (value) {
        case 0x00:
            return normalStateStr;
        case 0x01:
            return uplinkDownlinkForbiddenStr;
    }
}

//  mapping product mode for decoding
function getProductMode(value) {
    switch (value) {
        case 0:
            return parkModeStr;
        case 1:
            return runModeStr;
    }
}

//  mapping sensors activation for decoding
function getSensorsActivation(value) {
    switch (value) {
        case 1:
            return sensor1Str;
        case 2:
            return sensor2Str;
        case 3:
            return bothSensorsStr;
    }
}

//  mapping product mode for encoding
function encodeProductMode(value) {
    switch (value) {
        case parkModeStr:
            return 0x00;
        case runModeStr:
            return 0x01;
    }
}

//  mapping sensors activation for encoding
function encodeSensorsActivation(value) {
    switch (value) {
        case sensor1Str:
            return 0x01;
        case sensor2Str:
            return 0x02;
        case bothSensorsStr:
            return 0x03;
    }
}

//  mapping the alarm status for encoding
function encodeAlarmStatus(value) {
    switch (value) {
        case noAlarmStr:
            return 0x00;
        case highThresholdStr:
            return 0x01;
        case lowThresholdStr:
            return 0x02;
        case bothThresholdsStr:
            return 0x03;
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
    result.lowBattery = ((status >> 1) & 0x01) == 1;
    result.hardwareError = ((status >> 2) & 0x01) == 1;
    result.appFlag1 = ((status >> 3) & 0x01) == 1;
    result.appFlag2 = ((status >> 4) & 0x01) == 1;

    switch (code) {
        case PRODUCT_CONFIGURATION:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfigType;
            result.register = {};

            result.register.keepAlivePeriod = hexToDec(payloadHex, 4, 8) * 10;
            result.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, 8, 12);
            result.register.historyPeriod = hexToDec(payloadHex, 12, 16);
            result.register.samplingPeriod = hexToDec(payloadHex, 16, 20) * 2;
            result.register.numberOfAdditionalSamplesPerFrame = hexToDec(payloadHex, 20, 22);
            break;

        case NETWORK_CONFIGURATION:
            if (nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkNetworkConfigType;
            result.register = {};

            const option = hexToDec(payloadHex, 4, 6);
            result.register.loraWanOption = {};
            result.register.loraWanOption.adaptiveDataRate = (option & 0x01) == 1;
            result.register.loraWanOption.dutyCycle = ((option >> 2) & 0x01) == 1;
            result.register.loraWanOption.type = getLorawanClass((option >> 5) & 0x01);
            result.register.mode = getConnectionMode(hexToDec(payloadHex, 6, 8));
            break;

        case KEEP_ALIVE:
            if (result.appFlag2 == true && nbBytes != 6) {
                throw new Error(uplinkLengthError);
            } else if (result.appFlag2 == false && nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkKeepAliveType;
            result.register = {};

            if (result.appFlag2 == true) {
                result.register.valueReadOnTheChannel1 = complement2Byte2(hexToDec(payloadHex, 4, 8)) / 10;
                result.register.valueReadOnTheChannel2 = complement2Byte2(hexToDec(payloadHex, 8, 12)) / 10;
            } else {
                result.register.valueReadOnTheChannel1 = complement2Byte2(hexToDec(payloadHex, 4, 8)) / 10;
            }
            break;

        case REPLY_FRAME_TO_REGISTER_VALUE_REQUEST:
            result.type = uplinkReplyFrameToRegisterValueRequestStr;
            break;

        case PERIODIC_FRAME:
            result.type = uplinkPeriodicType;
            result.register = {};

            if (result.appFlag2 == true) {
                result.register.temperatureMeasures = [];
                for (var i = 4; i < payloadHex.length; i += 8) {
                    let readings = {};
                    let offset = (i - 4) / 8;
                    readings.offset = 0 - offset;
                    readings.sensor1Value = complement2Byte2(hexToDec(payloadHex, i, i + 4)) / 10;
                    readings.sensor2Value = complement2Byte2(hexToDec(payloadHex, i + 4, i + 8)) / 10;
                    result.register.temperatureMeasures.push(readings);
                }
                break;
            } else {
                result.register.temperatureMeasures = [];
                for (var i = 4; i < payloadHex.length; i += 4) {
                    let readings = {};
                    let offset = (i - 4) / 4;
                    readings.offset = 0 - offset;
                    readings.sensor1Value = complement2Byte2(hexToDec(payloadHex, i, i + 4)) / 10;
                    result.register.temperatureMeasures.push(readings);
                }
                break;
            }

        case ALARM_FRAME:
            if (result.appFlag2 == true && nbBytes != 8) {
                throw new Error(uplinkLengthError);
            } else if (result.appFlag2 == false && nbBytes != 5) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkAlarmType;
            result.register = {};

            if (result.appFlag2 == true) {
                result.register.alarmStatus1 = getAlarmStatus(hexToDec(payloadHex, 4, 6));
                result.register.valueReadOnTheChannel1 = complement2Byte2(hexToDec(payloadHex, 6, 10)) / 10;
                result.register.alarmStatus2 = getAlarmStatus(hexToDec(payloadHex, 10, 12));
                result.register.valueReadOnTheChannel2 = complement2Byte2(hexToDec(payloadHex, 12, 16)) / 10;
            } else {
                result.register.alarmStatus1 = getAlarmStatus(hexToDec(payloadHex, 4, 6));
                result.register.temperatureSensor1 = complement2Byte2(hexToDec(payloadHex, 6, 10)) / 10;
            }
            break;

        case RESPONSE_FRAME_OF_UPDATE_REGISTER:
            if (nbBytes != 5 && nbBytes != 3) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkRegisterStatusType;
            result.register = {};

            result.register.requestStatus = getRequestStatus(hexToDec(payloadHex, 4, 6));
            if (result.register.requestStatus != successStr) {
                result.register.registerId = hexToDec(payloadHex, 6, 10);
            }
            break;

        case ALERT_FRAME:
            if (nbBytes != 3) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkAlertType;
            result.register = {};
            result.register.alert = getAlert(hexToDec(payloadHex, 4, 6));
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
    const type = hexToDec(payloadHex, 0, 2);

    switch (type) {
        case PRODUCT_CONFIGURATION_REQUEST_FRAME:
            result.type = "PRODUCT_CONFIGURATION_REQUEST_FRAME";
            break;

        case NETWORK_CONFIGURATION_REQUEST_FRAME:
            result.type = "NETWORK_CONFIGURATION_REQUEST_FRAME";
            break;

        case REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA:
            result.type = "REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA";
            break;

        case SPECIFIC_REGISTER_VALUE_REQUEST_FRAME:
            result.type = "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME";
            result.payload = {};
            result.payload.type = "Temp3SpecificRegisterValueRequestFrame";
            result.payload.message = [];
            for (let i = 2; i < payloadHex.length; i += 2) {
                result.payload.message.push(downlinkMessageMap.get(hexToDec(payloadHex, i, i + 2)));
            }
            break;

        case FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS:
            result.type = "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS";
            result.payload = {};
            result.payload.type = "Temp3FrameForUpdatingTheValueOfSpecificRegisters";
            result.payload.register = {};
            let pos = 2;
            while (pos < payloadHex.length) {
                const confId = hexToDec(payloadHex, pos, pos + 2);
                pos += 2;
                switch (confId) {
                    case KEEP_ALIVE_PERIOD:
                        result.payload.register.keepAlivePeriod = hexToDec(payloadHex, pos, pos + 4) * 10;
                        pos += 4;
                        break;

                    case TRANSMISSION_PERIOD_OF_DATA_SENSORS:
                        result.payload.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case PIN_CODE:
                        result.payload.register.pinCode = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case PRODUCT_MODE:
                        result.payload.register.productMode = getProductMode(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case LED_ACTIVITY:
                        let ledAct = payloadHex.slice(pos, pos + 8);
                        ledAct = ledAct.replace(/^0+/, '');
                        result.payload.register.ledActivity = ledAct;
                        pos += 8;
                        break;

                    case HISTORY_PERIOD:
                        result.payload.register.historyPeriod = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case SAMPLING_PERIOD:
                        result.payload.register.samplingPeriod = hexToDec(payloadHex, pos, pos + 4) * 2;
                        pos += 4;
                        break;

                    case ALARM_REPETITION_PERIOD:
                        result.payload.register.alarmRepetitionPeriod = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case NUMBER_OF_ADDITIONAL_SAMPLES_PER_FRAME:
                        result.payload.register.numberOfAdditionalSamplesPerFrame = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case SENSORS_ACTIVATION:
                        result.payload.register.sensorsActivation = getSensorsActivation(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case ALARM_TYPE_SENSOR_1:
                        result.payload.register.alarmTypeSensor1 = getAlarmStatus(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case HIGH_THRESHOLD_VALUE_SENSOR_1:
                        result.payload.register.highThresholdValueSensor1 = complement2Byte2(hexToDec(payloadHex, pos, pos + 4)) / 10;
                        pos += 4;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_SENSOR_1:
                        result.payload.register.highThresholdHysteresisSensor1 = hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case LOW_THRESHOLD_VALUE_SENSOR_1:
                        result.payload.register.lowThresholdValueSensor1 = complement2Byte2(hexToDec(payloadHex, pos, pos + 4)) / 10;
                        pos += 4;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_SENSOR_1:
                        result.payload.register.lowThresholdHysteresisSensor1 = hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case ALARM_TYPE_SENSOR_2:
                        result.payload.register.alarmTypeSensor2 = getAlarmStatus(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case HIGH_THRESHOLD_VALUE_SENSOR_2:
                        result.payload.register.highThresholdValueSensor2 = complement2Byte2(hexToDec(payloadHex, pos, pos + 4)) / 10;
                        pos += 4;
                        break;

                    case HIGH_THRESHOLD_HYSTERESIS_SENSOR_2:
                        result.payload.register.highThresholdHysteresisSensor2 = hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case LOW_THRESHOLD_VALUE_SENSOR_2:
                        result.payload.register.lowThresholdValueSensor2 = complement2Byte2(hexToDec(payloadHex, pos, pos + 4)) / 10;
                        pos += 4;
                        break;

                    case LOW_THRESHOLD_HYSTERESIS_SENSOR_2:
                        result.payload.register.lowThresholdHysteresisSensor2 = hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
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

        case "REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA":
            if (input.register == null) {
                bytes = [REQUEST_FRAME_FOR_READING_A_PIECE_OF_DATA];
            }
            break;

        case "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME":
            bytes.push(SPECIFIC_REGISTER_VALUE_REQUEST_FRAME);
            var payloadArray = [];
            if (input.payload != null) {
                if (input.payload.message != null){
                    payloadArray = input.payload.message;

                    for (var i = 0; i < payloadArray.length; i++) {
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

            if (payload.keepAlivePeriod != null) {
                bytes.push(KEEP_ALIVE_PERIOD);
                const toPush = decToBytes(payload.keepAlivePeriod / 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.transmissionPeriodOfDataSensors != null) {
                bytes.push(TRANSMISSION_PERIOD_OF_DATA_SENSORS);
                const toPush = decToBytes(payload.transmissionPeriodOfDataSensors);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
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

            if (payload.productMode != null) {
                bytes.push(PRODUCT_MODE);
                const toPush = encodeProductMode(payload.productMode);
                bytes.push(toPush);
            }

            if (payload.ledActivity != null) {
                bytes.push(LED_ACTIVITY);
                const toPush = hexToBytes(payload.ledActivity);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.unshift(toPush);
            }

            if (payload.historyPeriod != null) {
                bytes.push(HISTORY_PERIOD);
                const toPush = decToBytes(payload.historyPeriod);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.samplingPeriod != null) {
                bytes.push(SAMPLING_PERIOD);
                const toPush = decToBytes(payload.samplingPeriod / 2);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.alarmRepetitionPeriod != null) {
                bytes.push(ALARM_REPETITION_PERIOD);
                const toPush = decToBytes(payload.alarmRepetitionPeriod);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.numberOfAdditionalSamplesPerFrame != null) {
                bytes.push(NUMBER_OF_ADDITIONAL_SAMPLES_PER_FRAME);
                const toPush = decToBytes(payload.numberOfAdditionalSamplesPerFrame);
                bytes.push(toPush);
            }

            if (payload.sensorsActivation != null) {
                bytes.push(SENSORS_ACTIVATION);
                const toPush = encodeSensorsActivation(payload.sensorsActivation);
                bytes.push(toPush);
            }

            if (payload.alarmTypeSensor1 != null) {
                bytes.push(ALARM_TYPE_SENSOR_1);
                const toPush = encodeAlarmStatus(payload.alarmTypeSensor1);
                bytes.push(toPush);
            }

            if (payload.highThresholdValueSensor1 != null) {
                bytes.push(HIGH_THRESHOLD_VALUE_SENSOR_1);
                const toPush = decToBytes(payload.highThresholdValueSensor1 * 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisSensor1 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_SENSOR_1);
                const toPush = decToBytes(payload.highThresholdHysteresisSensor1 * 10);
                bytes.push(toPush);
            }

            if (payload.lowThresholdValueSensor1 != null) {
                bytes.push(LOW_THRESHOLD_VALUE_SENSOR_1);
                const toPush = decToBytes(payload.lowThresholdValueSensor1 * 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisSensor1 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_SENSOR_1);
                const toPush = decToBytes(payload.lowThresholdHysteresisSensor1 * 10);
                bytes.push(toPush);
            }

            if (payload.alarmTypeSensor2 != null) {
                bytes.push(ALARM_TYPE_SENSOR_2);
                const toPush = encodeAlarmStatus(payload.alarmTypeSensor2);
                bytes.push(toPush);
            }

            if (payload.highThresholdValueSensor2 != null) {
                bytes.push(HIGH_THRESHOLD_VALUE_SENSOR_2);
                const toPush = decToBytes(payload.highThresholdValueSensor2 * 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.highThresholdHysteresisSensor2 != null) {
                bytes.push(HIGH_THRESHOLD_HYSTERESIS_SENSOR_2);
                const toPush = decToBytes(payload.highThresholdHysteresisSensor2 * 10);
                bytes.push(toPush);
            }

            if (payload.lowThresholdValueSensor2 != null) {
                bytes.push(LOW_THRESHOLD_VALUE_SENSOR_2);
                const toPush = decToBytes(payload.lowThresholdValueSensor2 * 10);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }

            if (payload.lowThresholdHysteresisSensor2 != null) {
                bytes.push(LOW_THRESHOLD_HYSTERESIS_SENSOR_2);
                const toPush = decToBytes(payload.lowThresholdHysteresisSensor2 * 10);
                bytes.push(toPush);
            }

            break;

        default:
            throw new Error(downlinkRegisterIdError);
    }

    //  avoid having an array inside another
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
