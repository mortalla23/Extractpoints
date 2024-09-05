var utils = require("../utils/common-utils");

const PresentValues = "PresentValues";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case PresentValues:
        let allValues = utils.bytesToDec(bytes);
        return {
          BinaryValues: {
            B0: (allValues & 1) == 1,
            B1: ((allValues >> 1) & 1) == 1,
            B2: ((allValues >> 2) & 1) == 1,
            B3: ((allValues >> 3) & 1) == 1,
            B4: ((allValues >> 4) & 1) == 1,
            B5: ((allValues >> 5) & 1) == 1,
            B6: ((allValues >> 6) & 1) == 1,
            B7: ((allValues >> 7) & 1) == 1,
            B8: ((allValues >> 8) & 1) == 1,
            B9: ((allValues >> 9) & 1) == 1,
            B10: ((allValues >> 10) & 1) == 1,
            B11: ((allValues >> 11) & 1) == 1,
            B12: ((allValues >> 12) & 1) == 1,
            B13: ((allValues >> 13) & 1) == 1,
            B14: ((allValues >> 14) & 1) == 1,
            B15: ((allValues >> 15) & 1) == 1,
          },
        };

      default:
        throw "unknown attribute id: " + attributeId;
    }
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case PresentValues:
        let result = data.BinaryValues.B15 ? 1 : 0;
        result = (result << 1) | (data.BinaryValues.B14 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B13 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B12 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B11 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B10 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B9 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B8 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B7 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B6 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B5 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B4 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B3 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B2 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B1 ? 1 : 0);
        result = (result << 1) | (data.BinaryValues.B0 ? 1 : 0);
        let bytes = utils.decToBytes(result);
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }

        return bytes;

      default:
        throw "unknown attribute id: " + attributeId;
    }
  },
};
