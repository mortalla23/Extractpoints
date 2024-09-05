var utils = require("../utils/common-utils");

const MeasuredValue = "MeasuredValue";
const MinMeasuredValue = "MinMeasuredValue";
const MaxMeasuredValue = "MaxMeasuredValue";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case MeasuredValue:
        return {
          MeasuredValue: utils.signedBytesToDec(bytes, 2),
        };
      case MinMeasuredValue:
        return {
          MinMeasuredValue: utils.signedBytesToDec(bytes, 2),
        };
      case MaxMeasuredValue:
        return {
          MaxMeasuredValue: utils.signedBytesToDec(bytes, 2),
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;

    switch (attributeId) {
      case MeasuredValue:
        bytes = [];
        let MeasuredValueBytes = utils.decToBytes(data.MeasuredValue);
        while (MeasuredValueBytes.length < 2) {
          MeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(MeasuredValueBytes);
        return bytes;
      case MinMeasuredValue:
        bytes = [];
        let MinMeasuredValueBytes = utils.decToBytes(data.MinMeasuredValue);
        while (MinMeasuredValueBytes.length < 2) {
          MinMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(MinMeasuredValueBytes);
        return bytes;
      case MaxMeasuredValue:
        bytes = [];
        let MaxMeasuredValueBytes = utils.decToBytes(data.MaxMeasuredValue);
        while (MaxMeasuredValueBytes.length < 2) {
          MaxMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(MaxMeasuredValueBytes);
        return bytes;
    }

    throw "unknown attribute id: " + attributeId;
  },
};
