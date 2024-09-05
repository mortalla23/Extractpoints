var utils = require("../utils/common-utils");

const PresentValue = "PresentValue";
const ApplicationType = "ApplicationType";
const PowerDuration = "PowerDuration";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case PresentValue:
        return {
          SinglePrecisionValue: utils.bytes2Float32(bytes.slice(0, 4)),
        };
      case ApplicationType:
        return utils.getAnalogInputApplicationType(bytes.slice(0,4));
      case PowerDuration:
        return {
          PowerDuration: utils.bytesToDec(bytes.slice(0,2)),
        };
      default:
        throw "unknown attribute id: " + attributeId;
    }
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case PresentValue:
        bytes = utils.float32ToBytes(data.SinglePrecisionValue);
        while (bytes.length < 4) {
          bytes.unshift(0x00);
        }
        return bytes;
      case PowerDuration:
        bytes = utils.decToBytes(data.PowerDuration);
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;

      default:
        throw "unknown attribute id: " + attributeId;
    }
  },
};
