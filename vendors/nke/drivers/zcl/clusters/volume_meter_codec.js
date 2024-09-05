var utils = require("../utils/common-utils");
const specificCommandIds = {
  RESET: 0x00,
};

const Volume = "Volume";
const VolumeDisplayMode = "VolumeDisplayMode";
const MinFlow = "MinFlow";
const MaxFlow = "MaxFlow";
const FlowDisplayMode = "FlowDisplayMode";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case Volume:
        return {
          VolumeIndex: utils.signedBytesToDec(bytes, 4),
        };
      case VolumeDisplayMode:
        return {
          VolumeUnit: utils.getVolumeUnit(bytes.shift()),
        };
      case MinFlow:
        return {
          MinFlowIndex: utils.signedBytesToDec(bytes, 1),
        };
      case MaxFlow:
        return {
          MaxFlowIndex: utils.signedBytesToDec(bytes, 1),
        };
      case FlowDisplayMode:
        return {
          FlowUnit: utils.getFlowUnit(bytes.shift()),
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case Volume:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.VolumeIndex));
        while (bytes.length < 4) {
          bytes.unshift(0x00);
        }
        return bytes;
      case VolumeDisplayMode:
        bytes = [];
        bytes = bytes.concat(utils.encodeVolumeUnit(data.VolumeUnit));
        return bytes;
      case MinFlow:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.MinFlowIndex));
        return bytes;
      case MaxFlow:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.MaxFlowIndex));
        return bytes;
      case FlowDisplayMode:
        bytes = [];
        bytes = bytes.concat(utils.encodeFlowUnit(data.FlowUnit));
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
    if (specificCommandId === "RESET") {
      decoded.Data = {
        SpecificCommandType: "RESET",
        ResetValue: utils.getResetValue(bytes.shift()),
      };
      return decoded;
    }
    throw "unknown LoRaWAN specific command: " + specificCommandIdByte;
  },

  encodeCommand: function (decoded, bytes) {
    let specificCommandId =
      specificCommandIds[decoded.Data.SpecificCommandType];
    bytes.push(specificCommandId);
    bytes.push(utils.encodeResetValue(decoded.Data.ResetValue));
    return bytes;
  },
};
