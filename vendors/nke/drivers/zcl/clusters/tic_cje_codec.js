var utils = require("../utils/common-utils");
const ticUtils = require("../utils/tic_utils");
const specificCommandIds = {
    ReadFilteredTICdata: 0x0a,
};

const MeterType = "MeterType";
const ReadingPeriod = "ReadingPeriod";
const CjeGeneralOriginal = "CjeGeneralOriginal";
const CjeGeneralCopy1 = "CjeGeneralCopy1";
const CjeGeneralCopy2 = "CjeGeneralCopy2";
const CjeGeneralCopy3 = "CjeGeneralCopy3";
const CjeGeneralCopy4 = "CjeGeneralCopy4";
const CjeGeneralCopy5 = "CjeGeneralCopy5";

const CJE_GENERAL_FIELDS = new Map();
CJE_GENERAL_FIELDS.set(0, {label:"JAUNE0", ticFieldType:"hmDM"});
CJE_GENERAL_FIELDS.set(1, {label:"JAUNE4", ticFieldType:"Cstring"});
CJE_GENERAL_FIELDS.set(2, {label:"JAUNE5", ticFieldType:"Cstring"});
CJE_GENERAL_FIELDS.set(3, {label:"JAUNE6", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(4, {label:"JAUNE7", ticFieldType:"U8"});
CJE_GENERAL_FIELDS.set(5, {label:"ENERG0", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(6, {label:"ENERG1", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(7, {label:"ENERG2", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(8, {label:"ENERG3", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(9, {label:"ENERG4", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(10, {label:"ENERG5", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(11, {label:"PERCC0", ticFieldType:"DMh"});
CJE_GENERAL_FIELDS.set(12, {label:"PERCC3", ticFieldType:"U8"});
CJE_GENERAL_FIELDS.set(13, {label:"PMAXC0", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(14, {label:"PMAXC1", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(15, {label:"PMAXC2", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(16, {label:"PMAXC3", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(17, {label:"TDEPA0", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(18, {label:"TDEPA1", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(19, {label:"TDEPA2", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(20, {label:"TDEPA3", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(21, {label:"PERCP0", ticFieldType:"DMh"});
CJE_GENERAL_FIELDS.set(22, {label:"PERCP3", ticFieldType:"U8"});
CJE_GENERAL_FIELDS.set(23, {label:"PMAXP0", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(24, {label:"PMAXP1", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(25, {label:"PMAXP2", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(26, {label:"PMAXP3", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(27, {label:"PSOUSC0", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(28, {label:"PSOUSC1", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(29, {label:"PSOUSC3", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(30, {label:"PSOUSC4", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(31, {label:"PSOUSP0", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(32, {label:"PSOUSP1", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(33, {label:"PSOUSP2", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(34, {label:"PSOUSP3", ticFieldType:"U24"});
CJE_GENERAL_FIELDS.set(35, {label:"FCOU0", ticFieldType:"hm"});
CJE_GENERAL_FIELDS.set(36, {label:"FCOU2", ticFieldType:"U8"});


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
            case CjeGeneralOriginal:
            case CjeGeneralCopy1:
            case CjeGeneralCopy2:
            case CjeGeneralCopy3:
            case CjeGeneralCopy4:
            case CjeGeneralCopy5:
                return ticUtils.decode(attributeType, bytes, CJE_GENERAL_FIELDS);
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
            case CjeGeneralOriginal:
            case CjeGeneralCopy1:
            case CjeGeneralCopy2:
            case CjeGeneralCopy3:
            case CjeGeneralCopy4:
            case CjeGeneralCopy5:
                return ticUtils.encode(attributeType, data, CJE_GENERAL_FIELDS);
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
                throw "unknown TicIce specific command: " + specificCommandIdByte;
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
                throw "unknown TicIce specific command: " + specificCommandId;
        }
    },
}