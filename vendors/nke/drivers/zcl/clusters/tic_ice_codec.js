var utils = require("../utils/common-utils");
const ticUtils = require("../utils/tic_utils");
const specificCommandIds = {
    ReadFilteredTICdata: 0x0a,
};

const MeterType = "MeterType";
const ReadingPeriod = "ReadingPeriod";
const IceGeneralOriginal = "IceGeneralOriginal";
const IceGeneralCopy1 = "IceGeneralCopy1";
const IceEpOriginal = "IceEpOriginal";
const IceEpCopy1 = "IceEpCopy1";
const IceEp1Original = "IceEp1Original";
const IceEp1Copy1 = "IceEp1Copy1";

const ICE_GENERAL_FIELDS = new Map();
ICE_GENERAL_FIELDS.set(0, {label: "CONTRAT", ticFieldType: "Cstring"});
ICE_GENERAL_FIELDS.set(1, {label: "DATECOUR", ticFieldType: "DMYhms"});
ICE_GENERAL_FIELDS.set(2, {label: "DATE", ticFieldType: "DMYhms"});
ICE_GENERAL_FIELDS.set(3, {label: "EA", ticFieldType: "U24"});
ICE_GENERAL_FIELDS.set(4, {label: "ERP", ticFieldType: "U24"});
ICE_GENERAL_FIELDS.set(5, {label: "PTCOUR", ticFieldType: "Cstring"});
ICE_GENERAL_FIELDS.set(6, {label:"PREAVIS", ticFieldType:"Cstring"});
ICE_GENERAL_FIELDS.set(7, {label:"MODE", ticFieldType:"EMPTY"});
ICE_GENERAL_FIELDS.set(8, {label:"DATEPA1", ticFieldType:"DMYhms"});
ICE_GENERAL_FIELDS.set(9, {label: "PA1", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(10, {label:"DATEPA2", ticFieldType:"DMYhms"});
ICE_GENERAL_FIELDS.set(11, {label:"PA2", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(12, {label:"DATEPA3", ticFieldType:"DMYhms"});
ICE_GENERAL_FIELDS.set(13, {label:"PA3", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(14, {label:"DATEPA4", ticFieldType:"DMYhms"});
ICE_GENERAL_FIELDS.set(15, {label:"PA4", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(16, {label:"DATEPA5", ticFieldType:"DMYhms"});
ICE_GENERAL_FIELDS.set(17, {label:"PA5", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(18, {label:"DATEPA6", ticFieldType:"DMYhms"});
ICE_GENERAL_FIELDS.set(19, {label:"PA6", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(20, {label:"*p*", ticFieldType:"Empty"});
ICE_GENERAL_FIELDS.set(21, {label:"KDC", ticFieldType:"U8"});
ICE_GENERAL_FIELDS.set(22, {label:"KDCD", ticFieldType:"U8"});
ICE_GENERAL_FIELDS.set(23, {label:"TGPHI", ticFieldType:"U32"});
ICE_GENERAL_FIELDS.set(24, {label:"PSP", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(25, {label:"PSPM", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(26, {label:"PSHPH", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(27, {label:"PSHPD", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(28, {label:"PSHCH", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(29, {label:"PSHCD", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(30, {label:"PSHPE", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(31, {label:"PSHCE", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(32, {label:"PSJA", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(33, {label:"PSHH", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(34, {label:"PSHD", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(35, {label:"PSHM", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(36, {label:"PSDSM", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(37, {label:"PSSCM", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(38, {label:"MODE", ticFieldType:"Empty"});
ICE_GENERAL_FIELDS.set(39, {label:"PA1MN", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(40, {label:"PA10MN", ticFieldType:"U16"});
ICE_GENERAL_FIELDS.set(41, {label:"PREA1MN", ticFieldType:"I16"});
ICE_GENERAL_FIELDS.set(42, {label:"PREA10MN", ticFieldType:"I16"});
ICE_GENERAL_FIELDS.set(43, {label:"TGPHI", ticFieldType:"U32"});
ICE_GENERAL_FIELDS.set(44, {label:"U10MN", ticFieldType:"U16"});

const ICE_EP_FIELDS = new Map();
ICE_EP_FIELDS.set(0, {label:"DEBUTp", ticFieldType:"DMYhms"});
ICE_EP_FIELDS.set(1, {label:"FINp", ticFieldType:"DMYhms"});
ICE_EP_FIELDS.set(2, {label:"CAFp", ticFieldType:"U16"});
ICE_EP_FIELDS.set(3, {label:"DATE_EAp", ticFieldType:"DMYhms"});
ICE_EP_FIELDS.set(4, {label:"EApP", ticFieldType:"U24"});
ICE_EP_FIELDS.set(5, {label:"EApPM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(6, {label:"EApHCE", ticFieldType:"U24"});
ICE_EP_FIELDS.set(7, {label:"EApHCH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(8, {label:"EApHH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(9, {label:"EApHCD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(10, {label:"EApHD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(11, {label:"EApJA", ticFieldType:"U24"});
ICE_EP_FIELDS.set(12, {label:"EApHPE", ticFieldType:"U24"});
ICE_EP_FIELDS.set(13, {label:"EApHPH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(14, {label:"EApHPD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(15, {label:"EApSCM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(16, {label:"EApHM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(17, {label:"EApDSM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(18, {label:"DATE_ERPp", ticFieldType:"DMYhms"});
ICE_EP_FIELDS.set(19, {label:"ERPpP", ticFieldType:"U24"});
ICE_EP_FIELDS.set(20, {label:"ERPpPM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(21, {label:"ERPpHCE", ticFieldType:"U24"});
ICE_EP_FIELDS.set(22, {label:"ERPpHCH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(23, {label:"ERPpHH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(24, {label:"ERPpHCD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(25, {label:"ERPpHD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(26, {label:"ERPpJA", ticFieldType:"U24"});
ICE_EP_FIELDS.set(27, {label:"ERPpHPE", ticFieldType:"U24"});
ICE_EP_FIELDS.set(28, {label:"ERPpHPH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(29, {label:"ERPpHPD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(30, {label:"ERPpSCM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(31, {label:"ERPpHM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(32, {label:"ERPpDSM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(33, {label:"DATE_ERNp", ticFieldType:"DMYhms"});
ICE_EP_FIELDS.set(34, {label:"ERNpP", ticFieldType:"U24"});
ICE_EP_FIELDS.set(35, {label:"ERNpPM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(36, {label:"ERNpHCE", ticFieldType:"U24"});
ICE_EP_FIELDS.set(37, {label:"ERNpHCH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(38, {label:"ERNpHH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(39, {label:"ERNpHCD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(40, {label:"ERNpHD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(41, {label:"ERNpJA", ticFieldType:"U24"});
ICE_EP_FIELDS.set(42, {label:"ERNpHPE", ticFieldType:"U24"});
ICE_EP_FIELDS.set(43, {label:"ERNpHPH", ticFieldType:"U24"});
ICE_EP_FIELDS.set(44, {label:"ERNpHPD", ticFieldType:"U24"});
ICE_EP_FIELDS.set(45, {label:"ERNpSCM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(46, {label:"ERNpHM", ticFieldType:"U24"});
ICE_EP_FIELDS.set(47, {label:"ERNpDSM", ticFieldType:"U24"});

const ICE_EP1_FIELDS = new Map();
ICE_EP1_FIELDS.set(0, {label:"DEBUTp1", ticFieldType:"DMYhms"});
ICE_EP1_FIELDS.set(1, {label:"FINp1", ticFieldType:"DMYhms"});
ICE_EP1_FIELDS.set(2, {label:"CAFp1", ticFieldType:"U16"});
ICE_EP1_FIELDS.set(3, {label:"DATE_EAp1", ticFieldType:"DMYhms"});
ICE_EP1_FIELDS.set(4, {label:"EAp1P", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(5, {label:"EAp1PM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(6, {label:"EAp1HCE", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(7, {label:"EAp1HCH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(8, {label:"EAp1HH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(9, {label:"EAp1HCD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(10, {label:"EAp1HD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(11, {label:"EAp1JA", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(12, {label:"EAp1HPE", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(13, {label:"EAp1HPH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(14, {label:"EAp1HPD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(15, {label:"EAp1SCM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(16, {label:"EAp1HM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(17, {label:"EAp1DSM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(18, {label:"DATE_ERPp1", ticFieldType:"DMYhms"});
ICE_EP1_FIELDS.set(19, {label:"ERPp1P", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(20, {label:"ERPp1PM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(21, {label:"ERPp1HCE", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(22, {label:"ERPp1HCH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(23, {label:"ERPp1HH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(24, {label:"ERPp1HCD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(25, {label:"ERPp1HD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(26, {label:"ERPp1JA", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(27, {label:"ERPp1HPE", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(28, {label:"ERPp1HPH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(29, {label:"ERPp1HPD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(30, {label:"ERPp1SCM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(31, {label:"ERPp1HM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(32, {label:"ERPp1DSM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(33, {label:"DATE_ERNp1", ticFieldType:"DMYhms"});
ICE_EP1_FIELDS.set(34, {label:"ERNp1P", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(35, {label:"ERNp1PM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(36, {label:"ERNp1HCE", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(37, {label:"ERNp1HCH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(38, {label:"ERNp1HH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(39, {label:"ERNp1HCD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(40, {label:"ERNp1HD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(41, {label:"ERNp1JA", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(42, {label:"ERNp1HPE", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(43, {label:"ERNp1HPH", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(44, {label:"ERNp1HPD", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(45, {label:"ERNp1SCM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(46, {label:"ERNp1HM", ticFieldType:"U24"});
ICE_EP1_FIELDS.set(47, {label:"ERNp1DSM", ticFieldType:"U24"});

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
            case IceGeneralOriginal:
            case IceGeneralCopy1:
                return ticUtils.decode(attributeType, bytes, ICE_GENERAL_FIELDS);
            case IceEpOriginal:
            case IceEpCopy1:
                return ticUtils.decode(attributeType, bytes, ICE_EP_FIELDS);
            case IceEp1Original:
            case IceEp1Copy1:
                return ticUtils.decode(attributeType, bytes, ICE_EP1_FIELDS);
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
            case IceGeneralOriginal:
            case IceGeneralCopy1:
                return ticUtils.encode(attributeType, data, ICE_GENERAL_FIELDS);
            case IceEpOriginal:
            case IceEpCopy1:
                return ticUtils.encode(attributeType, data, ICE_EP_FIELDS);
            case IceEp1Original:
            case IceEp1Copy1:
                return ticUtils.encode(attributeType, data, ICE_EP1_FIELDS);
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