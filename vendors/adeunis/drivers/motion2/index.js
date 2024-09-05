/*

***********************This driver is written according to the documentation of the MOTION_V2_LORAWAN v2.0.0 attached in the specification********************************

*/

/*
............................................................................................................................
 this part is needed to map the bytes needed in uplink and downlink to some variables names
............................................................................................................................
*/

//  these variables are needed to decode the uplink
const INFORMATION_FRAME_ON_DEVICE_CONFIG = 0x10;
const INFORMATION_FRAME_ON_CONFIG_DIGITAL_INPUTS = 0x1f;
const INFORMATION_FRAME_ON_NETWORK_CONFIG = 0x20;
const KEEP_ALIVE_FRAME = 0x30;
const PERIODIC_DATA_FRAME = 0x5c;
const PRESENCE_ALARM_FRAME = 0x5d;
const LUMINOSIY_ALARM_FRAME = 0x50;
const DIGITAL_INPUT_1_ALARM_FRAME = 0x51;
const DIGITAL_INPUT_2_ALARM_FRAME = 0x52;
const REGISTER_VALUE_RESPONSE = 0x31;
const RESPONSE_FRAME_OF_UPDATE_REGISTER = 0x33;

//  these variables are needed to encode/decode the downlink
const PRODUCT_CONFIGURATION_REQUEST_FRAME = 0x01;
const NETWORK_CONFIGURATION_REQUEST_FRAME = 0x02;
const SPECIFIC_REGISTER_VALUE_REQUEST_FRAME = 0x40;
const FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS = 0x41;

const TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME = 0x00;
const NUMBER_OF_BACKUPS = 0x01;
const ACKNOWLEDGMENT_OF_THE_UPLINK_FRAMES = 0x03;
const PIN_CODE = 0x04;
const OPERATING_MODE = 0x06;
const LED_ACTIVITY = 0x08;
const NUMBER_OF_READINGS_BEFORE_SAVING_IN_THE_HISTORY_LOGS = 0x14;
const PERIOD_OF_ACQUISITION = 0x15;
const INHIBITION_TIME_OF_THE_PRESENCE_DETECTOR = 0x16;
const PRESENCE_SENSOR = 0x17;
const BRIGHTNESS_THRESHOLD_DAY_AND_NIGHT = 0x18;
const HYSTERESIS_DAY_AND_NIGHT_THRESHOLD = 0x19;
const PRESENCE_ALARM_THRESHOLD = 0x1e;
const PRESENCE_ALARM = 0x1f;
const PRESENCE_DETECTION_EVENT_COUNTER = 0x5c;
const TYPE_OF_ALARM_FOR_BRIGHTNESS_RATE = 0x28;
const HIGH_THRESHOLD_OF_THE_BRIGHTNESS_ALARM = 0x29;
const HIGH_HYSTERESIS_BRIGHTNESS = 0x2a;
const LOW_THRESHOLD_OF_THE_BRIGHTNESS_ALARM = 0x2b;
const LOW_HYSTERESIS_BRIGHTNESS = 0x2c;
const CONFIGURATION_OF_THE_BUTTON_INPUT1 = 0x50;
const BUTTON_ALARM_THRESHOLD_INPUT1 = 0x51;
const CONFIGURATION_OF_THE_TERMINAL_BLOCK_INPUT2 = 0x52;
const TERMINAL_ALARM_THRESHOLD_INPUT2 = 0x53;
const EVENT_COUNTER_FOR_THE_BUTTON_INPUT1 = 0x5a;
const EVENT_COUNTER_FOR_THE_BUTTON_INPUT2 = 0x5b;

/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/
const uplinkEmptyError = "invalid uplink payload: no data received";
const downlinkEmptyError = "invalid downlink payload: no data received";
const uplinkLengthError = "invalid uplink payload: wrong length";
const uplinkFrameTypeError = "invalid uplink payload: unknown frame type";
const digitalPointTypeError = "invalid uplink payload: unknown digital point type";
const activationModeError = "invalid uplink payload: unknown lora activation mode";
const digitalInputStateError = "invalid uplink payload: unknown digital input state";
const downlinkFrameTypeError = "invalid downlink payload: unknown frame type";
const downlinkRegisterIdError = "invalid downlink payload: unknown register id";

const uplinkMotionConfigType = "DEVICE_CONFIGURATION";
const uplinkDigitalInputConfigType = "DIGITAL_INPUT_CONFIGURATION";
const uplinkNetworkConfigType = "NETWORK_CONFIGURATION";
const uplinkKeepAliveType = "KEEP_ALIVE";
const uplinkRegisterValueResponseStr = "REGISTER_VALUE_RESPONSE";
const uplinkRegisterStatusType = "UPDATE_REGISTER_RESPONSE";
const upLinkPeriodicDataType = "PRESENCE_AND_LUMINOSITY_READINGS";
const uplinkPresenceAlarmType = "PRESENCE_ALARM";
const uplinkLuminosityAlarmType = "LUMINOSITY_ALARM";
const uplinkDigitalInput1AlarmType = "BUTTON_ALARM_INPUT";
const uplinkDigitalInput2AlarmType = "BUTTON_ALARM_INPUT_2";

const offStr = "OFF";
const eventOffStr = "EVENT_OFF";
const eventOnStr = "EVENT_ON";
const eventOnOffStr = "EVENT_ON_OFF";

const noDebounceTimeStr = "NO_DEBOUNCE_TME";
const tenMsStr = "TEN_MS";
const twentyMsStr = "TWENTY_MS";
const fiftyMsStr = "FIFTY_MS";
const oneHundredMsStr = "ONE_HUNDRED_MS";
const twoHundredsMsStr = "TWO_HUNDREDS_MS";
const fiveHundredsMsStr = "FIVE_HUNDREDS_MS";
const oneThousandMsStr = "ONE_THOUSAND_MS";
const twoThousandsMsStr = "TWO_THOUSANDS_MS";
const fiveThousandsMsStr = "FIVE_THOUSANDS_MS";
const tenThousandsMsStr = "TEN_THOUSANDS_MS";
const twentyThousandsMsStr = "TWENTY_THOUSANDS_MS";
const fortyThousandsMsStr = "FORTY_THOUSANDS_MS";
const sixtyThousandsMsStr = "SIXTY_THOUSANDS_MS";
const threeHundredThousandMsStr = "THREE_HUNDREDS_THOUSAND_MS";
const sixHundredThousandMsStr = "SIX_HUNDRED_THOUSAND_MS";

const abpStr = "ABP";
const otaaStr = "OTAA";

const disabledStr = "DISABLED";
const enabledAtNightStr = "ENABLED_AT_NIGHT";
const enabledInTheDayStr = "ENABLED_IN_THE_DAY";
const alwaysEnabledStr = "ALWAYS_ENABLED";

const parkModeStr = "PARK_MODE";
const productionModeStr = "PRODUCTION_MODE";
const unknownModeStr = "UNKNOWN_MODE";
const repliModeStr = "REPLI_MODE";

const alarmOffStr = "OFF";
const alarmLowThresholdStr = "LOW_THRESHOLD";
const alarmHighThresholdStr = "HIGH_THRESHOLD";
const alarmLowAndHighThresholdStr = "LOW_AND_HIGH_THRESHOLDS";

const successStr = "SUCCESS";
const errorNoUpdateStr = "ERROR_NO_UPDATE";
const errorCoherenceStr = "ERROR_COHERENCE";
const errorInvalidRegisterStr = "ERROR_INVALID_REGISTER";
const errorInvalidValueStr = "ERROR_INVALID_VALUE";
const errorTruncatedValueStr = "ERROR_TRUNCATED_VALUE";
const errorUnauthorizedAccessStr = "ERROR_UNAUTHORIZED_ACCESS";
const errorDeviceDefectStr = "ERROR_DEVICE_DEFECT";
const errorUnknownStr = "ERROR_UNKNOWN";

const transmissionPeriodOfTheKeepAliveFrameStr = "TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME";
const numberOfBackupsStr = "NUMBER_OF_BACKUPS";
const acknowledgmentOfTheUplinkFramesStr = "ACKNOWLEDGMENT_OF_THE_UPLINK_FRAMES";
const pinCodeStr = "PIN_CODE";
const operatingModeStr = "OPERATING_MODE";
const ledActivityStr = "LED_ACTIVITY";
const numberOfReadingsBeforeSavingInTheHistoryLogsStr = "NUMBER_OF_READINGS_BEFORE_SAVING_IN_THE_HISTORY_LOGS";
const periodOfAcquisitionStr = "PERIOD_OF_ACQUISITION";
const inhibitionTimeOfThePresenceDetectorStr = "INHIBITION_TIME_OF_THE_PRESENCE_DETECTOR";
const presenceSensorStr = "PRESENCE_SENSOR";
const brightnessThresholdDayAndNightStr = "BRIGHTNESS_THRESHOLD_DAY_AND_NIGHT";
const hysteresisDayAndNightThresholdStr = "HYSTERESIS_DAY_AND_NIGHT_THRESHOLD";
const presenceAlarmThresholdStr = "PRESENCE_ALARM_THRESHOLD";
const presenceAlarmStr = "PRESENCE_ALARM";
const typeOfAlarmForBrightnessRateStr = "TYPE_OF_ALARM_FOR_BRIGHTNESS_RATE";
const highThresholdOfTheBrightnessAlarmStr = "HIGH_THRESHOLD_OF_THE_BRIGHTNESS_ALARM";
const highHysteresisBrightnessStr = "HIGH_HYSTERESIS_BRIGHTNESS";
const lowThresholdOfTheBrightnessAlarmStr = "LOW_THRESHOLD_OF_THE_BRIGHTNESS_ALARM";
const lowHysteresisBrightnessStr = "LOW_HYSTERESIS_BRIGHTNESS";
const configurationOfTheButtonInput1Str = "CONFIGURATION_OF_THE_BUTTON_INPUT1";
const buttonAlarmThresholdInput1Str = "BUTTON_ALARM_THRESHOLD_INPUT1";
const configurationOfTheTerminalBlockInput2Str = "CONFIGURATION_OF_THE_TERMINAL_BLOCK_INPUT2";
const terminalAlarmThresholdInput2Str = "TERMINAL_ALARM_THRESHOLD_INPUT2";
const eventCounterForTheButtonInput1Str = "EVENT_COUNTER_FOR_THE_BUTTON_INPUT1";
const eventCounterForTheButtonInput2Str = "EVENT_COUNTER_FOR_THE_BUTTON_INPUT2";

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
    for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

//  convert a decimal to bytes array
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

//  convert a boolean to a byte
function booleanToByte(bool) {
    return bool ? 0x01 : 0x00;
}

//  mapping the digital point debouncing time
function getDigitalPointDebouncingTime(config) {
    switch (config) {
        case 0x00:
            return noDebounceTimeStr;
        case 0x01:
            return tenMsStr;
        case 0x02:
            return twentyMsStr;
        case 0x03:
            return fiftyMsStr;
        case 0x04:
            return oneHundredMsStr;
        case 0x05:
            return twoHundredsMsStr;
        case 0x06:
            return fiveHundredsMsStr;
        case 0x07:
            return oneThousandMsStr;
        case 0x08:
            return twoThousandsMsStr;
        case 0x09:
            return fiveThousandsMsStr;
        case 0x0a:
            return tenThousandsMsStr;
        case 0x0b:
            return twentyThousandsMsStr;
        case 0x0c:
            return fortyThousandsMsStr;
        case 0x0d:
            return sixtyThousandsMsStr;
        case 0x0e:
            return threeHundredThousandMsStr;
        case 0x0f:
            return sixHundredThousandMsStr;
    }
}

//  mapping the digital input type
function getDigitalPointType(config) {
    switch (config) {
        case 0:
            return offStr;
        case 1:
            return eventOnStr;
        case 2:
            return eventOffStr;
        case 3:
            return eventOnOffStr;
        default:
            throw new Error(digitalPointTypeError);
    }
}

//  mapping the activation mode of LoRa for HIGH_HYSTERESIS_TEMPERATURE
function getActivationMode(value) {
    switch (value) {
        case 0:
            return abpStr;
        case 1:
            return otaaStr;
        default:
            throw new Error(activationModeError);
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

//  mapping the state of digital Input for BUTTON_ALARM_THRESHOLD_INPUT1 and CONFIGURATION_OF_THE_TERMINAL_BLOCK_INPUT2
function getDigitalInputState(value) {
    switch (value) {
        case 0:
            return openedStr;
        case 1:
            return closedStr;
        default:
            throw new Error(digitalInputStateError);
    }
}

//  mapping the downlink message in a map with key = id and value = label
var downlinkMessageMap = new Map();
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME, transmissionPeriodOfTheKeepAliveFrameStr);
downlinkMessageMap.set(NUMBER_OF_BACKUPS, numberOfBackupsStr);
downlinkMessageMap.set(ACKNOWLEDGMENT_OF_THE_UPLINK_FRAMES, acknowledgmentOfTheUplinkFramesStr);
downlinkMessageMap.set(PIN_CODE, pinCodeStr);
downlinkMessageMap.set(OPERATING_MODE, operatingModeStr);
downlinkMessageMap.set(LED_ACTIVITY, ledActivityStr);
downlinkMessageMap.set(
    NUMBER_OF_READINGS_BEFORE_SAVING_IN_THE_HISTORY_LOGS,
    numberOfReadingsBeforeSavingInTheHistoryLogsStr,
);
downlinkMessageMap.set(PERIOD_OF_ACQUISITION, periodOfAcquisitionStr);
downlinkMessageMap.set(INHIBITION_TIME_OF_THE_PRESENCE_DETECTOR, inhibitionTimeOfThePresenceDetectorStr);
downlinkMessageMap.set(PRESENCE_SENSOR, presenceSensorStr);
downlinkMessageMap.set(BRIGHTNESS_THRESHOLD_DAY_AND_NIGHT, brightnessThresholdDayAndNightStr);
downlinkMessageMap.set(HYSTERESIS_DAY_AND_NIGHT_THRESHOLD, hysteresisDayAndNightThresholdStr);
downlinkMessageMap.set(PRESENCE_ALARM_THRESHOLD, presenceAlarmThresholdStr);
downlinkMessageMap.set(PRESENCE_ALARM, presenceAlarmStr);
downlinkMessageMap.set(TYPE_OF_ALARM_FOR_BRIGHTNESS_RATE, typeOfAlarmForBrightnessRateStr);
downlinkMessageMap.set(HIGH_THRESHOLD_OF_THE_BRIGHTNESS_ALARM, highThresholdOfTheBrightnessAlarmStr);
downlinkMessageMap.set(HIGH_HYSTERESIS_BRIGHTNESS, highHysteresisBrightnessStr);
downlinkMessageMap.set(LOW_THRESHOLD_OF_THE_BRIGHTNESS_ALARM, lowThresholdOfTheBrightnessAlarmStr);
downlinkMessageMap.set(LOW_HYSTERESIS_BRIGHTNESS, lowHysteresisBrightnessStr);
downlinkMessageMap.set(CONFIGURATION_OF_THE_BUTTON_INPUT1, configurationOfTheButtonInput1Str);
downlinkMessageMap.set(BUTTON_ALARM_THRESHOLD_INPUT1, buttonAlarmThresholdInput1Str);
downlinkMessageMap.set(CONFIGURATION_OF_THE_TERMINAL_BLOCK_INPUT2, configurationOfTheTerminalBlockInput2Str);
downlinkMessageMap.set(TERMINAL_ALARM_THRESHOLD_INPUT2, terminalAlarmThresholdInput2Str);
downlinkMessageMap.set(EVENT_COUNTER_FOR_THE_BUTTON_INPUT1, eventCounterForTheButtonInput1Str);
downlinkMessageMap.set(EVENT_COUNTER_FOR_THE_BUTTON_INPUT2, eventCounterForTheButtonInput2Str);

//  mapping the operating mode for downlink message
function getOperatingMode(value) {
    switch (value) {
        case 0x00:
            return parkModeStr;
        case 0x01:
            return productionModeStr;
        case 0x03:
            return repliModeStr;
        default:
            return unknownModeStr;
    }
}

//  mapping the presence sensor for downlink messgage
function getPresenceSensor(value) {
    switch (value) {
        case 0x00:
            return disabledStr;
        case 0x01:
            return enabledAtNightStr;
        case 0x02:
            return enabledInTheDayStr;
        case 0x03:
            return alwaysEnabledStr;
    }
}

//  mapping the type of alarms
function getTypeOfAlarm(value) {
    switch (value) {
        case 0x00:
            return alarmOffStr;
        case 0x01:
            return alarmLowThresholdStr;
        case 0x02:
            return alarmHighThresholdStr;
        case 0x03:
            return alarmLowAndHighThresholdStr;
    }
}

//  encode the operating mode for downlink message
function encodeOperatingMode(string) {
    switch (string) {
        case parkModeStr:
            return 0x00;
        case productionModeStr:
            return 0x01;
        case repliModeStr:
            return 0x03;
        default:
            return 0x02;
    }
}

//  encode the presence sensor for downlink messgage
function encodePresenceSensor(value) {
    switch (value) {
        case disabledStr:
            return 0x00;
        case enabledAtNightStr:
            return 0x01;
        case enabledInTheDayStr:
            return 0x02;
        case alwaysEnabledStr:
            return 0x03;
    }
}

//  encode the type of alarms
function encodeTypeOfAlarm(value) {
    switch (value) {
        case alarmOffStr:
            return 0x00;
        case alarmLowThresholdStr:
            return 0x01;
        case alarmHighThresholdStr:
            return 0x02;
        case alarmLowAndHighThresholdStr:
            return 0x03;
    }
}

//  encode the digital point debouncing time
function encodeDigitalPointDebouncingTime(config) {
    switch (config) {
        case noDebounceTimeStr:
            return 0x00;
        case tenMsStr:
            return 0x01;
        case twentyMsStr:
            return 0x02;
        case fiftyMsStr:
            return 0x03;
        case oneHundredMsStr:
            return 0x04;
        case twoHundredsMsStr:
            return 0x05;
        case fiveHundredsMsStr:
            return 0x06;
        case oneThousandMsStr:
            return 0x07;
        case twoThousandsMsStr:
            return 0x08;
        case fiveThousandsMsStr:
            return 0x09;
        case tenThousandsMsStr:
            return 0x0a;
        case twentyThousandsMsStr:
            return 0x0b;
        case fortyThousandsMsStr:
            return 0x0c;
        case sixtyThousandsMsStr:
            return 0x0d;
        case threeHundredThousandMsStr:
            return 0x0e;
        case sixHundredThousandMsStr:
            return 0x0f;
    }
}

//  encode the digital input type
function encodeDigitalPointType(config) {
    switch (config) {
        case offStr:
            return 0x00;
        case eventOnStr:
            return 0x01;
        case eventOffStr:
            return 0x02;
        case eventOnOffStr:
            return 0x03;
        default:
            throw new Error(digitalPointTypeError);
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

    const code = hexToDec(payloadHex, 0, 2);

    if (code != KEEP_ALIVE_FRAME) {
        const status = hexToDec(payloadHex, 2, 4);

        result.frameCounter = status >> 5;
        result.configurationSuccessful = (status & 0x01) == 1;
        result.lowBattery = ((status >> 1) & 0x01) == 1;
        result.hardwareError = ((status >> 2) & 0x01) == 1;
        result.configurationInconsistency = ((status >> 3) & 0x01) == 1;
    }

    switch (code) {
        case INFORMATION_FRAME_ON_DEVICE_CONFIG:
            if (nbBytes != 12) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkMotionConfigType;
            result.register = {};
            result.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, 4, 8) * 10;
            result.register.numberOfBackups = hexToDec(payloadHex, 8, 12);
            result.register.numberOfReadingsBeforeSavingInTheHistoryLogs = hexToDec(payloadHex, 12, 16);
            result.register.periodOfAcquisition = hexToDec(payloadHex, 16, 20) * 2;
            result.register.inhibitionTimeOfThePresenceDetector = hexToDec(payloadHex, 20, 24) * 10;
            break;
        case INFORMATION_FRAME_ON_CONFIG_DIGITAL_INPUTS:
            if (nbBytes != 8) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkDigitalInputConfigType;
            result.register = {};
            const digitalInput1Config = hexToDec(payloadHex, 4, 6);
            result.register.configurationOfTheButtonInput1 = {};
            result.register.configurationOfTheButtonInput1.type = getDigitalPointType(digitalInput1Config & 0x0f);
            if (result.register.configurationOfTheButtonInput1.type != offStr) {
                result.register.configurationOfTheButtonInput1.debounceTime = getDigitalPointDebouncingTime(
                    digitalInput1Config >> 4,
                );
                result.register.buttonAlarmThresholdInput1 = hexToDec(payloadHex, 6, 10);
            }
            const digitalInput2Config = hexToDec(payloadHex, 10, 12);
            result.register.configurationOfTheTerminalBlockInput2 = {};
            result.register.configurationOfTheTerminalBlockInput2.type = getDigitalPointType(digitalInput2Config & 0x0f);
            if (result.register.configurationOfTheTerminalBlockInput2.type != offStr) {
                result.register.configurationOfTheTerminalBlockInput2.debounceTime = getDigitalPointDebouncingTime(
                    digitalInput2Config >> 4,
                );
                result.register.terminalAlarmThresholdInput2 = hexToDec(payloadHex, 12, 16);
            }
            break;
        case INFORMATION_FRAME_ON_NETWORK_CONFIG:
            if (nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkNetworkConfigType;
            result.register = {};
            result.register.loraWanOptions = {};
            result.register.loraWanOptions.adaptiveDataRate = (hexToDec(payloadHex, 4, 6) & 0x01) == 1;
            result.register.loraWanOptions.dutyCycle = (hexToDec(payloadHex, 4, 6) & 0x04) == 1;
            result.register.modeOfActivation = getActivationMode(hexToDec(payloadHex, 6, 8));
            break;
        case KEEP_ALIVE_FRAME:
            if (nbBytes != 1) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkKeepAliveType;
            break;
        case REGISTER_VALUE_RESPONSE:
            result.type = uplinkRegisterValueResponseStr;
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
        case PERIODIC_DATA_FRAME:
            result.type = upLinkPeriodicDataType;
            result.register = {};
            result.register.presenceState = hexToDec(payloadHex, 4, 6) == 1;
            result.register.brightnessAndPresenceReadings = [];
            for (var i = 6; i < payloadHex.length; i += 4) {
                let readings = {};
                let offset = (i - 6) / 4;
                readings.offset = 0 - offset;
                readings.presence = hexToDec(payloadHex, i, i + 2);
                readings.luminosity = hexToDec(payloadHex, i + 2, i + 4);
                result.register.brightnessAndPresenceReadings.push(readings);
            }
            break;
        case PRESENCE_ALARM_FRAME:
            if (nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkPresenceAlarmType;
            result.register = {};
            result.register.presenceAlarmStatus = hexToDec(payloadHex, 4, 6) == 1;
            result.register.luminosity = hexToDec(payloadHex, 6, 8);
            break;
        case LUMINOSIY_ALARM_FRAME:
            if (nbBytes != 4) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkLuminosityAlarmType;
            result.register = {};
            result.register.luminosityAlarmStatus = hexToDec(payloadHex, 4, 6) == 1;
            result.register.luminosity = hexToDec(payloadHex, 6, 8);
            break;
        case DIGITAL_INPUT_1_ALARM_FRAME:
            if (nbBytes != 9) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkDigitalInput1AlarmType;
            result.register = {};
            result.register.digitalInputStatePreviousFrame = ((hexToDec(payloadHex, 4, 6) >> 1) & 0x01) == 1;
            result.register.digitalInputCurrentState = (hexToDec(payloadHex, 4, 6) & 0x01) == 1;
            result.register.globalDigitalCounter = hexToDec(payloadHex, 6, 14);
            result.register.instantaneousDigitalCounter = hexToDec(payloadHex, 14, 18);
            break;
        case DIGITAL_INPUT_2_ALARM_FRAME:
            if (nbBytes != 9) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkDigitalInput2AlarmType;
            result.register = {};
            result.register.digitalInputStatePreviousFrame = ((hexToDec(payloadHex, 4, 6) >> 1) & 0x01) == 1;
            result.register.digitalInputCurrentState = (hexToDec(payloadHex, 4, 6) & 0x01) == 1;
            result.register.globalDigitalCounter = hexToDec(payloadHex, 6, 14);
            result.register.instantaneousDigitalCounter = hexToDec(payloadHex, 14, 18);
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
        case SPECIFIC_REGISTER_VALUE_REQUEST_FRAME:
            result.type = "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME";
            result.payload = {};
            result.payload.type = "MotionSpecificRegisterValueRequestFrame";
            result.payload.message = [];
            for (var i = 2; i < payloadHex.length; i += 2) {
                result.payload.message.push(downlinkMessageMap.get(hexToDec(payloadHex, i, i + 2)));
            }
            break;
        case FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS:
            result.type = "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS";
            result.payload = {};
            result.payload.type = "MotionFrameForUpdatingTheValueOfSpecificRegisters";
            result.payload.register = {};
            var pos = 2;
            while (pos < payloadHex.length) {
                var confId = hexToDec(payloadHex, pos, pos + 2);
                pos += 2;
                switch (confId) {
                    case TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME:
                        result.payload.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case NUMBER_OF_BACKUPS:
                        result.payload.register.numberOfBackups = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case ACKNOWLEDGMENT_OF_THE_UPLINK_FRAMES:
                        result.payload.register.acknowledgmentOfTheUplinkFrames = hexToDec(payloadHex, pos, pos + 2) == 1;
                        pos += 2;
                        break;
                    case PIN_CODE:
                        result.payload.register.pinCode = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case OPERATING_MODE:
                        result.payload.register.operatingMode = getOperatingMode(hexToDec(payloadHex, pos, pos + 4));
                        pos += 4;
                        break;
                    case LED_ACTIVITY:
                        let ledAct = payloadHex.slice(pos, pos + 8);
                        ledAct = ledAct.replace(/^0+/, '');
                        result.payload.register.ledActivity = ledAct;
                        pos += 8;
                        break;
                    case NUMBER_OF_READINGS_BEFORE_SAVING_IN_THE_HISTORY_LOGS:
                        result.payload.register.numberOfReadingsBeforeSavingInTheHistoryLogs = hexToDec(
                            payloadHex,
                            pos,
                            pos + 4,
                        );
                        pos += 4;
                        break;
                    case PERIOD_OF_ACQUISITION:
                        result.payload.register.periodOfAcquisition = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case INHIBITION_TIME_OF_THE_PRESENCE_DETECTOR:
                        result.payload.register.inhibitionTimeOfPresenceDetector = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case PRESENCE_SENSOR:
                        result.payload.register.presenceSensor = getPresenceSensor(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;
                    case BRIGHTNESS_THRESHOLD_DAY_AND_NIGHT:
                        result.payload.register.brightnessThresholdDayAndNight = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case HYSTERESIS_DAY_AND_NIGHT_THRESHOLD:
                        result.payload.register.hysteresisDayAndNightThreshold = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case PRESENCE_ALARM_THRESHOLD:
                        result.payload.register.presenceAlarmThreshold = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case PRESENCE_ALARM:
                        result.payload.register.presenceAlarm = hexToDec(payloadHex, pos, pos + 2) == 1;
                        pos += 2;
                        break;
                    case PRESENCE_DETECTION_EVENT_COUNTER:
                        result.payload.register.presenceDetectionEventCounter = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case TYPE_OF_ALARM_FOR_BRIGHTNESS_RATE:
                        result.payload.register.typeOfAlarmForBrightnessRate = getTypeOfAlarm(
                            hexToDec(payloadHex, pos, pos + 2),
                        );
                        pos += 2;
                        break;
                    case HIGH_THRESHOLD_OF_THE_BRIGHTNESS_ALARM:
                        result.payload.register.highThresholdOfTheBrightnessAlarm = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case HIGH_HYSTERESIS_BRIGHTNESS:
                        result.payload.register.highHysteresisBrightness = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case LOW_THRESHOLD_OF_THE_BRIGHTNESS_ALARM:
                        result.payload.register.lowThresholdOfTheBrightnessAlarm = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case LOW_HYSTERESIS_BRIGHTNESS:
                        result.payload.register.lowHysteresisBrightness = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;
                    case CONFIGURATION_OF_THE_BUTTON_INPUT1:
                        const digitalInput1Config = hexToDec(payloadHex, pos, pos + 2);
                        result.payload.register.configurationOfTheButtonInput1 = {};
                        result.payload.register.configurationOfTheButtonInput1.debounceTime = getDigitalPointDebouncingTime(
                            digitalInput1Config >> 4,
                        );
                        result.payload.register.configurationOfTheButtonInput1.type = getDigitalPointType(digitalInput1Config & 0x0f);
                        pos += 2;
                        break;
                    case BUTTON_ALARM_THRESHOLD_INPUT1:
                        result.payload.register.buttonAlarmThresholdInput1 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case CONFIGURATION_OF_THE_TERMINAL_BLOCK_INPUT2:
                        const digitalInput2Config = hexToDec(payloadHex, pos, pos + 2);
                        result.payload.register.configurationOfTheTerminalBlockInput2 = {};
                        result.payload.register.configurationOfTheTerminalBlockInput2.debounceTime = getDigitalPointDebouncingTime(
                            digitalInput2Config >> 4,
                        );
                        result.payload.register.configurationOfTheTerminalBlockInput2.type = getDigitalPointType(digitalInput2Config & 0x0f);
                        pos += 2;
                        break;
                    case TERMINAL_ALARM_THRESHOLD_INPUT2:
                        result.payload.register.terminalAlarmThresholdInput2 = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;
                    case EVENT_COUNTER_FOR_THE_BUTTON_INPUT1:
                        result.payload.register.eventCounterForTheButtonInput1 = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;
                    case EVENT_COUNTER_FOR_THE_BUTTON_INPUT2:
                        result.payload.register.eventCounterForTheButtonInput2 = hexToDec(payloadHex, pos, pos + 8);
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
            if (payload.transmissionPeriodOfTheKeepAliveFrame != null) {
                bytes.push(TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME);
                const toPush = decToBytes(payload.transmissionPeriodOfTheKeepAliveFrame);
                while (toPush.length < 2) {
                    toPush.push(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.numberOfBackups != null) {
                bytes.push(NUMBER_OF_BACKUPS);
                const toPush = decToBytes(payload.numberOfBackups);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.acknowledgmentOfTheUplinkFrames != null) {
                bytes.push(ACKNOWLEDGMENT_OF_THE_UPLINK_FRAMES);
                bytes.push(booleanToByte(payload.acknowledgmentOfTheUplinkFrames));
            }
            if (payload.pinCode != null) {
                bytes.push(PIN_CODE);
                bytes.push(decToBytes(payload.pinCode));
            }
            if (payload.operatingMode != null) {
                bytes.push(OPERATING_MODE);
                const toPush = decToBytes(encodeOperatingMode(payload.operatingMode));
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.ledActivity != null) {
                bytes.push(LED_ACTIVITY);
                const toPush = hexToBytes(payload.ledActivity);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.numberOfReadingsBeforeSavingInTheHistoryLogs != null) {
                bytes.push(NUMBER_OF_READINGS_BEFORE_SAVING_IN_THE_HISTORY_LOGS);
                const toPush = decToBytes(payload.numberOfReadingsBeforeSavingInTheHistoryLogs);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.periodOfAcquisition != null) {
                bytes.push(PERIOD_OF_ACQUISITION);
                const toPush = decToBytes(payload.periodOfAcquisition);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.inhibitionTimeOfPresenceDetector != null) {
                bytes.push(INHIBITION_TIME_OF_THE_PRESENCE_DETECTOR);
                const toPush = decToBytes(payload.inhibitionTimeOfPresenceDetector);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.presenceSensor != null) {
                bytes.push(PRESENCE_SENSOR);
                bytes.push(decToBytes(encodePresenceSensor(payload.presenceSensor)));
            }
            if (payload.brightnessThresholdDayAndNight != null) {
                bytes.push(BRIGHTNESS_THRESHOLD_DAY_AND_NIGHT);
                bytes.push(decToBytes(payload.brightnessThresholdDayAndNight));
            }
            if (payload.hysteresisDayAndNightThreshold != null) {
                bytes.push(HYSTERESIS_DAY_AND_NIGHT_THRESHOLD);
                bytes.push(decToBytes(payload.hysteresisDayAndNightThreshold));
            }
            if (payload.presenceAlarmThreshold != null) {
                bytes.push(PRESENCE_ALARM_THRESHOLD);
                const toPush = decToBytes(payload.presenceAlarmThreshold);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.presenceAlarm != null) {
                bytes.push(PRESENCE_ALARM);
                bytes.push(booleanToByte(payload.presenceAlarm));
            }
            if (payload.presenceDetectionEventCounter != null) {
                bytes.push(PRESENCE_DETECTION_EVENT_COUNTER);
                const toPush = decToBytes(payload.presenceDetectionEventCounter);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.typeOfAlarmForBrightnessRate != null) {
                bytes.push(TYPE_OF_ALARM_FOR_BRIGHTNESS_RATE);
                bytes.push(decToBytes(encodeTypeOfAlarm(payload.typeOfAlarmForBrightnessRate)));
            }
            if (payload.highThresholdOfTheBrightnessAlarm != null) {
                bytes.push(HIGH_THRESHOLD_OF_THE_BRIGHTNESS_ALARM);
                bytes.push(decToBytes(payload.highThresholdOfTheBrightnessAlarm));
            }
            if (payload.highHysteresisBrightness != null) {
                bytes.push(HIGH_HYSTERESIS_BRIGHTNESS);
                bytes.push(decToBytes(payload.highHysteresisBrightness));
            }
            if (payload.lowThresholdOfTheBrightnessAlarm != null) {
                bytes.push(LOW_THRESHOLD_OF_THE_BRIGHTNESS_ALARM);
                bytes.push(decToBytes(payload.lowThresholdOfTheBrightnessAlarm));
            }
            if (payload.lowHysteresisBrightness != null) {
                bytes.push(LOW_HYSTERESIS_BRIGHTNESS);
                bytes.push(decToBytes(payload.lowHysteresisBrightness));
            }
            if (payload.configurationOfTheButtonInput1 != null) {
                bytes.push(CONFIGURATION_OF_THE_BUTTON_INPUT1);
                var upperByte = encodeDigitalPointDebouncingTime(payload.configurationOfTheButtonInput1.debounceTime);
                var lowerByte = encodeDigitalPointType(payload.configurationOfTheButtonInput1.type);
                var byte = (upperByte << 4) | lowerByte;
                bytes.push(byte);
            }
            if (payload.buttonAlarmThresholdInput1 != null) {
                bytes.push(BUTTON_ALARM_THRESHOLD_INPUT1);
                const toPush = decToBytes(payload.buttonAlarmThresholdInput1);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.configurationOfTheTerminalBlockInput2 != null) {
                bytes.push(CONFIGURATION_OF_THE_TERMINAL_BLOCK_INPUT2);
                var upperByte = encodeDigitalPointDebouncingTime(payload.configurationOfTheTerminalBlockInput2.debounceTime);
                var lowerByte = encodeDigitalPointType(payload.configurationOfTheTerminalBlockInput2.type);
                var byte = (upperByte << 4) | lowerByte;
                bytes.push(byte);
            }
            if (payload.terminalAlarmThresholdInput2 != null) {
                bytes.push(TERMINAL_ALARM_THRESHOLD_INPUT2);
                const toPush = decToBytes(payload.terminalAlarmThresholdInput2);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.eventCounterForTheButtonInput1 != null) {
                bytes.push(EVENT_COUNTER_FOR_THE_BUTTON_INPUT1);
                const toPush = decToBytes(payload.eventCounterForTheButtonInput1);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.eventCounterForTheButtonInput2 != null) {
                bytes.push(EVENT_COUNTER_FOR_THE_BUTTON_INPUT2);
                const toPush = decToBytes(payload.eventCounterForTheButtonInput2);
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

    result.bytes = bytes;
    result.fPort = 1;

    return result;
}

/*
............................................................................................................................
This part is needed to export the functions that we test 
............................................................................................................................
*/

exports.decodeUplink = decodeUplink;
exports.decodeDownlink = decodeDownlink;
exports.encodeDownlink = encodeDownlink;
