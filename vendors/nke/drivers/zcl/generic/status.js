const utils = require("../utils/common-utils");

const statusList = {
  OK: 0x00,
  MalformedCommand: 0x80,
  UnsupportedClusterCommand: 0x81,
  UnsupportedGeneralCommand: 0x82,
  UnsupportedAttribute: 0x86,
  InvalidField: 0x87,
  InvalidValue: 0x88,
  InsufficientSpace: 0x89,
  UnreportableAttribute: 0x8c,
  BatchReportNoFreeSlot: 0xc2,
  BatchReportInvalidTag: 0xc3,
  BatchReportDuplicateTagLabel: 0xc4,
  BatchReportLabelOutOfRange: 0xc5,
};

module.exports = {
  decodeStatusId: function (statusIdByte) {
    const status = Object.keys(statusList).find(
      (key) => statusList[key] === statusIdByte
    );
    if (status === undefined) {
      throw "unknown status id with byte: " + utils.bytesToHex([statusIdByte]);
    }
    return status;
  },
};
