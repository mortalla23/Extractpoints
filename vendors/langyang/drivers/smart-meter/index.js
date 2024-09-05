/*
............................................................................................................................
 this part is needed to avoid re-using strings
............................................................................................................................
*/
const uploadPicType = "upload pic";
const checkCompletionType = "check the completion of picture";
const uploadResultValueType = "upload result value";
const uploadErrListType = "upload errlist";
const serverAbnormalType = "server abnormal";
const deviceRegistrationType = "device registration";
const configurationType = "configuration on the cloud";


const devUploadDataEvent = "dev upload data";
const devUploadStateEvent = "dev upload state";
const devUploadErrorEvent = "dev upload error";
const devResponseServerCommandEvent = "dev response server command";
const serverResponseDataUploadEvent = "server response data upload";
const serverResponseStateUploadEvent = "server response state upload";
const serverResponseErrUploadEvent = "server response err upload";
const serverAbnormalEvent = "server abnormal";

const nbIotCommType = "NB-IoT";
const wifiCommType = "WIFI";
const loraCommType = "LoRa";

const noPicUpload = "no pic upload";
const picSize320x240 = "320*240";
const picSize640x480 = "640*480";

const binaryBnpColor = "binary bmp";
const greyColor = "Grey";
const rgbColor = "RGB";

const effectiveStr = "effective";
const invalidStr = "invalid";
const unrecognizedStr = "unrecognized";

const failedStr = "failed";
const successStr = "success";
const successUpdateStr = "success, firmware needs to be updated";
const serverErrorStr = "server error";
const devNotFoundStr = "device does not exist";

const alarmStr = "alarm";
const intervalStr = "interval";

const completeStr = "complete";
const localStr = "local";

const defaultRunModeStr = "default run mode";
const cloudAcquisitionModeStr = "cloud acquisition mode";
const localGenerationModeStr = "local generation mode";

const batterySupplyStr = "battery supply";
const externalPowerSupplyStr = "external power supply";

const deviceInitFailedStr = "device initialization failed, hardware error";
const communicationInitTimeoutStr = "communication initialization timeout, network abnormal";
const sendMessageErrorStr = "send message error";
const deviceRegistrationTimeoutStr = "device registration timeout";
const serverReplyErrorStr = "server reply error";
const picUploadTimeoutStr = "picture upload timeout";
const picUploadMessageErrorStr = "picture upload message error";
const serverReplyMessageErrorStr = "server reply message error";
const imageConfigCaptureTimedOutStr = "image configuration capture timed out";
const recognitionResultReportingTimeoutStr = "recognition result reporting timeout";
const reportErrorListTimeoutStr = "report error list timeout";
const deviceOfflineStr = "device offline";
const communicationHardwareErrorStr = "communication hardware error";
const communicationInitializationFailedStr = "communication initialization failed";
const serverConnectionFailedStr = "server connection failed";
const communicationTimeoutStr = "communication timeout";
const deviceRegistrationFailedStr = "device registration failed";
const serverRegistrationServiceAbnormalStr = "server registration service abnormal";
const cameraFaultyStr = "camera faulty";
const communicationWithStm8ErrorStr = "communication with stm8 error";
const loadTheRecognitionModelErrorStr = "load the recognition model error";
const jpgAlgorithmErrorStr = "jpg algorithm error";
const configurationFileWithoutImageStr = "configuration file without image";
const incorrectConfigurationFileParametersStr = "incorrect configuration file parameters";
const recognitionErrorNoRecognitionStr = "recognition error, no recognition result";
const loraModuleCommunicationErrorStr = "lora module communication error";
const deviceSelfRecognitionFailedStr = "device self-registration failed";
const flashReadWriteErrorStr = "flash read/write error";
const lackOfModelStr = "lack of model";
const falseDeviceTypeStr = "false device type";
const deviceTypeErrorByFlashReadingStr = "device type error by FLASH reading";
const imageConfigLengthErrorByFlashReadingStr = "image configuration length error by FLASH reading";
const rebootTimeoutStr = "reboot timeout";
const otaErrorStr = "OTA error";
const errorInObtainingTheAddressOfInfraredMeterStr = "error in obtaining the address of the infrared meter";

const uplinkEmptyError = "invalid uplink payload: no data received";
const downlinkEmptyError = "invalid downlink payload: no data received";
const uplinkLengthError = "invalid uplink payload: wrong length";
const uplinkLoadLengthError = "invalid uplink payload: wrong load length";
const downlinkLengthError = "invalid downlink payload: wrong length";
const downlinkLoadLengthError = "invalid downlink payload: wrong load length";
const uplinkMessageTypeError = "invalid uplink payload: unknown message type";
const downlinkMessageTypeError = "invalid downlink payload: unknown message type";
const dataUpIntervalError = "invalid downlink payload: data up interval must be less than 12";
const dataReportIntervalError = "invalid downlink payload: data report interval must be less than 12";
const messageRepeatError = "message repeat number must be between 1 and 10";

/*
............................................................................................................................
 this part is needed to map the bytes needed in uplink and downlink to some variables names
............................................................................................................................
*/

//  Version 5 Message Type decoding
function getMessageType(value) {
    switch (value) {
        case 51:
            return deviceRegistrationType;
        case 57:
            return uploadPicType;
        case 58:
            return checkCompletionType;
        case 59:
            return configurationType;
        case 60:
            return uploadResultValueType;
        case 101:
            return uploadErrListType;
        case 201:
            return serverAbnormalType;
        default:
            throw new Error("invalid payload: unknown message type");
    }
}

// Event ID decoding
function getEventId(value) {
    switch (value) {
        case 1:
            return devUploadDataEvent;
        case 2:
            return devUploadStateEvent;
        case 3:
            return devUploadErrorEvent;
        case 4:
            return devResponseServerCommandEvent;
        case 8:
            return serverResponseDataUploadEvent;
        case 9:
            return serverResponseStateUploadEvent;
        case 10:
            return serverResponseErrUploadEvent;
        case 11:
            return serverAbnormalEvent;
        default:
            throw new Error("invalid payload: unknown event id");
    }
}

// Communication type decoding
function getCommType(value) {
    switch (value) {
        case 0:
            return nbIotCommType;
        case 1:
            return wifiCommType;
        case 2:
            return loraCommType;
        default:
            throw new Error("invalid payload: unknown communication type");
    }
}

// Picture size decoding
function getPicSize(value) {
    switch (value) {
        case 0:
            return noPicUpload;
        case 1:
            return picSize320x240;
        case 2:
            return picSize640x480;
        default:
            throw new Error("invalid payload: unknown pic size");
    }
}

// Completion decoding
function getCompletion(value) {
    switch (value) {
        case 0:
            return localStr;
        case 1:
            return completeStr;
        default:
            throw new Error("invalid payload: unknown completion");
    }
}

// Color attribute decoding
function getColorAttribute(value) {
    switch (value) {
        case 0:
            return binaryBnpColor;
        case 1:
            return greyColor;
        case 3:
            return rgbColor;
        default:
            throw new Error("invalid payload: unknown color attribute");
    }
}

// Effectiveness decoding
function getEffectivness(value) {
    switch (value) {
        case 0:
            return effectiveStr;
        case 1:
            return invalidStr;
        case 2:
            return unrecognizedStr;
        default:
            throw new Error("invalid payload: unknown effectiveness");
    }
}

// State code decoding
function getStateCode(value) {
    switch (value) {
        case 0:
            return failedStr;
        case 1:
            return successStr;
        case 2:
            return successUpdateStr;
        case 3:
            return serverErrorStr;
        case 4:
            return devNotFoundStr;
        default:
            throw new Error("invalid payload: unknown state code");
    }
}

// Wakeup mode decoding
function getWakeupMode(value) {
    switch (value) {
        case 1:
            return alarmStr;
        case 2:
            return intervalStr;
        default:
            throw new Error("invalid payload: unknown wake up mode");
    }
}

//  Run mode decoding
function getRunMode(value) {
    switch (value) {
        case 0:
            return defaultRunModeStr;
        case 1:
            return cloudAcquisitionModeStr;
        case 2:
            return localGenerationModeStr;
        default:
            throw new Error("invalid payload: unknown run mode");
    }
}

// Error list decoding
function getError(value) {
    if (value >= 0 && value <= 33) {
        return deviceInitFailedStr;
    } else if (value == 34) {
        return communicationInitTimeoutStr;
    } else if ((value >= 35 && value <= 42) || (value >= 51 && value <= 54) || (value >= 115 && value <= 118) || (value >= 147 && value <= 150) || (value >= 163 && value <= 166)) {
        return sendMessageErrorStr;
    } else if (value == 50) {
        return deviceRegistrationTimeoutStr;
    } else if ((value >= 55 && value <= 58) || (value >= 151 && value <= 153) || (value >= 167 && value <= 169)) {
        return serverReplyErrorStr;
    } else if (value == 98) {
        return picUploadTimeoutStr;
    } else if ((value >= 99 && value <= 102)) {
        return picUploadMessageErrorStr;
    } else if ((value >= 103 && value <= 106) || (value >= 119 && value <= 121)) {
        return serverReplyMessageErrorStr;
    } else if (value == 114) {
        return imageConfigCaptureTimedOutStr;
    } else if (value == 146) {
        return recognitionResultReportingTimeoutStr;
    } else if (value == 162) {
        return reportErrorListTimeoutStr;
    } else if (value == 200) {
        return deviceOfflineStr;
    } else if (value == 225) {
        return communicationHardwareErrorStr;
    } else if (value == 226) {
        return communicationInitializationFailedStr;
    } else if (value == 227) {
        return serverConnectionFailedStr;
    } else if (value == 228) {
        return communicationTimeoutStr;
    } else if(value ==229){
        return deviceRegistrationFailedStr;
    } else if(value == 230){
        return serverRegistrationServiceAbnormalStr;
    } else if(value == 231 || value == 232){
        return cameraFaultyStr;
    } else if(value ==233){
        return communicationWithStm8ErrorStr;
    } else if(value == 234){
        return loadTheRecognitionModelErrorStr;
    } else if(value == 235){
        return jpgAlgorithmErrorStr;
    }else if(value == 236){
        return configurationFileWithoutImageStr;
    }else if(value == 237){
        return incorrectConfigurationFileParametersStr;
    }else if(value == 238){
        return recognitionErrorNoRecognitionStr;
    }else if(value == 239){
        return loraModuleCommunicationErrorStr;
    }else if(value == 240){
        return deviceSelfRecognitionFailedStr;
    }else if(value >= 241 && value <= 244){
        return flashReadWriteErrorStr;
    }else if(value == 245){
        return lackOfModelStr;
    }else if(value == 246){
        return falseDeviceTypeStr;
    }else if(value == 247){
        return deviceTypeErrorByFlashReadingStr;
    }else if(value == 248){
        return imageConfigLengthErrorByFlashReadingStr;
    }else if(value == 251){
        return rebootTimeoutStr;
    }else if(value == 252){
        return otaErrorStr;
    }else if(value == 253){
        return errorInObtainingTheAddressOfInfraredMeterStr;
    }else {
        throw new Error("invalid payload: unknown error in error list");
    }
}

//  Power supply decoding
function getPowerSupply(value) {
    switch (value) {
        case 0:
            return batterySupplyStr;
        case 1:
            return externalPowerSupplyStr;
        default:
            throw new Error("invalid payload: unknown power supply");
    }
}

//  Version 5 Message Type encoding
function encodeMessageType(value) {
    switch (value) {
        case deviceRegistrationType:
            return 51;
        case uploadPicType:
            return 57;
        case checkCompletionType:
            return 58;
        case configurationType:
            return 59;
        case uploadResultValueType:
            return 60;
        case uploadErrListType:
            return 101;
        case serverAbnormalType:
            return 201;
        default:
            throw new Error("invalid payload: unknown message type");
    }
}

// Event ID encoding
function encodeEventId(value) {
    switch (value) {
        case devUploadDataEvent:
            return 1;
        case devUploadStateEvent:
            return 2;
        case devUploadErrorEvent:
            return 3;
        case devResponseServerCommandEvent:
            return 4;
        case serverResponseDataUploadEvent:
            return 8;
        case serverResponseStateUploadEvent:
            return 9;
        case serverResponseErrUploadEvent:
            return 10;
        case serverAbnormalEvent:
            return 11;
        default:
            throw new Error("invalid payload: unknown event id");
    }
}

// State code encoding
function encodeStateCode(value) {
    switch (value) {
        case failedStr:
            return 0;
        case successStr:
            return 1;
        case successUpdateStr:
            return 2;
        case serverErrorStr:
            return 3;
        case devNotFoundStr:
            return 4;
        default:
            throw new Error("invalid payload: unknown state code");
    }
}

// Wakeup mode encoding
function encodeWakeupMode(value) {
    switch (value) {
        case alarmStr:
            return 1;
        case intervalStr:
            return 2;
        default:
            throw new Error("invalid payload: unknown wake up mode");
    }
}

// Picture size encoding
function encodePicSize(value) {
    switch (value) {
        case noPicUpload:
            return 0;
        case picSize320x240:
            return 1;
        case picSize640x480:
            return 2;
        default:
            throw new Error("invalid payload: unknown pic size");
    }
}

// Completion encoding
function encodeCompletion(value) {
    switch (value) {
        case localStr:
            return 0;
        case completeStr:
            return 1;
        default:
            throw new Error("invalid payload: unknown completion");
    }
}

// Color attribute encoding
function encodeColorAttribute(value) {
    switch (value) {
        case binaryBnpColor:
            return 0;
        case greyColor:
            return 1;
        case rgbColor:
            return 3;
        default:
            throw new Error("invalid payload: unknown color attribute");
    }
}

//  Run mode encoding
function encodeRunMode(value) {
    switch (value) {
        case defaultRunModeStr:
            return 0;
        case cloudAcquisitionModeStr:
            return 1;
        case 2:
            return localGenerationModeStr;
        default:
            throw new Error("invalid payload: unknown run mode");
    }
}

//  Power supply encoding
function encodePowerSupply(value) {
    switch (value) {
        case batterySupplyStr:
            return 0;
        case externalPowerSupplyStr:
            return 1;
        default:
            throw new Error("invalid payload: unknown power supply");
    }
}

/*
............................................................................................................................
 this part is needed to convert from/to several types of data
............................................................................................................................
*/

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

//  convert a string hex to decimal by defining also the starting and ending positions
function hexToDec(payloadHex, beginPos, endPos) {
    if (payloadHex == null || payloadHex.length === 0) return 0;
    return parseInt(payloadHex.substring(beginPos, endPos), 16);
}

//  convert a string hex to signed decimal by defining the size
function signedHexToDec(payloadHex, beginPos, endPos) {
    const result = hexToDec(payloadHex, beginPos, endPos);
    let size = (endPos - beginPos) / 2;
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

// convert a decimal to an array of bytes
function decToBytes(number) {
    if (number < 0) {
        number = 0xffff + number + 1;
    }
    let result = number.toString(16);
    if (result.length % 2 !== 0) {
        result = "0".concat(result);
    }
    return hexToBytes(result);
}

/*
............................................................................................................................
 this part is implemented by us, four javascript functions that a driver can declare to perform encoding and decoding tasks.
............................................................................................................................
*/

//  this function used by the driver to decode the uplink and return an object decoded
function decodeUplink(input) {
    let result = {};
    let index = 0;
    let payload;
    if (input.bytes) {
        if (typeof input.bytes !== "string") {
            payload = bytesToHex(input.bytes);
        } else {
            payload = input.bytes;
        }
    } else {
        throw new Error(uplinkEmptyError);
    }
    if (payload.length === 12) {
        result.dummyData = payload.slice(index, index + 8);
        index += 8;
        result.crc = payload.slice(index, index + 4);
        return result;
    }
    const allDataLength = payload.length;
    result.version = hexToDec(payload, index, index + 1);
    index += 1;
    result.eventId = getEventId(hexToDec(payload, index, index + 1));
    index += 1;
    result.messageLength = hexToDec(payload, index, index + 4);
    index += 4;
    const messageLength = (allDataLength - 4) / 2;
    if (messageLength !== result.messageLength) {
        throw new Error(uplinkLengthError);
    }
    result.encryptionEnabled = hexToDec(payload, index, index + 1) === 1;
    index += 1;
    result.crcEnabled = hexToDec(payload, index, index + 1) === 1;
    index += 1;
    const reservedSpace = (hexToDec(payload, index, index + 2) >> 3) & 0x07;
    result.communicationType = getCommType(hexToDec(payload, index, index + 2) & 0x07);
    index += 2;
    index += 2 * reservedSpace;
    result.messageType = getMessageType(hexToDec(payload, index, index + 2));
    index += 2;
    result.loadLength = hexToDec(payload, index, index + 4);
    index += 4;
    const loadLength = (allDataLength - index - 4) / 2;
    if (loadLength !== result.loadLength) {
        throw new Error(uplinkLoadLengthError);
    }
    result.messageCnt = hexToDec(payload, index, index + 2);
    index += 2;

    switch (result.messageType) {
        case deviceRegistrationType:
            let major = hexToDec(payload, index, index + 2);
            index += 2;
            let minor = hexToDec(payload, index, index + 2);
            index += 2;
            let patch = hexToDec(payload, index, index + 2);
            index += 2;
            result.firmwareVersion = major + "." + minor + "." + patch;
            break;
        case configurationType:
            break;
        case uploadPicType:
            result.picName = hexToDec(payload, index, index + 8);
            index += 8;
            result.totalPacketsNumber = hexToDec(payload, index, index + 4);
            index += 4;
            result.currentPacketNumber = hexToDec(payload, index, index + 4);
            index += 4;
            const dataLength = result.loadLength - 9;
            result.picData = payload.slice(index, index + dataLength);
            index += dataLength;
            break;
        case checkCompletionType:
            result.picSize = getPicSize(hexToDec(payload, index, index + 2) >> 5);
            if (result.picSize !== noPicUpload) {
                result.completion = getCompletion((hexToDec(payload, index, index + 2) >> 3) & 0x03);
                result.colorAttribute = getColorAttribute(hexToDec(payload, index, index + 2) & 0x07);
                index += 2;
                result.compressionQuality = hexToDec(payload, index, index + 2);
                index += 2;
                result.picName = hexToDec(payload, index, index + 8);
            }
            index += 8;
            break;
        case uploadResultValueType:
            result.power = hexToDec(payload, index, index + 4);
            index += 4;
            result.uploadDataSum = hexToDec(payload, index, index + 2);
            index += 2;
            if (result.uploadDataSum > 0) {
                result.uploadData = [];
            }
            for (let i = 1; i <= result.uploadDataSum; i++) {
                let newData = {};
                newData.timestamp = hexToDec(payload, index, index + 8);
                newData.isoDate = new Date(newData.timestamp * 1000).toISOString();
                index += 8;
                newData.finalResult = signedHexToDec(payload, index, index + 8);
                index += 8;
                newData.effectiveness = getEffectivness(hexToDec(payload, index, index + 1));
                index += 2;
                newData.numberOfDecimalPlaces = hexToDec(payload, index, index + 2);
                newData.finalResultFloat = newData.finalResult / (Math.pow(10, newData.numberOfDecimalPlaces));
                index += 2;
                newData.numberOfDigits = hexToDec(payload, index, index + 1);
                index += 1;
                newData.numberOfRecognizer = hexToDec(payload, index, index + 1);
                index += 1;
                result.uploadData.push(newData);
            }
            break;
        case uploadErrListType:
            result.errDataSum = hexToDec(payload, index, index + 2);
            index += 2;
            if (result.errDataSum > 0) {
                result.errData = [];
            }
            for (let i = 1; i <= result.errDataSum; i++) {
                let newData = {};
                newData.timestamp = hexToDec(payload, index, index + 8);
                newData.isoDate = new Date(newData.timestamp * 1000).toISOString();
                index += 8;
                newData.errSum = hexToDec(payload, index, index + 2);
                index += 2;
                if (newData.errSum > 0) {
                    newData.errList = [];
                }
                for (var j = 1; j <= newData.errSum; j++) {
                    newData.errList.push(getError(hexToDec(payload, index, index + 2)));
                    index += 2;
                }
                result.errData.push(newData);
            }
            break;
        default:
            throw new Error(uplinkMessageTypeError);
    }

    result.crc = payload.slice(index, index + 4);
    return result;
}

//  this function used by the driver to decode the downlink and return an object decoded
function decodeDownlink(input) {
    let result = {};
    let index = 0;
    let payload;
    if (input.bytes) {
        if (typeof input.bytes !== "string") {
            payload = bytesToHex(input.bytes);
        } else {
            payload = input.bytes;
        }
    } else {
        throw new Error(downlinkEmptyError);
    }

    if (payload.length === 12) {
        result.dummyData = payload.slice(index, index + 8);
        index += 8;
        result.crc = payload.slice(index, index + 4);
        return result;
    }

    const allDataLength = payload.length;
    result.version = hexToDec(payload, index, index + 1);
    index += 1;
    result.eventId = getEventId(hexToDec(payload, index, index + 1));
    index += 1;
    result.messageLength = hexToDec(payload, index, index + 4);
    index += 4;
    const messageLength = (allDataLength - 4) / 2;
    if (messageLength !== result.messageLength) {
        throw new Error(downlinkLengthError);
    }
    result.enableEncryption = hexToDec(payload, index, index + 1) === 1;
    index += 1;
    result.enableCrc = hexToDec(payload, index, index + 1) === 1;
    index += 1;
    result.messageType = getMessageType(hexToDec(payload, index, index + 2));
    index += 2;
    result.loadLength = hexToDec(payload, index, index + 4);
    index += 4;
    const loadLength = (allDataLength - index - 4) / 2;
    if (loadLength !== result.loadLength) {
        throw new Error(downlinkLoadLengthError);
    }
    result.stateCode = getStateCode(hexToDec(payload, index, index + 2));
    index += 2;
    if (result.stateCode === failedStr) {
        index = allDataLength - 4;
        result.crc = result.crc = payload.slice(index, index + 4);
        return result;
    }
    if (result.messageType !== configurationType) {
        result.messageCnt = hexToDec(payload, index, index + 2);
        index += 2;
    }

    switch (result.messageType) {
        case deviceRegistrationType:
            result.timeZone = hexToDec(payload, index, index + 2);
            index += 2;
            result.currentTimestamp = hexToDec(payload, index, index + 8);
            result.isoDate = new Date(result.currentTimestamp * 1000).toISOString();
            index += 8;
            result.runMode = getRunMode(hexToDec(payload, index, index + 1));
            index += 1;
            result.dataReportInterval = hexToDec(payload, index, index + 1);
            if (result.dataReportInterval > 12) {
                throw new Error(dataReportIntervalError);
            }
            index += 1;
            result.wakeupMode = getWakeupMode(hexToDec(payload, index, index + 2));
            index += 2;
            if (result.wakeupMode === intervalStr) {
                result.wakeupInterval = hexToDec(payload, index, index + 4);
                index += 4;
            } else {
                result.alarmSum = hexToDec(payload, index, index + 2);
                index += 2;
                result.wakeupAlarm = [];
                for (let i = 0; i < result.alarmSum; i++) {
                    let hours = hexToDec(payload, index, index + 2);
                    if (hours < 10) {
                        hours = "0".concat(hours);
                    }
                    index += 2;
                    let minutes = hexToDec(payload, index, index + 2);
                    if (minutes < 10) {
                        minutes = "0".concat(minutes);
                    }
                    index += 2;
                    result.wakeupAlarm.push(hours + ":" + minutes);
                }
            }
            result.wakeupSecondsPara = hexToDec(payload, index, index + 2);
            index += 2;
            result.picSize = getPicSize(hexToDec(payload, index, index + 2) >> 5);
            result.completion = getCompletion((hexToDec(payload, index, index + 2) >> 3) & 0x03);
            result.colorAttribute = getColorAttribute(hexToDec(payload, index, index + 2) & 0x07);
            index += 2;
            if (result.picSize !== noPicUpload) {
                result.compressionQuality = hexToDec(payload, index, index + 2);
                index += 2;
            }
            result.brightness = hexToDec(payload, index, index + 2);
            index += 2;
            result.TMUpdate = hexToDec(payload, index, index + 2);
            index += 2;
            if (result.TMUpdate > 0) {
                result.TMIndex = [];
                result.TMLenArray = [];
            }
            for (let i = 1; i <= result.TMUpdate; i++) {
                result.TMIndex.push(hexToDec(payload, index, index + 2));
                index += 2;
            }
            for (let i = 1; i <= result.TMUpdate; i++) {
                result.TMLenArray.push(hexToDec(payload, index, index + 4));
                index += 4;
            }
            result.powerSupply = getPowerSupply(hexToDec(payload, index, index + 2));
            index += 2;
            result.isNewBattery = hexToDec(payload, index, index + 2) === 1;
            index += 2;
            result.batteryCapacity = hexToDec(payload, index, index + 4) / 100;
            index += 4;
            result.channelSelection = "lora";
            index += 2;
            result.messageRepeatNumber = hexToDec(payload, index, index + 2);
            index += 2;
            if (result.messageRepeatNumber < 1 || result.messageRepeatNumber > 10) {
                throw new Error(messageRepeatError);
            }
            result.devType = hexToDec(payload, index, index + 4);
            index += 4;
            result.isFirstRegistration = hexToDec(payload, index, index + 2) === 1;
            index += 2;
            result.isRotated = hexToDec(payload, index, index + 2) === 1;
            index += 2;
            result.isCaptureManually = hexToDec(payload, index, index + 2) === 1;
            index += 2;
            if (result.isCaptureManually) {
                result.lengthOfCapturePara = hexToDec(payload, index, index + 2);
                index += 2;
                result.capturePara = [];
                for (let i = 1; i <= result.lengthOfCapturePara; i++) {
                    result.capturePara.push(hexToDec(payload, index, index + 2));
                    index += 2;
                }
            }
            break;
        case configurationType:
            let configurationLength = (loadLength - 1) * 2;
            result.configuration = payload.slice(index, index + configurationLength);
            index += configurationLength;
            break;
        case checkCompletionType:
            result.lostNum = hexToDec(payload, index, index + 4);
            index += 4;
            if (result.lostNum > 0) {
                result.lostPacketsNum = [];
            }
            for (let i = 1; i <= result.lostNum; i++) {
                result.lostPacketsNum.push(hexToDec(payload, index, index + 4));
                index += 4;
            }
            break;
        case uploadResultValueType:
            result.currentTimestamp = hexToDec(payload, index, index + 8);
            result.isoDate = new Date(result.currentTimestamp * 1000).toISOString();
            index += 8;
            result.runMode = getRunMode(hexToDec(payload, index, index + 1));
            index += 1;
            result.dataUpInterval = hexToDec(payload, index, index + 1);
            if (result.dataUpInterval > 12) {
                throw new Error(dataUpIntervalError);
            }
            index += 1;
            result.wakeupMode = getWakeupMode(hexToDec(payload, index, index + 2));
            index += 2;
            if (result.wakeupMode === intervalStr) {
                result.wakeupInterval = hexToDec(payload, index, index + 4);
                index += 4;
            } else {
                result.alarmSum = hexToDec(payload, index, index + 2);
                index += 2;
                result.wakeupAlarm = [];
                for (let i = 0; i < result.alarmSum; i++) {
                    let hours = hexToDec(payload, index, index + 2);
                    if (hours < 10) {
                        hours = "0".concat(hours);
                    }
                    index += 2;
                    let minutes = hexToDec(payload, index, index + 2);
                    if (minutes < 10) {
                        minutes = "0".concat(minutes);
                    }
                    index += 2;
                    result.wakeupAlarm.push(hours + ":" + minutes);
                }
            }
            result.picSize = getPicSize(hexToDec(payload, index, index + 2) >> 5);
            result.completion = getCompletion((hexToDec(payload, index, index + 2) >> 3) & 0x03);
            result.colorAttribute = getColorAttribute(hexToDec(payload, index, index + 2) & 0x07);
            index += 2;
            if (result.picSize !== noPicUpload) {
                result.compressionQuality = hexToDec(payload, index, index + 2);
                index += 2;
            }
            result.brightness = hexToDec(payload, index, index + 2);
            index += 2;
            //  reserved
            index += 4;
            break;
        case serverAbnormalType:
            break;
        default:
            throw new Error(downlinkMessageTypeError);
    }
    result.crc = payload.slice(index, index + 4);
    return result;
}

//  this function used by the driver to encode the downlink and return an object contains:
//  * bytes: array of numbers as it will be sent to the device.

function encodeDownlink(input) {
    let result = {};
    result.fPort = 1;
    let bytes = [];
    if (input == null) {
        throw new Error(downlinkEmptyError);
    }

    if (input.dummyData != null) {
        const toPush = hexToBytes(input.dummyData);
        while (toPush.length < 4) {
            toPush.unshift(0x00);
        }
        bytes = bytes.concat(toPush);
        if (input.crc != null) {
            const toPush = hexToBytes(input.crc);
            while (toPush.length < 2) {
                toPush.unshift(0x00);
            }
            bytes = bytes.concat(toPush);
        }
        result.bytes = bytes;
        return result;
    }

    if (input.version != null && input.eventId != null) {
        const version = input.version;
        const eventId = encodeEventId(input.eventId);
        const toPush = version << 4 | eventId;
        bytes = bytes.concat(toPush);
    }

    if (input.messageLength != null) {
        const toPush = decToBytes(input.messageLength);
        while (toPush.length < 2) {
            toPush.unshift(0x00);
        }
        bytes = bytes.concat(toPush);
    }

    if (input.enableEncryption != null && input.enableCrc != null) {
        const encryption = input.enableEncryption === true ? 1 : 0;
        const crc = input.enableCrc === true ? 1 : 0;
        const toPush = encryption << 4 | crc;
        bytes = bytes.concat(toPush);
    }

    if (input.messageType != null) {
        bytes = bytes.concat(encodeMessageType(input.messageType));
    }

    if (input.loadLength != null) {
        const toPush = decToBytes(input.loadLength);
        while (toPush.length < 2) {
            toPush.unshift(0x00);
        }
        bytes = bytes.concat(toPush);
    }

    if (input.stateCode != null) {
        bytes = bytes.concat(encodeStateCode(input.stateCode));
        if (input.stateCode === failedStr) {
            for (let i = 0; i < input.loadLength - 1; i++) {
                bytes = bytes.concat(0x00);
            }
            if (input.crc != null) {
                const toPush = hexToBytes(input.crc);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            result.bytes = bytes;
            return result;
        }
    }

    if (input.configuration != null) {
        bytes = bytes.concat(hexToBytes(input.configuration));
    }

    if (input.messageCnt != null) {
        bytes = bytes.concat(input.messageCnt);
    }

    switch (input.messageType) {
        case deviceRegistrationType:
            if (input.timeZone != null) {
                bytes = bytes.concat(input.timeZone);
            }
            if (input.currentTimestamp != null) {
                const toPush = decToBytes(input.currentTimestamp);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            if (input.runMode != null && input.dataReportInterval != null) {
                const runMode = encodeRunMode(input.runMode);
                if (input.dataReportInterval > 12) {
                    throw new Error(dataReportIntervalError);
                }
                const dataReportInterval = input.dataReportInterval;
                const toPush = runMode << 4 | dataReportInterval;
                bytes = bytes.concat(toPush);
            }
            if (input.wakeupMode != null) {
                bytes = bytes.concat(encodeWakeupMode(input.wakeupMode));
            }
            if (input.wakeupMode === intervalStr && input.wakeupInterval != null) {
                const toPush = decToBytes(input.wakeupInterval);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            if (input.wakeupMode === alarmStr && input.alarmSum != null && input.wakeupAlarm != null) {
                bytes = bytes.concat(decToBytes(input.alarmSum));
                for (let i = 0; i < input.alarmSum; i++) {
                    let alarm = input.wakeupAlarm[i].split(":");
                    bytes = bytes.concat(parseInt(alarm[0]));
                    bytes = bytes.concat(parseInt(alarm[1]));
                }
            }
            if (input.wakeupSecondsPara != null) {
                bytes = bytes.concat(input.wakeupSecondsPara);
            }
            if (input.picSize != null) {
                const picSize = encodePicSize(input.picSize);
                const completion = encodeCompletion(input.completion);
                const colorAttribute = encodeColorAttribute(input.colorAttribute);
                const toPush = ((picSize << 1 | completion >> 1) << 4) | (((completion & 0x01) << 3) | colorAttribute);
                bytes = bytes.concat(toPush);
            }
            if (input.picSize !== noPicUpload && input.compressionQuality != null) {
                bytes = bytes.concat(input.compressionQuality);
            }
            if (input.brightness != null) {
                bytes = bytes.concat(input.brightness);
            }
            if (input.TMUpdate != null) {
                bytes = bytes.concat(input.TMUpdate);
                if (input.TMUpdate > 0) {
                    if (input.TMIndex != null) {
                        for (let i = 0; i < input.TMUpdate; i++) {
                            bytes = bytes.concat(input.TMIndex[i]);
                        }
                    }
                    if (input.TMLenArray != null) {
                        for (let i = 0; i < input.TMUpdate; i++) {
                            const tmLen = decToBytes(input.TMLenArray[i]);
                            while (tmLen.length < 2) {
                                tmLen.unshift(0x00);
                            }
                            bytes = bytes.concat(tmLen);
                        }
                    }
                }
            }
            if (input.powerSupply != null) {
                bytes = bytes.concat(encodePowerSupply(input.powerSupply));
            }
            if (input.isNewBattery != null) {
                let isNewBattery = input.isNewBattery === true ? 1 : 0;
                bytes = bytes.concat(isNewBattery);
            }
            if (input.batteryCapacity != null) {
                const toPush = decToBytes(input.batteryCapacity * 100);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            if (input.channelSelection != null) {
                bytes = bytes.concat(255);
            }
            if (input.messageRepeatNumber != null) {
                if (input.messageRepeatNumber < 1 || input.messageRepeatNumber > 10) {
                    throw new Error(messageRepeatError);
                }
                bytes = bytes.concat(input.messageRepeatNumber);
            }
            if (input.devType != null) {
                const toPush = decToBytes(input.devType);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            if (input.isFirstRegistration != null) {
                let isFirstRegistration = input.isFirstRegistration === true ? 1 : 0;
                bytes = bytes.concat(isFirstRegistration);
            }
            if (input.isRotated != null) {
                let isRotated = input.isRotated === true ? 1 : 0;
                bytes = bytes.concat(isRotated);
            }
            if (input.isCaptureManually != null) {
                let isCaptureManually = input.isCaptureManually === true ? 1 : 0;
                bytes = bytes.concat(isCaptureManually);
                if (input.isCaptureManually) {
                    if (input.lengthOfCapturePara != null && input.capturePara != null) {
                        bytes = bytes.concat(input.lengthOfCapturePara);
                        for (let i = 0; i < input.lengthOfCapturePara; i++) {
                            bytes = bytes.concat(input.capturePara[i]);
                        }
                    }
                }
            }
            break;
        case configurationType:
            break;
        case checkCompletionType:
            if (input.lostNum != null) {
                const toPush = decToBytes(input.lostNum);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
                if (input.lostPacketsNum != null) {
                    for (let i = 0; i < input.lostNum; i++) {
                        const lostPackets = decToBytes(input.lostPacketsNum[i]);
                        while (lostPackets.length < 2) {
                            lostPackets.unshift(0x00);
                        }
                        bytes = bytes.concat(lostPackets);
                    }
                }
            }
            break;
        case uploadResultValueType:
            if (input.currentTimestamp != null) {
                const toPush = decToBytes(input.currentTimestamp);
                while (toPush.length < 4) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            if (input.runMode != null && input.dataUpInterval != null) {
                const runMode = encodeRunMode(input.runMode);
                if (input.dataUpInterval > 12) {
                    throw new Error(dataUpIntervalError);
                }
                const dataUpInterval = input.dataUpInterval;
                const toPush = runMode << 4 | dataUpInterval;
                bytes = bytes.concat(toPush);
            }
            if (input.wakeupMode != null) {
                bytes = bytes.concat(encodeWakeupMode(input.wakeupMode));
            }
            if (input.wakeupMode === intervalStr && input.wakeupInterval != null) {
                const toPush = decToBytes(input.wakeupInterval);
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
            }
            if (input.wakeupMode === alarmStr && input.alarmSum != null && input.wakeupAlarm != null) {
                bytes = bytes.concat(decToBytes(input.alarmSum));
                for (let i = 0; i < input.alarmSum; i++) {
                    let alarm = input.wakeupAlarm[i].split(":");
                    bytes = bytes.concat(parseInt(alarm[0]));
                    bytes = bytes.concat(parseInt(alarm[1]));
                }
            }
            if (input.picSize != null) {
                const picSize = encodePicSize(input.picSize);
                const completion = encodeCompletion(input.completion);
                const colorAttribute = encodeColorAttribute(input.colorAttribute);
                const toPush = ((picSize << 1 | completion >> 1) << 4) | (((completion & 0x01) << 3) | colorAttribute);
                bytes = bytes.concat(toPush);
            }
            if (input.picSize !== noPicUpload && input.compressionQuality != null) {
                bytes = bytes.concat(input.compressionQuality);
            }
            if (input.brightness != null) {
                bytes = bytes.concat(input.brightness);
            }
            bytes = bytes.concat([0x40, 0x00]);
            break;
        case serverAbnormalType:
            break;
        default:
            throw new Error(downlinkMessageTypeError);
    }

    if (input.crc != null) {
        const toPush = hexToBytes(input.crc);
        while (toPush.length < 2) {
            toPush.unshift(0x00);
        }
        bytes = bytes.concat(toPush);
    }

    result.bytes = bytes;
    return result;
}

exports.decodeUplink = decodeUplink;
exports.decodeDownlink = decodeDownlink;
exports.encodeDownlink = encodeDownlink;