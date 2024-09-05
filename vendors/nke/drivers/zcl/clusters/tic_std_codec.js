var utils = require("../utils/common-utils");
const ticUtils = require("../utils/tic_utils");
const specificCommandIds = {
    ReadFilteredTICdata: 0x0a,
};

const MeterType = "MeterType";
const ReadingPeriod = "ReadingPeriod";
const StdGeneralOriginal = "StdGeneralOriginal";
const StdGeneralCopy1 = "StdGeneralCopy1";
const StdGeneralCopy2 = "StdGeneralCopy2";
const StdGeneralCopy3 = "StdGeneralCopy3";
const StdGeneralCopy4 = "StdGeneralCopy4";
const StdGeneralCopy5 = "StdGeneralCopy5";

const STD_GENERAL_FIELDS = new Map();
STD_GENERAL_FIELDS.set(0, {label:"ADSC", ticFieldType:"Cstring"});
STD_GENERAL_FIELDS.set(1, {label:"VTIC", ticFieldType:"U8"});
STD_GENERAL_FIELDS.set(2, {label:"DATE", ticFieldType:"SDMYhms"});
STD_GENERAL_FIELDS.set(3, {label:"NGTF", ticFieldType:"Cstring"});
STD_GENERAL_FIELDS.set(4, {label:"LTARF", ticFieldType:"Cstring"});
STD_GENERAL_FIELDS.set(5, {label:"EAST", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(6, {label:"EASF01", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(7, {label:"EASF02", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(8, {label:"EASF03", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(9, {label:"EASF04", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(10, {label:"EASF05", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(11, {label:"EASF06", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(12, {label:"EASF07", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(13, {label:"EASF08", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(14, {label:"EASF09", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(15, {label:"EASF10", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(16, {label:"EASD01", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(17, {label:"EASD02", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(18, {label:"EASD03", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(19, {label:"EASD04", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(20, {label:"EAIT", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(21, {label:"ERQ1", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(22, {label:"ERQ2", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(23, {label:"ERQ3", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(24, {label:"ERQ4", ticFieldType:"U32"});
STD_GENERAL_FIELDS.set(25, {label:"IRMS1", ticFieldType:"U16"});
STD_GENERAL_FIELDS.set(26, {label:"IRMS2", ticFieldType:"U16"});
STD_GENERAL_FIELDS.set(27, {label:"IRMS3", ticFieldType:"U16"});
STD_GENERAL_FIELDS.set(28, {label:"URMS1", ticFieldType:"U16"});
STD_GENERAL_FIELDS.set(29, {label:"URMS2", ticFieldType:"U16"});
STD_GENERAL_FIELDS.set(30, {label:"URMS3", ticFieldType:"U16"});
STD_GENERAL_FIELDS.set(31, {label:"PREF", ticFieldType:"U8"});
STD_GENERAL_FIELDS.set(32, {label:"PCOUP", ticFieldType:"U8"});
STD_GENERAL_FIELDS.set(33, {label:"SINSTS", ticFieldType:"U24"});
STD_GENERAL_FIELDS.set(34, {label:"SINSTS1", ticFieldType:"U24"});
STD_GENERAL_FIELDS.set(35, {label:"SINSTS2", ticFieldType:"U24"});
STD_GENERAL_FIELDS.set(36, {label:"SINSTS3", ticFieldType:"U24"});
STD_GENERAL_FIELDS.set(37, {label:"SMAXSN", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(38, {label:"SMAXSN1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(39, {label:"SMAXSN2", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(40, {label:"SMAXSN3", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(41, {label:"SMAXSN-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(42, {label:"SMAXSN1-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(43, {label:"SMAXSN2-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(44, {label:"SMAXSN3-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(45, {label:"SINSTI", ticFieldType:"U24"});
STD_GENERAL_FIELDS.set(46, {label:"SMAXIN", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(47, {label:"SMAXIN-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(48, {label:"CCASN", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(49, {label:"CCASN-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(50, {label:"CCAIN", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(51, {label:"CCAIN-1", ticFieldType:"SDMYhmsU24"});
STD_GENERAL_FIELDS.set(52, {label:"UMOY1", ticFieldType:"SDMYhmsU16"});
STD_GENERAL_FIELDS.set(53, {label:"UMOY2", ticFieldType:"SDMYhmsU16"});
STD_GENERAL_FIELDS.set(54, {label:"UMOY3", ticFieldType:"SDMYhmsU16"});
STD_GENERAL_FIELDS.set(55, {label:"STGE", ticFieldType:"U32xbe"});
STD_GENERAL_FIELDS.set(56, {label:"DPM1", ticFieldType:"SDMYhmsU8"});
STD_GENERAL_FIELDS.set(57, {label:"FPM1", ticFieldType:"SDMYhmsU8"});
STD_GENERAL_FIELDS.set(58, {label:"DPM2", ticFieldType:"SDMYhmsU8"});
STD_GENERAL_FIELDS.set(59, {label:"FPM2", ticFieldType:"SDMYhmsU8"});
STD_GENERAL_FIELDS.set(60, {label:"DPM3", ticFieldType:"SDMYhmsU8"});
STD_GENERAL_FIELDS.set(61, {label:"FPM3", ticFieldType:"SDMYhmsU8"});
STD_GENERAL_FIELDS.set(62, {label:"MSG1", ticFieldType:"Cstring"});
STD_GENERAL_FIELDS.set(63, {label:"MSG2", ticFieldType:"Cstring"});
STD_GENERAL_FIELDS.set(64, {label:"PRM", ticFieldType:"Cstring"});
STD_GENERAL_FIELDS.set(65, {label:"RELAIS", ticFieldType:"bf8d"});
STD_GENERAL_FIELDS.set(66, {label:"NTARF", ticFieldType:"U8"});
STD_GENERAL_FIELDS.set(67, {label:"NJOURF", ticFieldType:"U8"});
STD_GENERAL_FIELDS.set(68, {label:"NJOURF+1", ticFieldType:"U8"});
STD_GENERAL_FIELDS.set(69, {label:"PJOURF+1", ticFieldType:"11hhmmSSSS"});
STD_GENERAL_FIELDS.set(70, {label:"PPOINTE", ticFieldType:"11hhmmSSSS"});


module.exports = {
    decodeData: function (bytes, attributeId, attributeType) {
        switch (attributeId) {
            case MeterType:
                return {
                    MeterType: utils.getMeterType(bytes.shift())
                }
            case ReadingPeriod:
                return {
                    ReadingPeriod: utils.bytesToDec(bytes.splice(0, 2))
                }
            case StdGeneralOriginal:
            case StdGeneralCopy1:
            case StdGeneralCopy2:
            case StdGeneralCopy3:
            case StdGeneralCopy4:
            case StdGeneralCopy5:
                return ticUtils.decode(attributeType, bytes, STD_GENERAL_FIELDS);
        }
    },

    encodeData: function (attributeId, data, attributeType) {
        let bytes;
        switch (attributeId) {
            case MeterType:
                bytes = [];
                bytes = bytes.concat(utils.encodeMeterType(data.MeterType));
            case ReadingPeriod:
                bytes = [];
                let readingPeriod = utils.decToBytes(data.ReadingPeriod);
                while (readingPeriod.length < 2) {
                    readingPeriod.unshift(0x00);
                }
                bytes = bytes.concat(readingPeriod);
            case StdGeneralOriginal:
            case StdGeneralCopy1:
            case StdGeneralCopy2:
            case StdGeneralCopy3:
            case StdGeneralCopy4:
            case StdGeneralCopy5:
                return ticUtils.encode(attributeType, data, STD_GENERAL_FIELDS);
        }
    },

    decodeCommand: function (decoded, bytes) {
        let specificCommandIdByte = bytes.shift();
        let specificCommandId = Object.keys(specificCommandIds).find(
            (key) => specificCommandIds[key] === specificCommandIdByte
        );
        switch (specificCommandId) {
            case "ReadFilteredTICdata":
                decoded.Data = ticUtils.decodeSpecificCommand(bytes);
                return decoded;
            default:
                throw "unknown TicStd specific command: " + specificCommandIdByte;
        }
    },

    encodeCommand: function (decoded, bytes) {
        let specificCommandId =
            specificCommandIds[decoded.Data.SpecificCommandType];
        switch (decoded.Data.SpecificCommandType) {
            case "ReadFilteredTICdata":
                bytes.push(specificCommandId);
                bytes = bytes.concat(ticUtils.encodeSpecificCommand(decoded.Data));
                return bytes;
            default:
                throw "unknown TicStd specific command: " + specificCommandId;
        }
    },
}