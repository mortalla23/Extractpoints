var utils = require("../utils/common-utils");
const ticUtils = require("../utils/tic_utils");
const specificCommandIds = {
    ReadFilteredTICdata: 0x0a,
};

const MeterType = "MeterType";
const ReadingPeriod = "ReadingPeriod";
const PmepmiGeneralOriginal = "PmepmiGeneralOriginal";
const PmepmiGeneralCopy1 = "PmepmiGeneralCopy1";
const PmepmiGeneralCopy2 = "PmepmiGeneralCopy2";
const PmepmiGeneralCopy3 = "PmepmiGeneralCopy3";
const PmepmiGeneralCopy4 = "PmepmiGeneralCopy4";
const PmepmiGeneralCopy5 = "PmepmiGeneralCopy5";

const PMEPMI_GENERAL_FIELDS = new Map();
PMEPMI_GENERAL_FIELDS.set(0, {label:"TRAME", ticFieldType:"E_DIV"});
PMEPMI_GENERAL_FIELDS.set(1, {label:"ADS", ticFieldType:"HEXSTRING"});
PMEPMI_GENERAL_FIELDS.set(2, {label:"MESURES1", ticFieldType:"E_CONTRAT"});
PMEPMI_GENERAL_FIELDS.set(3, {label:"DATE", ticFieldType:"DMYhms"});
PMEPMI_GENERAL_FIELDS.set(4, {label:"EA_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(5, {label:"ER+_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(6, {label:"ER-_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(7, {label:"EAPP_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(8, {label:"EA_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(9, {label:"ER+_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(10, {label:"ER-_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(11, {label:"EAPP_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(12, {label:"PTCOUR1", ticFieldType:"E_PT"});
PMEPMI_GENERAL_FIELDS.set(13, {label:"TARIFDYN", ticFieldType:"E_DIV"});
PMEPMI_GENERAL_FIELDS.set(14, {label:"ETATDYN1", ticFieldType:"E_PT"});
PMEPMI_GENERAL_FIELDS.set(15, {label:"PREAVIS1", ticFieldType:"E_PT"});
PMEPMI_GENERAL_FIELDS.set(16, {label:"TDYN1CD", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(17, {label:"TDYN1CF", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(18, {label:"TDYN1FD", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(19, {label:"TDYN1FF", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(20, {label:"MODE", ticFieldType:"E_DIV"});
PMEPMI_GENERAL_FIELDS.set(21, {label:"CONFIG", ticFieldType:"E_DIV"});
PMEPMI_GENERAL_FIELDS.set(22, {label:"DATEPA1", ticFieldType:"DMYhms"});
PMEPMI_GENERAL_FIELDS.set(23, {label:"PA1_s", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(24, {label:"PA1_i", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(25, {label:"DATEPA2", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(26, {label:"PA2_s", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(27, {label:"PA2_i", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(28, {label:"DATEPA3 ", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(29, {label:"PA3_s", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(30, {label:"PA3_i", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(31, {label:"DATEPA4", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(32, {label:"PA4_s", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(33, {label:"PA4_i", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(34, {label:"DATEPA5", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(35, {label:"PA5_s", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(36, {label:"PA5_i", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(37, {label:"DATEPA6", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(38, {label:"PA6_s", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(39, {label:"PA6_i", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(40, {label:"DebP", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(41, {label:"EAP_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(42, {label:"EAP_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(43, {label:"ER+P_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(44, {label:"ER-P_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(45, {label:"ER+P_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(46, {label:"ER-P_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(47, {label:"DebP-1", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(48, {label:"FinP-1", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(49, {label:"EaP-1_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(50, {label:"EaP-1_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(51, {label:"ER+P-1_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(52, {label:"ER-P-1_s", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(53, {label:"ER+P-1_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(54, {label:"ER-P-1_i", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(55, {label:"PS", ticFieldType:"U24_E_DIV"});
PMEPMI_GENERAL_FIELDS.set(56, {label:"PREAVIS", ticFieldType:"E_DIV"});
PMEPMI_GENERAL_FIELDS.set(57, {label:"PA1MN", ticFieldType:"U16"});
PMEPMI_GENERAL_FIELDS.set(58, {label:"PMAX_s", ticFieldType:"U24_E_DIV"});
PMEPMI_GENERAL_FIELDS.set(59, {label:"PMAX_i", ticFieldType:"U24_E_DIV"});
PMEPMI_GENERAL_FIELDS.set(60, {label:"TGPHI_s", ticFieldType:"FLOAT"});
PMEPMI_GENERAL_FIELDS.set(61, {label:"TGPHI_i", ticFieldType:"FLOAT"});
PMEPMI_GENERAL_FIELDS.set(62, {label:"MESURES2", ticFieldType:"E_CONTRAT"});
PMEPMI_GENERAL_FIELDS.set(63, {label:"PTCOUR2", ticFieldType:"E_PT"});
PMEPMI_GENERAL_FIELDS.set(64, {label:"ETATDYN2", ticFieldType:"E_PT"});
PMEPMI_GENERAL_FIELDS.set(65, {label:"PREAVIS2", ticFieldType:"E_PT"});
PMEPMI_GENERAL_FIELDS.set(66, {label:"TDYN2CD", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(67, {label:"TDYN2CF", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(68, {label:"TDYN2FD", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(69, {label:"TDYN2FF", ticFieldType:"tsDMYhms_E_PT"});
PMEPMI_GENERAL_FIELDS.set(70, {label:"DebP_2", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(71, {label:"EaP_s2", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(72, {label:"DebP-1_2", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(73, {label:"FinP-1_2", ticFieldType:"tsDMYhms"});
PMEPMI_GENERAL_FIELDS.set(74, {label:"EaP-1_s2", ticFieldType:"U24"});
PMEPMI_GENERAL_FIELDS.set(75, {label:"_DDMES1_", ticFieldType:"U24"});

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
            case PmepmiGeneralOriginal:
            case PmepmiGeneralCopy1:
            case PmepmiGeneralCopy2:
            case PmepmiGeneralCopy3:
            case PmepmiGeneralCopy4:
            case PmepmiGeneralCopy5:
                return ticUtils.decode(attributeType, bytes, PMEPMI_GENERAL_FIELDS);
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
            case PmepmiGeneralOriginal:
            case PmepmiGeneralCopy1:
            case PmepmiGeneralCopy2:
            case PmepmiGeneralCopy3:
            case PmepmiGeneralCopy4:
            case PmepmiGeneralCopy5:
                return ticUtils.encode(attributeType, data, PMEPMI_GENERAL_FIELDS);
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
                throw "unknown TicPmepmi specific command: " + specificCommandIdByte;
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
                throw "unknown TicPmepmi specific command: " + specificCommandId;
        }
    },
}