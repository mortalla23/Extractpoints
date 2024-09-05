/*

***********************This driver is written according to the documentation of the TEMP_TEMP2S_LORAWAN v2.0.1 attached in the specification********************************

*/

/*
............................................................................................................................
 this part is needed to map the bytes needed in uplink and downlink to some variables names
............................................................................................................................
*/

//  these variables are needed to decode the uplink
const PRODUCT_CONFIGURATION_1 = 0x10;
const PRODUCT_CONFIGURATION_2 = 0x11;
const PRODUCT_CONFIGURATION_3 = 0x12;
const NETWORK_CONFIGURATION = 0x20;
const KEEP_ALIVE = 0x30;
const REPLY_FRAME_TO_REGISTER_VALUE_REQUEST = 0x31;
const DATA_FRAME = 0x43;

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
const IDENTIFIER_OF_THE_PROBE_1 = 0x14;
const CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_1 = 0x15;
const IDENTIFIER_OF_THE_PROBE_2 = 0x16;
const CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_2 = 0x17;
const HIGH_THRESHOLD_VALUE_OF_THE_PROBE_1 = 0x18;
const VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1 = 0x19;
const LOW_THRESHOLD_VALUE_OF_THE_PROBE_1 = 0x1a;
const VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1 = 0x1b;
const HIGH_THRESHOLD_VALUE_OF_THE_PROBE_2 = 0x1c;
const VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2 = 0x1d;
const LOW_THRESHOLD_VALUE_OF_THE_PROBE_2 = 0x1e;
const VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2 = 0x1f;
const ACQUISITION_PERIOD = 0x20;
const SUPER_SAMPLING_FACTOR = 0x21;
const ACTIVATION_AND_DEACTIVATION_OF_THE_PROBES = 0x64;

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

const uplinkProductConfig1Type = "PRODUCT_CONFIGURATION_1";
const uplinkProductConfig2Type = "PRODUCT_CONFIGURATION_2";
const uplinkProductConfig3Type = "PRODUCT_CONFIGURATION_3";
const uplinkNetworkConfigType = "NETWORK_CONFIGURATION";
const uplinkKeepAliveType = "KEEP_ALIVE";
const uplinkReplyFrameToRegisterValueRequestStr = "REPLY_FRAME_TO_REGISTER_VALUE_REQUEST";
const uplinkDataType = "DATA";

const transmissionPeriodOfTheKeepAliveFrameStr = "TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME";
const transmissionPeriodOfDataSensorsStr = "TRANSMISSION_PERIOD_OF_DATA_SENSORS";
const confirmedModeActivationStr = "CONFIRMED_MODE_ACTIVATION";
const pinCodeStr = "PIN_CODE";
const globalOperationStr = "GLOBAL_OPERATION";
const identifierOfTheProbe1Str = "IDENTIFIER_OF_THE_PROBE_1";
const configuringTheEventBehaviorOfTheProbe1Str = "CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE1";
const identifierOfTheProbe2Str = "IDENTIFIER_OF_THE_PROBE_2";
const configuringTheEventBehaviorOfTheProbe2Str = "CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_2";
const highThresholdValueOfTheProbe1Str = "HIGH_THRESHOLD_VALUE_OF_THE_PROBE_1";
const valueOfTheHighThresholdHysteresisOfTheProbe1Str = "VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1";
const lowThresholdValueOfTheProbe1Str = "LOW_THRESHOLD_VALUE_OF_THE_PROBE_1";
const valueOfTheLowThresholdHysteresisOfTheProbe1Str = "VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1";
const highThresholdValueOfTheProbe2Str = "HIGH_THRESHOLD_VALUE_OF_THE_PROBE_2";
const valueOfTheHighThresholdHysteresisOfTheProbe2Str = "VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2";
const lowThresholdValueOfTheProbe2Str = "LOW_THRESHOLD_VALUE_OF_THE_PROBE_2";
const valueOfTheLowThresholdHysteresisOfTheProbe2Str = "VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2";
const acquisitionPeriodStr = "ACQUISITION_PERIOD";
const superSamplingFactorStr = "SUPER_SAMPLING_FACTOR";
const activationAndDeactivationOfTheProbesStr = "ACTIVATION_AND_DEACTIVATION_OF_THE_PROBES";

//  mapping the downlink message in a map with key = id and value = label
let downlinkMessageMap = new Map();
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_THE_KEEP_ALIVE_FRAME, transmissionPeriodOfTheKeepAliveFrameStr);
downlinkMessageMap.set(TRANSMISSION_PERIOD_OF_DATA_SENSORS, transmissionPeriodOfDataSensorsStr);
downlinkMessageMap.set(CONFIRMED_MODE_ACTIVATION, confirmedModeActivationStr);
downlinkMessageMap.set(PIN_CODE, pinCodeStr);
downlinkMessageMap.set(GLOBAL_OPERATION, globalOperationStr);
downlinkMessageMap.set(IDENTIFIER_OF_THE_PROBE_1, identifierOfTheProbe1Str);
downlinkMessageMap.set(CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_1, configuringTheEventBehaviorOfTheProbe1Str);
downlinkMessageMap.set(IDENTIFIER_OF_THE_PROBE_2, identifierOfTheProbe2Str);
downlinkMessageMap.set(CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_2, configuringTheEventBehaviorOfTheProbe2Str);
downlinkMessageMap.set(HIGH_THRESHOLD_VALUE_OF_THE_PROBE_1, highThresholdValueOfTheProbe1Str);
downlinkMessageMap.set(
    VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1,
    valueOfTheHighThresholdHysteresisOfTheProbe1Str,
);
downlinkMessageMap.set(LOW_THRESHOLD_VALUE_OF_THE_PROBE_1, lowThresholdValueOfTheProbe1Str);
downlinkMessageMap.set(
    VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1,
    valueOfTheLowThresholdHysteresisOfTheProbe1Str,
);
downlinkMessageMap.set(HIGH_THRESHOLD_VALUE_OF_THE_PROBE_2, highThresholdValueOfTheProbe2Str);
downlinkMessageMap.set(
    VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2,
    valueOfTheHighThresholdHysteresisOfTheProbe2Str,
);
downlinkMessageMap.set(LOW_THRESHOLD_VALUE_OF_THE_PROBE_2, lowThresholdValueOfTheProbe2Str);
downlinkMessageMap.set(
    VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2,
    valueOfTheLowThresholdHysteresisOfTheProbe2Str,
);
downlinkMessageMap.set(ACQUISITION_PERIOD, acquisitionPeriodStr);
downlinkMessageMap.set(SUPER_SAMPLING_FACTOR, superSamplingFactorStr);
downlinkMessageMap.set(ACTIVATION_AND_DEACTIVATION_OF_THE_PROBES, activationAndDeactivationOfTheProbesStr);

const parkModeStr = "PARK_MODE";
const productionModeStr = "PRODUCTION_MODE";
const testModeStr = "TEST_MODE";
const repliModeStr = "REPLI_MODE";

const noneStr = "NONE";
const lowOnlyStr = "LOW_ONLY";
const highOnlyStr = "HIGH_ONLY";
const lowAndHighStr = "LOW_AND_HIGH";

const onlyProbe1Str = "ONLY_PROBE_1_ACTIVATED";
const onlyProbe2Str = "ONLY_PROBE_2_ACTIVATED";
const bothProbeStr = "BOTH_PROBES_ARE_ACTIVATED";

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

//  if the value represent negative number of 2 bytes, we need to calculate complement
function complement2Byte2(hexToDec) {
    if (hexToDec < 0x8000) return hexToDec;
    else return -((hexToDec - 1) ^ 0xffff);
}
//  if the value represent negative number of 2 bytes, we need to calculate complement
function complement2Byte4(hexToDec) {
    if (hexToDec < 0x80000000) return hexToDec;
    else return -((hexToDec - 1) ^ 0xffffffff);
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

//  mapping the Configuratuion of the event behavior of Probe
function getConfigTheEventBehavior(value) {
    switch (value) {
        case 0x00:
            return noneStr;
        case 0x01:
            return lowOnlyStr;
        case 0x02:
            return highOnlyStr;
        case 0x03:
            return lowAndHighStr;
    }
}

//  mapping the Configuratuion of the event behavior of Probe for encoding
function encodeConfigTheEventBehavior(value) {
    switch (value) {
        case noneStr:
            return 0x00;
        case lowOnlyStr:
            return 0x01;
        case highOnlyStr:
            return 0x02;
        case lowAndHighStr:
            return 0x03;
    }
}

//  mapping the activationOfProbe
function getActivationOfProbe(value) {
    switch (value) {
        case 0:
            return onlyProbe1Str;
        case 1:
            return onlyProbe2Str;
        case 2:
            return bothProbeStr;
    }
}

//  mapping the activationOfProbe for encoding
function encodeActivationOfProbe(value) {
    switch (value) {
        case onlyProbe1Str:
            return 0;
        case onlyProbe2Str:
            return 1;
        case bothProbeStr:
            return 2;
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

//  function to set the data for both keep alive and data frame
function setData(payloadHex, result) {
    result.register.identifierOfTheProbe1 = {};
    result.register.identifierOfTheProbe1.identifier = hexToDec(payloadHex, 4, 6) >> 4;
    result.register.identifierOfTheProbe1.status = (hexToDec(payloadHex, 4, 6) & 0x0f) == 1;
    result.register.valueReadOnTheProbe1 = complement2Byte2(hexToDec(payloadHex, 6, 10)) / 10;

    result.register.identifierOfTheProbe2 = {};
    result.register.identifierOfTheProbe2.identifier = hexToDec(payloadHex, 10, 12) >> 4;
    result.register.identifierOfTheProbe2.status = (hexToDec(payloadHex, 10, 12) & 0x0f) == 1;
    result.register.valueReadOnTheProbe2 = complement2Byte2(hexToDec(payloadHex, 12, 16)) / 10;
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
    result.alarmActivatedOnProbe1 = ((status >> 3) & 0x01) == 1;
    result.alarmActivatedOnProbe2 = ((status >> 4) & 0x01) == 1;

    switch (code) {
        case PRODUCT_CONFIGURATION_1:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfig1Type;
            result.register = {};

            result.register.globalOperation = getGlobalOperation(hexToDec(payloadHex, 16, 18));

            if (result.register.globalOperation == productionModeStr) {
                result.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, 4, 6) * 600;
                result.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, 6, 8) * 600;
                result.register.acquisitionPeriod = hexToDec(payloadHex, 20, 22) * 60;
            } else if (result.register.globalOperation == testModeStr) {
                result.register.transmissionPeriodOfTheKeepAliveFrame = hexToDec(payloadHex, 4, 6) * 20;
                result.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, 6, 8) * 20;
                result.register.acquisitionPeriod = hexToDec(payloadHex, 20, 22) * 10;
            } else {
                result.register.transmissionPeriodOfTheKeepAliveFrame = 144;
                result.register.transmissionPeriodOfDataSensors = 6;
                result.register.acquisitionPeriod = 10;
            }

            result.register.identifierOfTheProbe1 = {};
            result.register.identifierOfTheProbe1.identifier = hexToDec(payloadHex, 8, 10) >> 4;
            result.register.configuringTheEventBehaviorOfTheProbe1 = getConfigTheEventBehavior(
                hexToDec(payloadHex, 10, 12) & 0x03,
            );

            result.register.identifierOfTheProbe2 = {};
            result.register.identifierOfTheProbe2.identifier = hexToDec(payloadHex, 12, 14) >> 4;
            result.register.configuringTheEventBehaviorOfTheProbe2 = getConfigTheEventBehavior(
                hexToDec(payloadHex, 14, 16) & 0x03,
            );

            result.register.activationAndDeactivationOfTheProbes = getActivationOfProbe(hexToDec(payloadHex, 18, 20));
            break;

        case PRODUCT_CONFIGURATION_2:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfig2Type;
            result.register = {};

            result.register.highThresholdValueOfTheProbe1 = complement2Byte2(hexToDec(payloadHex, 4, 8)) / 10;
            result.register.valueOfTheHighThresholdHysteresisOfTheProbe1 = hexToDec(payloadHex, 8, 10) / 10;
            result.register.lowThresholdValueOfTheProbe1 = complement2Byte2(hexToDec(payloadHex, 10, 14)) / 10;
            result.register.valueOfTheLowThresholdHysteresisOfTheProbe1 = hexToDec(payloadHex, 14, 16) / 10;
            result.register.superSamplingFactor = hexToDec(payloadHex, 16, 18);
            break;

        case PRODUCT_CONFIGURATION_3:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkProductConfig3Type;
            result.register = {};

            result.register.highThresholdValueOfTheProbe2 = complement2Byte2(hexToDec(payloadHex, 4, 8)) / 10;
            result.register.valueOfTheHighThresholdHysteresisOfTheProbe2 = hexToDec(payloadHex, 8, 10) / 10;
            result.register.lowThresholdValueOfTheProbe2 = complement2Byte2(hexToDec(payloadHex, 10, 14)) / 10;
            result.register.valueOfTheLowThresholdHysteresisOfTheProbe2 = hexToDec(payloadHex, 14, 16) / 10;
            break;

        case NETWORK_CONFIGURATION:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkNetworkConfigType;
            result.register = {};

            const option = hexToDec(payloadHex, 4, 6);
            result.register.adr = (option & 0x01) == 1;
            result.register.mode = getConnectionMode(hexToDec(payloadHex, 6, 8));
            break;

        case KEEP_ALIVE:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkKeepAliveType;
            result.register = {};

            setData(payloadHex, result);
            break;

        case REPLY_FRAME_TO_REGISTER_VALUE_REQUEST:
            result.type = uplinkReplyFrameToRegisterValueRequestStr;
            break;

        case DATA_FRAME:
            if (nbBytes != 11) {
                throw new Error(uplinkLengthError);
            }
            result.type = uplinkDataType;
            result.register = {};

            setData(payloadHex, result);
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

        case SPECIFIC_REGISTER_VALUE_REQUEST_FRAME:
            result.type = "SPECIFIC_REGISTER_VALUE_REQUEST_FRAME";
            result.payload = {};
            result.payload.type = "Temp2SpecificRegisterValueRequestFrame";
            result.payload.message = [];
            for (let i = 2; i < payloadHex.length; i += 2) {
                result.payload.message.push(downlinkMessageMap.get(hexToDec(payloadHex, i, i + 2)));
            }
            break;

        case FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS:
            result.type = "FRAME_FOR_UPDATING_THE_VALUE_OF_SPECIFIC_REGISTERS";
            result.payload = {};
            result.payload.type = "Temp2FrameForUpdatingTheValueOfSpecificRegisters";
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

                    case TRANSMISSION_PERIOD_OF_DATA_SENSORS:
                        result.payload.register.transmissionPeriodOfDataSensors = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
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

                    case IDENTIFIER_OF_THE_PROBE_1:
                        result.payload.register.identifierOfTheProbe1 = {};
                        result.payload.register.identifierOfTheProbe1.identifier = hexToDec(payloadHex, pos, pos + 2) >> 4;
                        pos += 2;
                        break;

                    case CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_1:
                        result.payload.register.configuringTheEventBehaviorOfTheProbe1 = getConfigTheEventBehavior(
                            hexToDec(payloadHex, pos, pos + 2) & 0x03,
                        );
                        pos += 2;
                        break;

                    case IDENTIFIER_OF_THE_PROBE_2:
                        result.payload.register.identifierOfTheProbe2 = {};
                        result.payload.register.identifierOfTheProbe2.identifier = hexToDec(payloadHex, pos, pos + 2) >> 4;
                        pos += 2;
                        break;

                    case CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_2:
                        result.payload.register.configuringTheEventBehaviorOfTheProbe2 = getConfigTheEventBehavior(
                            hexToDec(payloadHex, pos, pos + 2) & 0x03,
                        );
                        pos += 2;
                        break;

                    case HIGH_THRESHOLD_VALUE_OF_THE_PROBE_1:
                        result.payload.register.highThresholdValueOfTheProbe1 =
                            complement2Byte4(hexToDec(payloadHex, pos, pos + 8)) / 10;
                        pos += 8;
                        break;

                    case VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1:
                        result.payload.register.valueOfTheHighThresholdHysteresisOfTheProbe1 =
                            hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case LOW_THRESHOLD_VALUE_OF_THE_PROBE_1:
                        result.payload.register.lowThresholdValueOfTheProbe1 =
                            complement2Byte4(hexToDec(payloadHex, pos, pos + 8)) / 10;
                        pos += 8;
                        break;

                    case VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1:
                        result.payload.register.valueOfTheLowThresholdHysteresisOfTheProbe1 =
                            hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case HIGH_THRESHOLD_VALUE_OF_THE_PROBE_2:
                        result.payload.register.highThresholdValueOfTheProbe2 =
                            complement2Byte4(hexToDec(payloadHex, pos, pos + 8)) / 10;
                        pos += 8;
                        break;

                    case VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2:
                        result.payload.register.valueOfTheHighThresholdHysteresisOfTheProbe2 =
                            hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case LOW_THRESHOLD_VALUE_OF_THE_PROBE_2:
                        result.payload.register.lowThresholdValueOfTheProbe2 =
                            complement2Byte4(hexToDec(payloadHex, pos, pos + 8)) / 10;
                        pos += 8;
                        break;

                    case VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2:
                        result.payload.register.valueOfTheLowThresholdHysteresisOfTheProbe2 =
                            hexToDec(payloadHex, pos, pos + 2) / 10;
                        pos += 2;
                        break;

                    case ACQUISITION_PERIOD:
                        if (result.payload.register.globalOperation == productionModeStr) {
                            result.payload.register.acquisitionPeriod = hexToDec(payloadHex, pos, pos + 2) * 60;
                        } else if (result.payload.register.globalOperation == testModeStr) {
                            result.payload.register.acquisitionPeriod = hexToDec(payloadHex, pos, pos + 2) * 10;
                        } else {
                            result.payload.register.acquisitionPeriod = 10;
                        }
                        pos += 2;
                        break;

                    case SUPER_SAMPLING_FACTOR:
                        result.payload.register.superSamplingFactor = hexToDec(payloadHex, pos, pos + 2);
                        pos += 2;
                        break;

                    case ACTIVATION_AND_DEACTIVATION_OF_THE_PROBES:
                        result.payload.register.activationAndDeactivationOfTheProbes = getActivationOfProbe(
                            hexToDec(payloadHex, pos, pos + 2),
                        );
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
            if (payload.transmissionPeriodOfDataSensors != null) {
                bytes.push(TRANSMISSION_PERIOD_OF_DATA_SENSORS);
                bytes.push(decToBytes(payload.transmissionPeriodOfDataSensors));
            }
            if (payload.confirmedModeActivation != null) {
                bytes.push(CONFIRMED_MODE_ACTIVATION);
                bytes.push(booleanToByte(payload.confirmedModeActivation));
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
                bytes.push(encodeGlobalOperation(payload.globalOperation));
            }
            if (payload.identifierOfTheProbe1 != null) {
                bytes.push(IDENTIFIER_OF_THE_PROBE_1);
                bytes.push(decToBytes(payload.identifierOfTheProbe1.identifier));
            }
            if (payload.configuringTheEventBehaviorOfTheProbe1 != null) {
                bytes.push(CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_1);
                bytes.push(encodeConfigTheEventBehavior(payload.configuringTheEventBehaviorOfTheProbe1));
            }
            if (payload.identifierOfTheProbe2 != null) {
                bytes.push(IDENTIFIER_OF_THE_PROBE_2);
                bytes.push(decToBytes(payload.identifierOfTheProbe2.identifier));
            }
            if (payload.configuringTheEventBehaviorOfTheProbe2 != null) {
                bytes.push(CONFIGURING_THE_EVENT_BEHAVIOR_OF_THE_PROBE_2);
                bytes.push(encodeConfigTheEventBehavior(payload.configuringTheEventBehaviorOfTheProbe2));
            }
            if (payload.highThresholdValueOfTheProbe1 != null) {
                bytes.push(HIGH_THRESHOLD_VALUE_OF_THE_PROBE_1);
                const toPush = decToBytes(payload.highThresholdValueOfTheProbe1 * 10);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.valueOfTheHighThresholdHysteresisOfTheProbe1 != null) {
                bytes.push(VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1);
                bytes.push(decToBytes(payload.valueOfTheHighThresholdHysteresisOfTheProbe1 * 10));
            }
            if (payload.lowThresholdValueOfTheProbe1 != null) {
                bytes.push(LOW_THRESHOLD_VALUE_OF_THE_PROBE_1);
                const toPush = decToBytes(payload.lowThresholdValueOfTheProbe1 * 10);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.valueOfTheLowThresholdHysteresisOfTheProbe1 != null) {
                bytes.push(VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_1);
                bytes.push(decToBytes(payload.valueOfTheLowThresholdHysteresisOfTheProbe1 * 10));
            }
            if (payload.highThresholdValueOfTheProbe2 != null) {
                bytes.push(HIGH_THRESHOLD_VALUE_OF_THE_PROBE_2);
                const toPush = decToBytes(payload.highThresholdValueOfTheProbe2 * 10);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.valueOfTheHighThresholdHysteresisOfTheProbe2 != null) {
                bytes.push(VALUE_OF_THE_HIGH_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2);
                bytes.push(decToBytes(payload.valueOfTheHighThresholdHysteresisOfTheProbe2 * 10));
            }
            if (payload.lowThresholdValueOfTheProbe2 != null) {
                bytes.push(LOW_THRESHOLD_VALUE_OF_THE_PROBE_2);
                const toPush = decToBytes(payload.lowThresholdValueOfTheProbe2 * 10);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes.push(toPush);
            }
            if (payload.valueOfTheLowThresholdHysteresisOfTheProbe2 != null) {
                bytes.push(VALUE_OF_THE_LOW_THRESHOLD_HYSTERESIS_OF_THE_PROBE_2);
                bytes.push(decToBytes(payload.valueOfTheLowThresholdHysteresisOfTheProbe2 * 10));
            }
            if (payload.acquisitionPeriod != null) {
                bytes.push(ACQUISITION_PERIOD);
                if (payload.globalOperation == productionModeStr) {
                    bytes.push(decToBytes(payload.acquisitionPeriod / 60));
                } else if (payload.globalOperation == testModeStr) {
                    bytes.push(decToBytes(payload.acquisitionPeriod / 10));
                } else {
                    bytes.push(decToBytes(payload.acquisitionPeriod));
                }
            }
            if (payload.superSamplingFactor != null) {
                bytes.push(SUPER_SAMPLING_FACTOR);
                bytes.push(decToBytes(payload.superSamplingFactor));
            }
            if (payload.activationAndDeactivationOfTheProbes != null) {
                bytes.push(ACTIVATION_AND_DEACTIVATION_OF_THE_PROBES);
                bytes.push(encodeActivationOfProbe(payload.activationAndDeactivationOfTheProbes));
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
