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
        let measuredValueBytes = utils.decToBytes(data.MeasuredValue);
        while (measuredValueBytes.length < 2) {
          measuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(measuredValueBytes);
        return bytes;
      case MinMeasuredValue:
        bytes = [];
        let minMeasuredValueBytes = utils.decToBytes(data.MinMeasuredValue);
        while (minMeasuredValueBytes.length < 2) {
          minMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(minMeasuredValueBytes);
        return bytes;
      case MaxMeasuredValue:
        bytes = [];
        let maxMeasuredValueBytes = utils.decToBytes(data.MaxMeasuredValue);
        while (maxMeasuredValueBytes.length < 2) {
          maxMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(maxMeasuredValueBytes);
        return bytes;
    }

    throw "unknown attribute id: " + attributeId;
  },
};
