const utils = require("../utils/common-utils");

const attributeTypes = {
  Boolean: 0x10,
  General8: 0x08,
  General16: 0x09,
  General24: 0x0a,
  General32: 0x0b,
  General40: 0x0c,
  General48: 0x0d,
  Bitmap8: 0x18,
  Bitmap16: 0x19,
  UInt8: 0x20,
  UInt16: 0x21,
  UInt24: 0x22,
  UInt32: 0x23,
  Int8: 0x28,
  Int16: 0x29,
  Int32: 0x2b,
  UInt8Enum: 0x30,
  SinglePrecision: 0x39,
  CharString: 0x42,
  ByteString: 0x41,
  LongByteString: 0x43,
  StructOrderedSequence: 0x4c,
};

module.exports = {
  decodeAttributeType: function (attributeTypeByte) {
    const attributeType = Object.keys(attributeTypes).find(
      (key) => attributeTypes[key] === attributeTypeByte
    );
    if (attributeType === undefined) {
      throw (
        "unknown attribute type with byte: " +
        utils.bytesToHex([attributeTypeByte])
      );
    }
    return attributeType;
  },
  encodeAttributeType: function (attributeTypeString) {
    return attributeTypes[attributeTypeString];
  },
};
