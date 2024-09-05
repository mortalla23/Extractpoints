
/*

***********************This driver is written according to the documentation of the PULSE_PULSE-ATEX_V2_LORAWAN V2.0.4 attached in the specification********************************

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
const DATA_FRAME = 0x46;
const ALARM_FRAME = 0x47;
const PERIODIC_FRAME_WITH_1_HOUR_HISTORY = 0x48;
const PERIODIC_FRAME_WITH_24_HOURS_HISTORY = 0x48;

//  these variables are needed to encode/decode the downlink
const PRODUCT_CONFIGURATION_REQUEST_FRAME = 0x01;
const NETWORK_CONFIGURATION_REQUEST_FRAME = 0x02;
const FRAME_FOR_ADDING_OFFSET_TO_PULSE_COUNTERS = 0x03;
const SPECIFIC_REGISTER_VALUE_REQUEST_FRAME = 0x40;
const FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS = 0x41;

const TRANSMISSION_PERIOD_OF_DATA_SENSORS = 0x01;
const CONFIRMED_MODE_ACTIVATION = 0x03;
const PIN_CODE = 0x04;
const GLOBAL_OPERATION = 0x06;
const CHANNELS_CONFIGURATION = 0x14;
const HISTORY_CONFIGURATION = 0x15;
const ANTI_BOUNCE_FILTER_PERIOD = 0x16;
const CURRENT_VALUE_OF_METER_CHANNEL_A = 0x17;
const CURRENT_VALUE_OF_METER_CHANNEL_B = 0x18;
const FLOW_CALCULATION_PERIOD = 0x19;
const FLOW_THRESHOLD_CHANNEL_A = 0x1a;
const FLOW_THRESHOLD_CHANNEL_B = 0x1b;
const LEAK_THRESHOLD_CHANNEL_A = 0x1c;
const LEAK_THRESHOLD_CHANNEL_B = 0x1d;
const NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_A = 0x1e;
const NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_B = 0x1f;
const SCAN_PERIOD_FOR_CHANNEL_A = 0x20;
const TAMPER_DETECTION_THRESHOLD_CHANNEL_A = 0x21;
const SCAN_PERIOD_FOR_CHANNEL_B = 0x22;
const TAMPER_DETECTION_THRESHOLD_CHANNEL_B = 0x23;

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
const uplinkFrameIndexError = "invalid uplink payload: unknown frame index";
const downlinkRegisterIdError = "invalid downlink payload: unknown register id";
const downlinkLengthError = "invalid downlink payload: wrong length";

const uplinkProductConfigType = "PRODUCT_CONFIGURATION_DATA_FRAME";
const uplinkNetworkConfigType = "FRAMES_OF_INFORMATION_ON_THE_NETWORK_CONFIGURATION";
const uplinkKeepAliveType = "KEEP_ALIVE_FRAME";
const uplinkReplyFrameToRegisterValueRequestStr = "REPLY_FRAME_TO_REGISTER_VALUE_REQUEST";
const uplinkDataType = "DATA_FRAME";
const uplinkAlarmType = "ALARM_FRAME";
const uplinkPeriodic1HourType = "PERIODIC_FRAME_WITH_1_HOUR_HISTORY";
const uplinkPeriodic24HoursType = "PERIODIC_FRAME_WITH_24_HOURS_HISTORY";

const transmissionPeriodOfDataSensorsStr = "TRANSMISSION_PERIOD_OF_DATA_SENSORS";
const confirmedModeActivationStr = "CONFIRMED_MODE_ACTIVATION";
const pinCodeStr = "PIN_CODE";
const globalOperationStr = "GLOBAL_OPERATION";
const channelsConfigurationStr = "CHANNELS_CONFIGURATION";
const historyConfigurationStr = "HISTORY_CONFIGURATION";
const antiBounceFilterPeriodStr = "ANTI_BOUNCE_FILTER_PERIOD";
const currentValueOfMeterChannelAStr = "CURRENT_VALUE_OF_METER_CHANNEL_A";
const currentValueOfMeterChannelBStr = "CURRENT_VALUE_OF_METER_CHANNEL_B";
const flowCalculationPeriodStr = "FLOW_CALCULATION_PERIOD";
const flowThresholdChannelAStr = "FLOW_THRESHOLD_CHANNEL_A";
const flowThresholdChannelBStr = "FLOW_THRESHOLD_CHANNEL_B";
const leakThresholdChannelAStr = "LEAK_THRESHOLD_CHANNEL_A";
const leakThresholdChannelBStr = "LEAK_THRESHOLD_CHANNEL_B";
const numberOfDailyPeriodsUnderTheLeakThresholdChannelAStr = "NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_A";
const numberOfDailyPeriodsUnderTheLeakThresholdChannelBStr = "NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_B";
const scanPeriodForChannelAStr = "SCAN_PERIOD_FOR_CHANNEL_A";
const tamperDetectionThresholdChannelAStr = "TAMPER_DETECTION_THRESHOLD_CHANNEL_A";
const scanPeriodForChannelBStr = "SCAN_PERIOD_FOR_CHANNEL_B";
const tamperDetectionThresholdChannelBStr = "TAMPER_DETECTION_THRESHOLD_CHANNEL_B";

//  mapping the downlink message in a map with key = id and value = label
let downlinkMessageMap = new Map();
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_DATA_SENSORS, transmissionPeriodOfDataSensorsStr);
downlinkMessageMap.set(CONFIRMED_MODE_ACTIVATION, confirmedModeActivationStr);
downlinkMessageMap.set(PIN_CODE, pinCodeStr);
downlinkMessageMap.set(GLOBAL_OPERATION, globalOperationStr);
downlinkMessageMap.set(CHANNELS_CONFIGURATION, channelsConfigurationStr);
downlinkMessageMap.set(HISTORY_CONFIGURATION, historyConfigurationStr);
downlinkMessageMap.set(ANTI_BOUNCE_FILTER_PERIOD, antiBounceFilterPeriodStr);
downlinkMessageMap.set(CURRENT_VALUE_OF_METER_CHANNEL_A, currentValueOfMeterChannelAStr);
downlinkMessageMap.set(CURRENT_VALUE_OF_METER_CHANNEL_B, currentValueOfMeterChannelBStr);
downlinkMessageMap.set(FLOW_CALCULATION_PERIOD, flowCalculationPeriodStr);
downlinkMessageMap.set(FLOW_THRESHOLD_CHANNEL_A, flowThresholdChannelAStr);
downlinkMessageMap.set(FLOW_THRESHOLD_CHANNEL_B, flowThresholdChannelBStr);
downlinkMessageMap.set(LEAK_THRESHOLD_CHANNEL_A, leakThresholdChannelAStr);
downlinkMessageMap.set(LEAK_THRESHOLD_CHANNEL_B, leakThresholdChannelBStr);
downlinkMessageMap.set(
    NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_A,
    numberOfDailyPeriodsUnderTheLeakThresholdChannelAStr,
);
downlinkMessageMap.set(
    NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_B,
    numberOfDailyPeriodsUnderTheLeakThresholdChannelBStr,
);
downlinkMessageMap.set(SCAN_PERIOD_FOR_CHANNEL_A, scanPeriodForChannelAStr);
downlinkMessageMap.set(TAMPER_DETECTION_THRESHOLD_CHANNEL_A, tamperDetectionThresholdChannelAStr);
downlinkMessageMap.set(SCAN_PERIOD_FOR_CHANNEL_B, scanPeriodForChannelBStr);
downlinkMessageMap.set(TAMPER_DETECTION_THRESHOLD_CHANNEL_B, tamperDetectionThresholdChannelBStr);

const parkModeStr = "PARK_MODE";
const productionModeStr = "PRODUCTION_MODE";
const testModeStr = "TEST_MODE";
const repliModeStr = "REPLI_MODE";

const gazMeterStr = "GAS_METER";
const otherMeterStr = "METER_OTHER_THAN_GAS";

const noHistoryStr = "NO_HISTORY";
const historyPeriod10MinsStr = "HISTORY_PERIOD_SET_TO_10MIN_TRANSMIT_PERIOD_SET_TO_1HOUR";
const historyPeriod1HourStr = "HISTORY_PERIOD_SET_TO_1HOUR_TRANSMIT_PERIOD_SET_TO_24HOUR";

const activatedStr = "ACTIVATED";
const deactivatedStr = "DEACTIVATED";
const oneMsStr = "ONE_MS";
const tenMsStr = "TEN_MS";
const twentyMsStr = "TWENTY_MS";
const fiftyMsStr = "FIFTY_MS";
const oneHundredMsStr = "ONE_HUNDRED_MS";
const twoHundredsMsStr = "TWO_HUNDREDS_MS";
const fiveHundredsMsStr = "FIVE_HUNDREDS_MS";
const oneSStr= "ONE_S";
const twoSStr = "TWO_S";
const fiveSStr = "FIVE_S";
const tenSStr = "TEN_S";

const otaaStr = "OTAA";
const abpStr = "ABP";

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

//  mapping the operating mode fro uplink/downlink decoding
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

//  mapping the channel meter type
function getMeterType(value) {
    switch (value) {
        case 0:
            return otherMeterStr;
        case 1:
            return gazMeterStr;
    }
}

//  mapping the channel activation
function getChannelActivation(value) {
    switch (value) {
        case 0:
            return deactivatedStr;
        case 1:
            return activatedStr;
    }
}

//  mapping the channel tamper input
function getChannelTamperInput(value) {
    switch (value) {
        case 0:
            return deactivatedStr;
        case 1:
            return activatedStr;
    }
}

//  mappin the history configuration
function getHistoryConfiguration(value) {
    switch (value) {
        case 0x00:
            return noHistoryStr;
        case 0x01:
            return historyPeriod10MinsStr;
        case 0x02:
            return historyPeriod1HourStr;
    }
}

//  mapping the ani bounce period
function getAntiBounceFilterPeriod(value) {
    switch (value) {
        case 0x00:
            return deactivatedStr;
        case 0x01:
            return oneMsStr;
        case 0x02:
            return tenMsStr;
        case 0x03:
            return twentyMsStr;
        case 0x04:
            return fiftyMsStr;
        case 0x05:
            return oneHundredMsStr;
        case 0x06:
            return twoHundredsMsStr;
        case 0x07:
            return fiveHundredsMsStr;
        case 0x08:
            return oneSStr;
        case 0x09:
            return twoSStr;
        case 0x0a:
            return fiveSStr;
        case 0x0b:
            return tenSStr;
    }
}

//  mapping the connection for network configuration frame for uplink
function getConnectionMode(value) {
    switch (value) {
        case 0:
            return abpStr;
        case 1:
            return otaaStr;
    }
}

//  mapping the operating mode fro downlink encoding
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

//  mapping the channel meter type for downlink encode
function encodeMeterType(value) {
    switch (value) {
        case otherMeterStr:
            return 0;
        case gazMeterStr:
            return 1;
    }
}

//  mapping the channel activation for downlink encode
function encodeChannelActivation(value) {
    switch (value) {
        case deactivatedStr:
            return 0;
        case activatedStr:
            return 1;
    }
}

//  mapping the channel tamper input for downlink encode
function encodeChannelTamperInput(value) {
    switch (value) {
        case deactivatedStr:
            return 0;
        case activatedStr:
            return 1;
    }
}

//  mappin the history configuration for downlink encode
function encodeHistoryConfiguration(value) {
    switch (value) {
        case noHistoryStr:
            return 0x00;
        case historyPeriod10MinsStr:
            return 0x01;
        case historyPeriod1HourStr:
            return 0x02;
    }
}

//  mapping the ani bounce period for downlink encode
function encodeAntiBounceFilterPeriod(value) {
    switch (value) {
        case deactivatedStr:
            return 0x00;
        case oneMsStr:
            return 0x01;
        case tenMsStr:
            return 0x02;
        case twentyMsStr:
            return 0x03;
        case fiftyMsStr:
            return 0x04;
        case oneHundredMsStr:
            return 0x05;
        case twoHundredsMsStr:
            return 0x06;
        case fiveHundredsMsStr:
            return 0x07;
        case oneSStr:
            return 0x08;
        case twoSStr:
            return 0x09;
        case fiveSStr:
            return 0x0a;
        case tenSStr:
            return 0x0b;
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
    result.configurationSuccessful = (status & 0x01) == 1;
    result.lowBattery = ((status >> 1) & 0x01) == 1;
    result.hardwareError = ((status >> 2) & 0x01) == 1;

    switch (code) {
        case PRODUCT_CONFIGURATION:
            if (nbBytes != 22) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfigType;
            result.register = {};
            result.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, 4, 6));
            if (result.register.globalOperation == productionModeStr) {
                result.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, 6, 10) * 60;
                result.register.flowCalculationPeriod = hexToDec(payloadHex, 16, 20) * 60;
            } else if (result.register.globalOperation == testModeStr) {
                result.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, 6, 10) * 20;
                result.register.flowCalculationPeriod = hexToDec(payloadHex, 16, 20) * 20;
            } else {
                result.register.transmissionPeriodOfDataSensors = 1440;
                result.register.flowCalculationPeriod = 60;
            }
            const channelConfiguration = hexToDec(payloadHex, 10, 12);
            result.register.channelsConfiguration = {};

            const configurationChannelA = channelConfiguration & 0x0f;
            result.register.channelsConfiguration.channelA = {};
            result.register.channelsConfiguration.channelA.channelActivation = getChannelActivation((configurationChannelA & 0x01));
            result.register.channelsConfiguration.channelA.gasMeterType = getMeterType((configurationChannelA >> 1) & 0x01);
            result.register.channelsConfiguration.channelA.channelTamperInput = getChannelTamperInput((configurationChannelA >> 3) & 0x01);

            const configurationChannelB = channelConfiguration >> 4;
            result.register.channelsConfiguration.channelB = {};
            result.register.channelsConfiguration.channelB.channelActivation = getChannelActivation((configurationChannelB & 0x01));
            result.register.channelsConfiguration.channelB.gasMeterType = getMeterType((configurationChannelB >> 1) & 0x01);
            result.register.channelsConfiguration.channelB.channelTamperInput = getChannelTamperInput((configurationChannelB >> 3) & 0x01);

            result.register.historyConfiguration = getHistoryConfiguration(hexToDec(payloadHex, 12, 14));

            const antiBounce = hexToDec(payloadHex, 14, 16);
            result.register.antiBounceFilterPeriod = {};

            const antiBounceChannelA = antiBounce & 0x0f;
            result.register.antiBounceFilterPeriod.antiBounceFilterPeriodChannelA = getAntiBounceFilterPeriod(antiBounceChannelA);

            const antiBounceChannelB = antiBounce >> 4;
            result.register.antiBounceFilterPeriod.antiBounceFilterPeriodChannelB = getAntiBounceFilterPeriod(antiBounceChannelB);

            result.register.flowThresholdChannelA = hexToDec(payloadHex, 20, 24);
            result.register.flowThresholdChannelB = hexToDec(payloadHex, 24, 28);
            result.register.leakThresholdChannelA = hexToDec(payloadHex, 28, 32);
            result.register.leakThresholdChannelB = hexToDec(payloadHex, 32, 36);

            result.register.numberOfDailyPeriodsUnderTheLeakThresholdChannelA = hexToDec(payloadHex, 36, 40);
            result.register.numberOfDailyPeriodsUnderTheLeakThresholdChannelB = hexToDec(payloadHex, 40, 44);
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
            result.register.modeOfActivation = getConnectionMode(hexToDec(payloadHex, 6, 8));
            break;

        case KEEP_ALIVE:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkKeepAliveType;
            result.register = {};

            const alarms = hexToDec(payloadHex, 4, 6);
            result.register.exceedingFlowOnChannelA = (alarms & 0x01) == 1;
            result.register.exceedingFlowOnChannelB = ((alarms >> 1) & 0x01) == 1;
            result.register.tamperDetectedOnChannelA = ((alarms >> 2) & 0x01) == 1;
            result.register.tamperDetectedOnChannelB = ((alarms >> 3) & 0x01) == 1;
            result.register.leakDetectedOnChannelA = ((alarms >> 4) & 0x01) == 1;
            result.register.leakDetectedOnChannelB = ((alarms >> 5) & 0x01) == 1;

            result.register.maxFlowChannelA = hexToDec(payloadHex, 6, 10);
            result.register.maxFlowChannelB = hexToDec(payloadHex, 10, 14);
            result.register.minFlowChannelA = hexToDec(payloadHex, 14, 18);
            result.register.minFlowChannelB = hexToDec(payloadHex, 18, 22);
            break;

        case REPLY_FRAME_TO_REGISTER_VALUE_REQUEST:
            result.type = uplinkReplyFrameToRegisterValueRequestStr;
            break;

        case DATA_FRAME:
            if (nbBytes != 10) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkDataType;
            result.register = {};
            result.register.counterChannelA = hexToDec(payloadHex, 4, 12);
            result.register.counterChannelB = hexToDec(payloadHex, 12, 20);
            break;

        case ALARM_FRAME:
            if (nbBytes != 6) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkAlarmType;
            result.register = {};
            result.register.measuredFlowChannelA = hexToDec(payloadHex, 4, 8);
            result.register.measuredFlowChannelB = hexToDec(payloadHex, 8, 12);
            break;

        case PERIODIC_FRAME_WITH_1_HOUR_HISTORY:
        case PERIODIC_FRAME_WITH_24_HOURS_HISTORY:
            result.register = {};
            result.register.frameIndex = hexToDec(payloadHex, 4, 6);

            if (result.register.frameIndex == 0) {
                result.register.counterChannelA = hexToDec(payloadHex, 6, 14);
                result.register.counterChannelB = hexToDec(payloadHex, 14, 22);
                if (nbBytes == 31) {
                    result.type = uplinkPeriodic1HourType;
                    result.register.periodicFrames = [];
                    for (let i = 22; i < payloadHex.length; i += 8) {
                        let readings = {};
                        readings.deltaA = hexToDec(payloadHex, i, i + 4);
                        readings.deltaB = hexToDec(payloadHex, i + 4, i + 8);
                        readings.offset = (((i-22)/8) + 2) * 10;
                        result.register.periodicFrames.push(readings);
                    }
                } else if (nbBytes == 51) {
                    result.type = uplinkPeriodic24HoursType;
                    result.register.periodicFrames = [];
                    for (let i = 22; i < payloadHex.length; i += 8) {
                        let readings = {};
                        readings.deltaA = hexToDec(payloadHex, i, i + 4);
                        readings.deltaB = hexToDec(payloadHex, i + 4, i + 8);
                        readings.offset = (((i-22)/8) + 2) * 60;
                        result.register.periodicFrames.push(readings);
                    }
                } else {
                    throw new Error(uplinkLengthError);
                }

            } else if (result.register.frameIndex == 1) {
                if (nbBytes != 51) {
                    throw new Error(uplinkLengthError);
                }
                result.type = uplinkPeriodic24HoursType;
                result.register.periodicFrames = [];
                for (let i = 6; i < payloadHex.length; i += 8) {
                    let readings = {};
                    readings.deltaA = hexToDec(payloadHex, i, i + 4);
                    readings.deltaB = hexToDec(payloadHex, i + 4, i + 8);
                    readings.offset = (((i-6)/8) + 12) * 60;
                    result.register.periodicFrames.push(readings);
                }
            } else if (result.register.frameIndex == 2) {
                if (nbBytes != 7) {
                    throw new Error(uplinkLengthError);
                }
                result.type = uplinkPeriodic24HoursType;
                result.register.periodicFrames = [];
                let readings = {};
                readings.deltaA = hexToDec(payloadHex, 6, 10);
                readings.deltaB = hexToDec(payloadHex, 10, 14);
                readings.offset = 24 * 60;
                result.register.periodicFrames.push(readings);
            } else {
                throw new Error(uplinkFrameIndexError);
            }
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

        case FRAME_FOR_ADDING_OFFSET_TO_PULSE_COUNTERS:
            if (nbBytes != 9) {
                throw new Error(downlinkLengthError);
            }
            result.type = "FRAME_FOR_ADDING_OFFSET_TO_PULSE_COUNTERS";
            result.payload = {};
            result.payload.type = "Pulse2FrameForAddingOffsetToPulseCounters";
            result.payload.register = {};
            result.payload.register.offsetChannelA = hexToDec(payloadHex, 2, 10);
            result.payload.register.offsetChannelB = hexToDec(payloadHex, 10, 18);
            break;

        case SPECIFIC_REGISTER_VALUE_REQUEST_FRAME:
            result.type = "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME";
            result.payload = {};
            result.payload.type = "Pulse2SpecificRegisterValueRequestFrame";
            result.payload.message = [];
            for (let i = 2; i < payloadHex.length; i += 2) {
                result.payload.message.push(downlinkMessageMap.get(hexToDec(payloadHex, i, i + 2)));
            }
            break;

        case FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS:
            result.type = "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS";
            result.payload = {};
            result.payload.type = "Pulse2FrameForUpdatingTheValueOfSpecificRegisters";
            result.payload.register = {};
            let pos = 2;
            while (pos < payloadHex.length) {
                const confId = hexToDec(payloadHex, pos, pos + 2);
                pos += 2;
                switch (confId) {
                    case TRANSMISSION_PERIOD_OF_DATA_SENSORS:
                        result.payload.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, pos, pos + 4);
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
                        result.payload.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, pos, pos + 2));
                        pos += 2;
                        break;

                    case CHANNELS_CONFIGURATION:
                        const channelConfiguration = hexToDec(payloadHex, pos, pos + 2);
                        result.channelsConfiguration = {};

                        const configurationChannelA = channelConfiguration & 0x0f;
                        result.payload.register.channelsConfiguration.channelA = {};
                        result.payload.register.channelsConfiguration.channelA.channelActivation = getChannelActivation((configurationChannelA & 0x01));
                        result.payload.register.channelsConfiguration.channelA.gasMeterType = getMeterType((configurationChannelA >> 1) & 0x01);
                        result.payload.register.channelsConfiguration.channelA.channelTamperInput = getChannelTamperInput((configurationChannelA >> 3) & 0x01);

                        const configurationChannelB = channelConfiguration >> 4;
                        result.payload.register.channelsConfiguration.channelB = {};
                        result.payload.register.channelsConfiguration.channelB.channelActivation = getChannelActivation((configurationChannelB & 0x01));
                        result.payload.register.channelsConfiguration.channelB.gasMeterType = getMeterType((configurationChannelB >> 1) & 0x01);
                        result.payload.register.channelsConfiguration.channelB.channelTamperInput = getChannelTamperInput((configurationChannelB >> 3) & 0x01);

                        pos += 2;
                        break;

                    case HISTORY_CONFIGURATION:
                        result.payload.register.historyConfiguration = getHistoryConfiguration(
                            hexToDec(payloadHex, pos, pos + 2),
                        );
                        pos += 2;
                        break;

                    case ANTI_BOUNCE_FILTER_PERIOD:
                        const antiBounce = hexToDec(payloadHex, pos, pos + 2);
                        result.payload.register.antiBounceFilterPeriod = {};

                        const antiBounceChannelA = antiBounce & 0x0f;
                        result.payload.register.antiBounceFilterPeriod.antiBounceFilterPeriodChannelA = getAntiBounceFilterPeriod(antiBounceChannelA);

                        const antiBounceChannelB = antiBounce >> 4;
                        result.payload.register.antiBounceFilterPeriod.antiBounceFilterPeriodChannelB = getAntiBounceFilterPeriod(antiBounceChannelB);

                        pos += 2;
                        break;

                    case CURRENT_VALUE_OF_METER_CHANNEL_A:
                        result.payload.register.currentValueOfMeterChannelA = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case CURRENT_VALUE_OF_METER_CHANNEL_B:
                        result.payload.register.currentValueOfMeterChannelB = hexToDec(payloadHex, pos, pos + 8);
                        pos += 8;
                        break;

                    case FLOW_CALCULATION_PERIOD:
                        result.payload.register.flowCalculationPeriod = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case FLOW_THRESHOLD_CHANNEL_A:
                        result.payload.register.flowThresholdChannelA = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case FLOW_THRESHOLD_CHANNEL_B:
                        result.payload.register.flowThresholdChannelB = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LEAK_THRESHOLD_CHANNEL_A:
                        result.payload.register.leakThresholdChannelA = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case LEAK_THRESHOLD_CHANNEL_B:
                        result.payload.register.leakThresholdChannelB = hexToDec(payloadHex, pos, pos + 4);
                        pos += 4;
                        break;

                    case NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_A:
                        result.payload.register.numberOfDailyPeriodsUnderTheLeakThresholdChannelA = hexToDec(
                            payloadHex,
                            pos,
                            pos + 4,
                        );
                        pos += 4;
                        break;

                    case NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_B:
                        result.payload.register.numberOfDailyPeriodsUnderTheLeakThresholdChannelB = hexToDec(
                            payloadHex,
                            pos,
                            pos + 4,
                        );
                        pos += 4;
                        break;

                    case SCAN_PERIOD_FOR_CHANNEL_A:
                        result.payload.register.scanPeriodForChannelA = hexToDec(payloadHex, pos, pos + 2) * 10;
                        pos += 2;
                        break;

                    case TAMPER_DETECTION_THRESHOLD_CHANNEL_A:
                        result.payload.register.tamperDetectionThresholdChannelA = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case SCAN_PERIOD_FOR_CHANNEL_B:
                        result.payload.register.scanPeriodForChannelB = hexToDec(payloadHex, pos, pos + 2) * 10;
                        pos += 2;
                        break;

                    case TAMPER_DETECTION_THRESHOLD_CHANNEL_B:
                        result.payload.register.tamperDetectionThresholdChannelB = hexToDec(payloadHex, pos, pos + 2);
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
    let result = {};
    let bytes = [];

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

        case "FRAME_FOR_ADDING_OFFSET_TO_PULSE_COUNTERS":
            bytes.push(FRAME_FOR_ADDING_OFFSET_TO_PULSE_COUNTERS);
            const payloadOffset = input.payload.register;
            if (payloadOffset.offsetChannelA != null) {
                let toPush = decToBytes(payloadOffset.offsetChannelA);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payloadOffset.offsetChannelB != null) {
                let toPush = decToBytes(payloadOffset.offsetChannelB);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
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
            if (payload.transmissionPeriodOfDataSensors != null) {
                bytes.push(TRANSMISSION_PERIOD_OF_DATA_SENSORS);
                let toPush = decToBytes(payload.transmissionPeriodOfDataSensors);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.confirmedModeActivation != null) {
                bytes.push(CONFIRMED_MODE_ACTIVATION);
                bytes.push(booleanToByte(payload.confirmedModeActivation));
            }
            if (payload.pinCode != null) {
                bytes.push(PIN_CODE);
                let toPush = decToBytes(payload.pinCode);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.globalOperation != null) {
                bytes.push(GLOBAL_OPERATION);
                bytes.push(decToBytes(encodeGlobalOperation(payload.globalOperation)));
            }
            if (payload.channelsConfiguration != null) {
                bytes.push(CHANNELS_CONFIGURATION);
                let lowerByte = encodeChannelActivation(payload.channelsConfiguration.channelA.channelActivation);
                lowerByte |= encodeMeterType(payload.channelsConfiguration.channelA.gasMeterType) << 1;
                lowerByte |= encodeChannelTamperInput(payload.channelsConfiguration.channelA.channelTamperInput) << 3;
                let upperByte = encodeChannelActivation(payload.channelsConfiguration.channelB.channelActivation);
                upperByte |= encodeMeterType(payload.channelsConfiguration.channelB.gasMeterType) << 1;
                upperByte |= encodeChannelTamperInput(payload.channelsConfiguration.channelB.channelTamperInput) << 3;
                let byte = (upperByte << 4) | lowerByte;
                bytes.push(byte);
            }
            if (payload.historyConfiguration != null) {
                bytes.push(HISTORY_CONFIGURATION);
                bytes.push(encodeHistoryConfiguration(payload.historyConfiguration));
            }
            if (payload.antiBounceFilterPeriod != null) {
                bytes.push(ANTI_BOUNCE_FILTER_PERIOD);
                let lowerByte = encodeAntiBounceFilterPeriod(payload.antiBounceFilterPeriod.antiBounceFilterPeriodChannelA);
                let upperByte = encodeAntiBounceFilterPeriod(payload.antiBounceFilterPeriod.antiBounceFilterPeriodChannelB);
                let byte = (upperByte << 4) | lowerByte;
                bytes.push(byte);
            }
            if (payload.currentValueOfMeterChannelA != null) {
                bytes.push(CURRENT_VALUE_OF_METER_CHANNEL_A);
                let toPush = decToBytes(payload.currentValueOfMeterChannelA);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.currentValueOfMeterChannelB != null) {
                bytes.push(CURRENT_VALUE_OF_METER_CHANNEL_B);
                let toPush = decToBytes(payload.currentValueOfMeterChannelB);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.flowCalculationPeriod != null) {
                bytes.push(FLOW_CALCULATION_PERIOD);
                let toPush = decToBytes(payload.flowCalculationPeriod);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.flowThresholdChannelA != null) {
                bytes.push(FLOW_THRESHOLD_CHANNEL_A);
                let toPush = decToBytes(payload.flowThresholdChannelA);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.flowThresholdChannelB != null) {
                bytes.push(FLOW_THRESHOLD_CHANNEL_B);
                let toPush = decToBytes(payload.flowThresholdChannelB);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.leakThresholdChannelA != null) {
                bytes.push(LEAK_THRESHOLD_CHANNEL_A);
                let toPush = decToBytes(payload.leakThresholdChannelA);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.leakThresholdChannelB != null) {
                bytes.push(LEAK_THRESHOLD_CHANNEL_B);
                let toPush = decToBytes(payload.leakThresholdChannelB);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.numberOfDailyPeriodsUnderTheLeakThresholdChannelA != null) {
                bytes.push(NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_A);
                let toPush = decToBytes(payload.numberOfDailyPeriodsUnderTheLeakThresholdChannelA);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.numberOfDailyPeriodsUnderTheLeakThresholdChannelB != null) {
                bytes.push(NUMBER_OF_DAILY_PERIODS_UNDER_THE_LEAK_THRESHOLD_CHANNEL_B);
                let toPush = decToBytes(payload.numberOfDailyPeriodsUnderTheLeakThresholdChannelB);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.scanPeriodForChannelA != null) {
                bytes.push(SCAN_PERIOD_FOR_CHANNEL_A);
                bytes.push(decToBytes(payload.scanPeriodForChannelA / 10));
            }
            if (payload.tamperDetectionThresholdChannelA != null) {
                bytes.push(TAMPER_DETECTION_THRESHOLD_CHANNEL_A);
                bytes.push(decToBytes(payload.tamperDetectionThresholdChannelA));
            }
            if (payload.scanPeriodForChannelB != null) {
                bytes.push(SCAN_PERIOD_FOR_CHANNEL_B);
                bytes.push(decToBytes(payload.scanPeriodForChannelB / 10));
            }
            if (payload.tamperDetectionThresholdChannelB != null) {
                bytes.push(TAMPER_DETECTION_THRESHOLD_CHANNEL_B);
                bytes.push(decToBytes(payload.tamperDetectionThresholdChannelB));
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
