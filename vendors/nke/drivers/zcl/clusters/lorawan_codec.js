var utils = require("../utils/common-utils");
const specificCommandIds = {
  Association: 0x00,
};

const MessageType = "MessageType";
const NumberOfRetryIfConfirmed = "NumberOfRetryIfConfirmed";
const ReAssociation = "ReAssociation";
const DataRate = "DataRate";
const ABPDevAddr = "ABPDevAddr";
const OTAAppEUI = "OTAAppEUI";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case MessageType:
        return {
          IsAllFramesConfirmed: bytes.shift() === 1,
        };
      case NumberOfRetryIfConfirmed:
        return {
          NumberOfRetries: bytes.shift(),
        };
      case ReAssociation:
        bytes.shift();
        return {
          PeriodWithoutReceiving: bytes.shift() * 256 + bytes.shift(),
          NumberOfConsecutiveFailures: bytes.shift() * 256 + bytes.shift(),
        };
      case DataRate:
        bytes.splice(0, 2);
        return {
          DataRate: utils.getDataRateStart(bytes.shift()),
        };
      case ABPDevAddr:
        bytes.shift();
        return {
          AbpDevAddr: utils.bytesToHex(bytes),
        };
      case OTAAppEUI:
        bytes.shift();
        return {
          OtaAppEui: utils.bytesToHex(bytes),
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case MessageType:
        bytes = [];
        bytes = bytes.concat(data.IsAllFramesConfirmed ? 0x01 : 0x00);
        return bytes;
      case NumberOfRetryIfConfirmed:
        bytes = [];
        bytes = bytes.concat(data.NumberOfRetries);
        return bytes;
      case ReAssociation:
        bytes = [0x04];
        let periodArrayBytes = utils.decToBytes(
          data.PeriodWithoutReceiving
        );
        while (periodArrayBytes.length < 2) {
          periodArrayBytes.unshift(0x00);
        }
        bytes = bytes.concat(periodArrayBytes);
        let consecutiveFailuresArrayBytes = utils.decToBytes(
          data.NumberOfConsecutiveFailures
        );
        while (consecutiveFailuresArrayBytes.length < 2) {
          consecutiveFailuresArrayBytes.unshift(0x00);
        }
        bytes = bytes.concat(consecutiveFailuresArrayBytes);
        return bytes;
      case DataRate:
        bytes = [0x02, 0x00];
        bytes = bytes.concat(utils.encodeDataRateStart(data.DataRate));
        return bytes;
      case ABPDevAddr:
        bytes = [0x04];
        let abp = utils.hexToBytes(data.AbpDevAddr);
        while (abp.length < 4) {
          abp.unshift(0x00);
        }
        bytes = bytes.concat(abp);
        return bytes;
      case OTAAppEUI:
        bytes = [0x08];
        let ota = utils.hexToBytes(data.OtaAppEui);
        while (ota.length < 8) {
          ota.unshift(0x00);
        }
        bytes = bytes.concat(ota);
        return bytes;
      default:
        throw "unknown attribute id: " + attributeId;
    }
  },

  decodeCommand: function (decoded, bytes) {
    let specificCommandIdByte = bytes.shift();
    let specificCommandId = Object.keys(specificCommandIds).find(
      (key) => specificCommandIds[key] === specificCommandIdByte
    );
    if (specificCommandId === "Association") {
      decoded.Data = {
        SpecificCommandType: "Association",
        PeriodAfterAssociation: bytes.shift() * 256 + bytes.shift(),
      };
      return decoded;
    }
    throw "unknown LoRaWAN specific command: " + specificCommandIdByte;
  },

  encodeCommand: function (decoded, bytes) {
    let specificCommandId =
      specificCommandIds[decoded.Data.SpecificCommandType];
    bytes.push(specificCommandId);
    bytes = bytes.concat(utils.decToBytes(decoded.Data.PeriodAfterAssociation));
    return bytes;
  },
};
