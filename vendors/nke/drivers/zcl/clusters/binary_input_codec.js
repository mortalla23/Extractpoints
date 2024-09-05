var utils = require("../utils/common-utils");

const PresentValue = "PresentValue";
const Count = "Count";
const Polarity = "Polarity";
const EdgeSelection = "EdgeSelection";
const DebouncePeriod = "DebouncePeriod";
const ApplicationType = "ApplicationType";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case PresentValue:
        return {
          BinaryValue: bytes.shift() == 1,
        };
      case Count:
        return {
          CounterValue: utils.bytesToDec(bytes),
        };
      case Polarity:
        return {
          Polarity: utils.getPolarity(bytes.shift()),
        };
      case EdgeSelection:
        return {
          EdgeSelection: utils.getEdgeSelection(bytes.shift()),
        };
      case DebouncePeriod:
        return {
          DebouncePeriod: utils.bytesToDec(bytes),
        };
      case ApplicationType:
        return {
          Size: bytes.shift(),
          ApplicationType: utils.getApplicationType(bytes),
        };
      default:
        throw "unknown attribute id: " + attributeId;
    }
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case PresentValue:
        bytes = data.BinaryValue ? 0x01 : 0x00;
        return bytes;
      case Count:
        bytes = utils.decToBytes(data.CounterValue);
        while (bytes.length < 4) {
          bytes.unshift(0x00);
        }
        return bytes;
      case Polarity:
        bytes = utils.encodePolarity(data.Polarity);
        return bytes;
      case EdgeSelection:
        bytes = utils.encodeEdgeSelection(data.EdgeSelection);
        return bytes;
      case DebouncePeriod:
        bytes = utils.decToBytes(data.DebouncePeriod);
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;
      case ApplicationType:
        bytes = utils.encodeApplicationType(data.ApplicationType);
        return bytes;

      default:
        throw "unknown attribute id: " + attributeId;
    }
  },
};
