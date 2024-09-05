/*
............................................................................................................................
 this part is needed to map the bytes needed in uplink and downlink to some variables names
............................................................................................................................
*/

//  these variables are needed to decode the uplink
const LEARNING_MPU = 76;
const LEARNING_KX = 108;
const REPORT_MPU = 82;
const REPORT_KX = 114;
const ALARM_MPU = 65;
const ALARM_KX = 97;
const STATE_KX = 115;
const STATE_MPU = 83;

const SENSOR_START = 100;
const SENSOR_STOP = 101;
const MACHINE_STOP = 125;
const MACHINE_START = 126;

//  these variables are needed to encode/decode the downlink
const RESTART_LEARNING_FROM_0 = 0;
const ADDITIONAL_LEARNING = 1;

const VERY_FAST_MODE = 0;
const FAST_MODE = 1;
const RECOMMENDED_MODE = 2;
const SLOW_MODE = 3;

const ENABLE_STATE_MESSAGE = 0;
const DISABLE_STATE_MESSAGE = 1;

const ANOMALY_SUP_TO_10_PERCENT = 0;
const ANOMALY_SUP_TO_15_PERCENT = 1;
const ANOMALY_SUP_TO_20_PERCENT = 2;
const ANOMALY_SUP_TO_25_PERCENT = 3;

const RENEW_LEARNING_PHASE_DL0 = 0x00;
const RENEW_LEARNING_PHASE_DL1 = 0x01;
const CHANGE_MEASUREMENT_PERIOD_DL2 = 0x02;
const CHANGE_MEASUREMENT_PERIOD_DL3 = 0x03;
const CHANGE_MEASUREMENT_PERIOD_DL4 = 0x04;
const CHANGE_MEASUREMENT_PERIOD_DL5 = 0x05;
const STATE_MESSAGE_DL6 = 0x06;
const STATE_MESSAGE_DL7 = 0x07;
const ALARM_MESSAGE_THRESHOLD_DL8 = 0x08;
const ALARM_MESSAGE_THRESHOLD_DL9 = 0x09;
const ALARM_MESSAGE_THRESHOLD_DL10 = 0x0a;
const ALARM_MESSAGE_THRESHOLD_DL11 = 0x0b;

/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/

const uplinkEmptyError = "invalid uplink payload: no data received";
const extractPointsEmptyError = "invalid extractPoints input: no data received";
const downlinkEmptyError = "invalid downlink payload: no data received";
const downlinkFrameTypeError = "invalid downlink payload: unknown frame type";
const uplinkLengthError = "invalid uplink payload: wrong length";
const uplinkFrameTypeError = "invalid uplink payload: unknown frame type";
const downlinkLengthError = "invalid downlink payload: wrong length";

const uplinkLearningType = "learning";
const uplinkReportType = "report";
const uplinkAlarmType = "alarm";
const uplinkStateType = "state";

const sensorKXType = "KX";
const sensorMPUType = "MPU";

const additionalLearningStr = "Additional learning";
const learningFrom0Str = "Learning from 0";

const sensorStartStr = "Sensor start";
const sensorStopStr = "Sensor stop";
const machineStartStr = "Machine start";
const machineStopStr = "Machine stop";

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

//  mapping learning from scratch for decoding
function getLearningFromScratch(value) {
    switch (value) {
        case ADDITIONAL_LEARNING:
            return additionalLearningStr;
        case RESTART_LEARNING_FROM_0:
            return learningFrom0Str;
    }
}

//  mapping sensor state for decoding
function getSensorState(value) {
    switch (value) {
        case SENSOR_START:
            return sensorStartStr;
        case SENSOR_STOP:
            return sensorStopStr;
        case MACHINE_START:
            return machineStartStr;
        case MACHINE_STOP:
            return machineStopStr;
    }
}

/*
............................................................................................................................
 this part is is used to avoid re-using the same code for several frames
............................................................................................................................
*/

//  read the values of learning frame uplink
function readLearningFrame(payloadHex, result) {
    result.type = uplinkLearningType;
    result.percentage = hexToDec(payloadHex, 2, 4);
    const vl1 = hexToDec(payloadHex, 4, 6);
    const vl2 = hexToDec(payloadHex, 6, 8);
    const vl3 = hexToDec(payloadHex, 8, 10);
    result.vibrationLevel = (vl1 * 128 + vl2 + vl3 / 100) / 10 / 121.45;
    result.peakFrequencyIndex = hexToDec(payloadHex, 10, 12) + 1;
    if (result.sensor === sensorKXType) {
        result.peakFrequency = (result.peakFrequencyIndex * 800) / 256;
    } else if (result.sensor === sensorMPUType) {
        result.peakFrequency = (result.peakFrequencyIndex * 100) / 256;
    }
    result.temperature = hexToDec(payloadHex, 12, 14) - 30;
    result.learningFromScratch = getLearningFromScratch(hexToDec(payloadHex, 14, 16));
    result.fft = [];
    for (let i = 16; i < payloadHex.length; i += 2) {
        result.fft.push((hexToDec(payloadHex, i, i + 2) * result.vibrationLevel) / 127);
    }
}

//  read the values of report frame uplink
function readReportFrame(payloadHex, result) {
    result.type = uplinkReportType;
    result.anomalyLevel = (hexToDec(payloadHex, 2, 4) * 100) / 127;
    result.operatingRate = (hexToDec(payloadHex, 4, 6) * 100) / 127;
    result.operatingTime = (hexToDec(payloadHex, 6, 8) * 100) / 127;
    result.numberOfAlarms = hexToDec(payloadHex, 8, 10);
    result.temperature = hexToDec(payloadHex, 10, 12) - 30;
    const rv = hexToDec(payloadHex, 12, 14);
    if (rv <= 59) {
        result.reportPeriod = rv;
    } else {
        result.reportPeriod = (rv - 59) * 60;
    }
    result.reportId = hexToDec(payloadHex, 14, 16);
    const vl1 = hexToDec(payloadHex, 16, 18);
    const vl2 = hexToDec(payloadHex, 18, 20);
    const vl3 = hexToDec(payloadHex, 20, 22);
    result.vibrationLevel = (vl1 * 128 + vl2 + vl3 / 100) / 10 / 121.45;
    result.peakFrequencyIndex = hexToDec(payloadHex, 22, 24) + 1;
    if (result.sensor === sensorKXType) {
        result.peakFrequency = (result.peakFrequencyIndex * 800) / 256;
    } else if (result.sensor === sensorMPUType) {
        result.peakFrequency = (result.peakFrequencyIndex * 100) / 256;
    }
    result.operatingTime1020 = (hexToDec(payloadHex, 24, 26) * 100) / 127;
    result.operatingTime2040 = (hexToDec(payloadHex, 26, 28) * 100) / 127;
    result.operatingTime4060 = (hexToDec(payloadHex, 28, 30) * 100) / 127;
    result.operatingTime6080 = (hexToDec(payloadHex, 30, 32) * 100) / 127;
    result.operatingTime80100 = (hexToDec(payloadHex, 32, 34) * 100) / 127;
    result.batteryPercentage = (hexToDec(payloadHex, 34, 36) * 100) / 127;
    result.anomalyLevelTo20last24h = hexToDec(payloadHex, 36, 38);
    result.anomalyLevelTo50last24h = hexToDec(payloadHex, 38, 40);
    result.anomalyLevelTo80last24h = hexToDec(payloadHex, 40, 42);
    result.anomalyLevelTo20last30d = hexToDec(payloadHex, 42, 44);
    result.anomalyLevelTo50last30d = hexToDec(payloadHex, 44, 46);
    result.anomalyLevelTo80last30d = hexToDec(payloadHex, 46, 48);
    result.anomalyLevelTo20last6mo = hexToDec(payloadHex, 48, 50);
    result.anomalyLevelTo50last6mo = hexToDec(payloadHex, 50, 52);
    result.anomalyLevelTo80last6mo = hexToDec(payloadHex, 52, 54);
}

//  read the values of alarm frame uplink
function readAlarmFrame(payloadHex, result) {
    result.type = uplinkAlarmType;
    result.anomalyLevel = hexToDec(payloadHex, 2, 4);
    result.temperature = hexToDec(payloadHex, 4, 6) - 30;
    const vl1 = hexToDec(payloadHex, 8, 10);
    const vl2 = hexToDec(payloadHex, 10, 12);
    const vl3 = hexToDec(payloadHex, 12, 14);
    result.vibrationLevel = (vl1 * 128 + vl2 + vl3 / 100) / 10 / 121.45;
    result.fft = [];
    for (let i = 16; i < payloadHex.length; i += 2) {
        result.fft.push((hexToDec(payloadHex, i, i + 2) * result.vibrationLevel) / 127);
    }
}

//  read the values of state frame uplink
function readStateFrame(payloadHex, result) {
    result.type = uplinkStateType;
    result.sensorState = getSensorState(hexToDec(payloadHex, 2, 4));
    result.batteryPercentage = (hexToDec(payloadHex, 4, 6) * 100) / 127;
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

    const id = hexToDec(payloadHex, 0, 2);

    switch (id) {
        case LEARNING_KX:
            if (nbBytes != 40) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorKXType;
            readLearningFrame(payloadHex, result);
            break;

        case LEARNING_MPU:
            if (nbBytes != 40) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorMPUType;
            readLearningFrame(payloadHex, result);
            break;

        case REPORT_KX:
            if (nbBytes != 27) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorKXType;
            readReportFrame(payloadHex, result);
            break;

        case REPORT_MPU:
            if (nbBytes != 27) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorMPUType;
            readReportFrame(payloadHex, result);
            break;

        case ALARM_KX:
            if (nbBytes != 40) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorKXType;
            readAlarmFrame(payloadHex, result);
            break;

        case ALARM_MPU:
            if (nbBytes != 40) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorMPUType;
            readAlarmFrame(payloadHex, result);
            break;

        case STATE_KX:
            if (nbBytes != 3) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorKXType;
            readStateFrame(payloadHex, result);
            break;

        case STATE_MPU:
            if (nbBytes != 3) {
                throw new Error(uplinkLengthError);
            }
            result.sensor = sensorMPUType;
            readStateFrame(payloadHex, result);
            break;

        default:
            throw new Error(uplinkFrameTypeError);
    }

    return result;
}

//  this function used by the driver to decode the downlink and return an object decoded
function decodeDownlink(input) {
    let result = {};
    let payloadHex;

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

    if (nbBytes != 1) {
        throw new Error(downlinkLengthError);
    }

    const readByte = hexToDec(payloadHex, 0, 2);

    switch (readByte) {
        case RENEW_LEARNING_PHASE_DL0:
            result.renewLearningPhase = RESTART_LEARNING_FROM_0;
            break;

        case RENEW_LEARNING_PHASE_DL1:
            result.renewLearningPhase = ADDITIONAL_LEARNING;
            break;

        case CHANGE_MEASUREMENT_PERIOD_DL2:
            result.changeMeasurementPeriod = VERY_FAST_MODE;
            break;

        case CHANGE_MEASUREMENT_PERIOD_DL3:
            result.changeMeasurementPeriod = FAST_MODE;
            break;

        case CHANGE_MEASUREMENT_PERIOD_DL4:
            result.changeMeasurementPeriod = RECOMMENDED_MODE;
            break;

        case CHANGE_MEASUREMENT_PERIOD_DL5:
            result.changeMeasurementPeriod = SLOW_MODE;
            break;

        case STATE_MESSAGE_DL6:
            result.stateMessage = ENABLE_STATE_MESSAGE;
            break;

        case STATE_MESSAGE_DL7:
            result.stateMessage = DISABLE_STATE_MESSAGE;
            break;

        case ALARM_MESSAGE_THRESHOLD_DL8:
            result.alarmMessageThreshold = ANOMALY_SUP_TO_10_PERCENT;
            break;

        case ALARM_MESSAGE_THRESHOLD_DL9:
            result.alarmMessageThreshold = ANOMALY_SUP_TO_15_PERCENT;
            break;

        case ALARM_MESSAGE_THRESHOLD_DL10:
            result.alarmMessageThreshold = ANOMALY_SUP_TO_20_PERCENT;
            break;

        case ALARM_MESSAGE_THRESHOLD_DL11:
            result.alarmMessageThreshold = ANOMALY_SUP_TO_25_PERCENT;
            break;

        default:
            throw new Error(downlinkFrameTypeError);
    }

    return result;
}

//  this function used by the driver to encode the downlink and return an object contains:
//  * bytes: array of numbers as it will be sent to the device.

function encodeDownlink(input) {
    let result = {};
    let bytes = [];

    if (input == null) {
        throw new Error(downlinkEmptyError);
    }

    if (input.renewLearningPhase != null) {
        switch (input.renewLearningPhase) {
            case RESTART_LEARNING_FROM_0:
                bytes.push(RENEW_LEARNING_PHASE_DL0);
                break;
            case ADDITIONAL_LEARNING:
                bytes.push(RENEW_LEARNING_PHASE_DL1);
                break;
        }
    }

    if (input.changeMeasurementPeriod != null) {
        switch (input.changeMeasurementPeriod) {
            case VERY_FAST_MODE:
                bytes.push(CHANGE_MEASUREMENT_PERIOD_DL2);
                break;
            case FAST_MODE:
                bytes.push(CHANGE_MEASUREMENT_PERIOD_DL3);
                break;
            case RECOMMENDED_MODE:
                bytes.push(CHANGE_MEASUREMENT_PERIOD_DL4);
                break;
            case SLOW_MODE:
                bytes.push(CHANGE_MEASUREMENT_PERIOD_DL5);
                break;
        }
    }

    if (input.stateMessage != null) {
        switch (input.stateMessage) {
            case ENABLE_STATE_MESSAGE:
                bytes.push(STATE_MESSAGE_DL6);
                break;
            case DISABLE_STATE_MESSAGE:
                bytes.push(STATE_MESSAGE_DL7);
                break;
        }
    }

    if (input.alarmMessageThreshold != null) {
        switch (input.alarmMessageThreshold) {
            case ANOMALY_SUP_TO_10_PERCENT:
                bytes.push(ALARM_MESSAGE_THRESHOLD_DL8);
                break;
            case ANOMALY_SUP_TO_15_PERCENT:
                bytes.push(ALARM_MESSAGE_THRESHOLD_DL9);
                break;
            case ANOMALY_SUP_TO_20_PERCENT:
                bytes.push(ALARM_MESSAGE_THRESHOLD_DL10);
                break;
            case ANOMALY_SUP_TO_25_PERCENT:
                bytes.push(ALARM_MESSAGE_THRESHOLD_DL11);
                break;
        }
    }

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
