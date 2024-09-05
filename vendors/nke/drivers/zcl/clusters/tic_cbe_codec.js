var utils = require("../utils/common-utils");
const ticUtils = require("../utils/tic_utils");
const specificCommandIds = {
    ReadFilteredTICdata: 0x0a,
};

const MeterType = "MeterType";
const ReadingPeriod = "ReadingPeriod";
const CbeGeneralOriginal = "CbeGeneralOriginal";
const CbeGeneralCopy1 = "CbeGeneralCopy1";
const CbeGeneralCopy2 = "CbeGeneralCopy2";
const CbeGeneralCopy3 = "CbeGeneralCopy3";
const CbeGeneralCopy4 = "CbeGeneralCopy4";
const CbeGeneralCopy5 = "CbeGeneralCopy5";

const CBE_GENERAL_FIELDS = new Map();
CBE_GENERAL_FIELDS.set(0, {label:"ADIR1", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(1, {label:"ADIR2", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(2, {label:"ADIR3", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(3, {label:"ADCO", ticFieldType:"Cstring"});
CBE_GENERAL_FIELDS.set(4, {label:"OPTARIF", ticFieldType:"Cstring"});
CBE_GENERAL_FIELDS.set(5, {label:"ISOUSC", ticFieldType:"U8"});
CBE_GENERAL_FIELDS.set(6, {label:"BASE", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(7, {label:"HCHC", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(8, {label:"HCHP", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(9, {label:"EJPHN", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(10, {label:"EJPHPM", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(11, {label:"BBRHCJB", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(12, {label:"BBRHPJB", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(13, {label:"BBRHCJW", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(14, {label:"BBRHPJW", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(15, {label:"BBRHCJR", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(16, {label:"BBRHPJR", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(17, {label:"PEJP", ticFieldType:"U8"});
CBE_GENERAL_FIELDS.set(18, {label:"GAZ", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(19, {label:"AUTRE", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(20, {label:"PTEC", ticFieldType:"Cstring"});
CBE_GENERAL_FIELDS.set(21, {label:"DEMAIN", ticFieldType:"Cstring"});
CBE_GENERAL_FIELDS.set(22, {label:"IINST", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(23, {label:"IINST1", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(24, {label:"IINST2", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(25, {label:"IINST3", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(26, {label:"ADPS", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(27, {label:"IMAX", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(28, {label:"IMAX1", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(29, {label:"IMAX2", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(30, {label:"IMAX4", ticFieldType:"U16"});
CBE_GENERAL_FIELDS.set(31, {label:"PMAX", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(32, {label:"PAPP", ticFieldType:"U32"});
CBE_GENERAL_FIELDS.set(33, {label:"HHPHC", ticFieldType:"Char"});
CBE_GENERAL_FIELDS.set(34, {label:"MOTDETAT", ticFieldType:"Cstring"});
CBE_GENERAL_FIELDS.set(35, {label:"PPOT", ticFieldType:"Cstring"});

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
            case CbeGeneralOriginal:
            case CbeGeneralCopy1:
            case CbeGeneralCopy2:
            case CbeGeneralCopy3:
            case CbeGeneralCopy4:
            case CbeGeneralCopy5:
                return ticUtils.decode(attributeType, bytes, CBE_GENERAL_FIELDS);
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
                while (readingPeriod.length <2){
                    readingPeriod.unshift(0x00);
                }
                bytes = bytes.concat(readingPeriod);
            case CbeGeneralOriginal:
            case CbeGeneralCopy1:
            case CbeGeneralCopy2:
            case CbeGeneralCopy3:
            case CbeGeneralCopy4:
            case CbeGeneralCopy5:
                return ticUtils.encode(attributeType, data, CBE_GENERAL_FIELDS);
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
                throw "unknown TicCbe specific command: " + specificCommandIdByte;
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
                throw "unknown TicCje specific command: " + specificCommandId;
        }
    },
}