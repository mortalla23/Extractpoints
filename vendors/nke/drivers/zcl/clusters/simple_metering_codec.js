var utils = require("../utils/common-utils");
const specificCommandIds = {
  RESET: 0x00,
};

const CurrentMetering = "CurrentMetering";

module.exports = {
  decodeData: function (bytes, attributeId) {
    if (attributeId === CurrentMetering) {
      bytes.shift();
      return {
        ActiveEnergy: utils.signedBytesToDec(bytes.splice(0, 3), 3),
        ReactiveEnergy: utils.signedBytesToDec(bytes.splice(0, 3), 3),
        NumberOfSamples: utils.signedBytesToDec(bytes.splice(0, 2), 2),
        ActivePower: utils.signedBytesToDec(bytes.splice(0, 2), 2),
        ReactivePower: utils.signedBytesToDec(bytes.splice(0, 2), 2),
      };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    if (attributeId === CurrentMetering) {
      let bytes = [0x0c];
      bytes = bytes.concat(
        utils.parseHexString(
          utils.decimalToHexStr(Number(data.ActiveEnergy), 6)
        )
      );
      bytes = bytes.concat(
        utils.parseHexString(
          utils.decimalToHexStr(Number(data.ReactiveEnergy), 6)
        )
      );
      bytes = bytes.concat(
        utils.parseHexString(
          utils.decimalToHexStr(Number(data.NumberOfSamples), 4)
        )
      );
      bytes = bytes.concat(
        utils.parseHexString(utils.decimalToHexStr(Number(data.ActivePower), 4))
      );
      bytes = bytes.concat(
        utils.parseHexString(
          utils.decimalToHexStr(Number(data.ReactivePower), 4)
        )
      );
      return bytes;
    }

    throw "unknown attribute id: " + attributeId;
  },

  decodeCommand: function (decoded, bytes) {
    let specificCommandIdByte = bytes.shift();
    let specificCommandId = Object.keys(specificCommandIds).find(
      (key) => specificCommandIds[key] === specificCommandIdByte
    );
    if (specificCommandId === "RESET") {
      decoded.Data = {
        SpecificCommandType: "RESET",
      };
      return decoded;
    }
    throw "unknown simple metering specific command: " + specificCommandIdByte;
  },
  encodeCommand: function (decoded, bytes) {
    let specificCommandId =
      specificCommandIds[decoded.Data.SpecificCommandType];
    bytes.push(specificCommandId);
    return bytes;
  },
};
