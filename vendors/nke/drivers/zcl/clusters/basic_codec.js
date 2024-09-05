var utils = require("../utils/common-utils");

const FirmwareVersion = "FirmwareVersion";
const KernelVersion = "KernelVersion";
const Manufacturer = "Manufacturer";
const ModelIdentifier = "ModelIdentifier";
const DateCode = "DateCode";
const LocationDescription = "LocationDescription";
const ApplicationName = "ApplicationName";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case FirmwareVersion:
        return {
          Major: bytes.shift(),
          Minor: bytes.shift(),
          Revision: bytes.shift(),
          Build: utils.signedBytesToDec(bytes, 3),
        };
      case KernelVersion:
        bytes.shift();
        //  the name is kernelName to be compatible with the java driver. However, in the documentation it is kernelVersion.
        return {
          KernelName: utils.bytesToAscii(bytes),
        };
      case Manufacturer:
        bytes.shift();
        return {
          ManufacturerName: utils.bytesToAscii(bytes),
        };
      case ModelIdentifier:
        bytes.shift();
        return {
          ModelIdentifier: utils.bytesToAscii(bytes),
        };
      case DateCode:
        bytes.shift();
        let date = utils.bytesToAscii(bytes);
        return {
          DateCode:
            date.substring(0, 2) +
            "/" +
            date.substring(2, 4) +
            "/" +
            date.substring(4, 8),
        };
      case LocationDescription:
        bytes.shift();
        return {
          SensorPosition: utils.bytesToAscii(bytes),
        };
      case ApplicationName:
        bytes.shift();
        return {
          ApplicationName: utils.bytesToAscii(bytes),
        };
      default:
        throw "unknown attribute Id: " + attributeId;
    }
  },

  encodeData: function (attributeId, data) {
    switch (attributeId) {
      case LocationDescription:
        let bytes = [data.SensorPosition.length];
        bytes = bytes.concat(utils.asciiToBytes(data.SensorPosition));
        return bytes;
      default:
        throw "unknown attribute id: " + attributeId;
    }
  },
};
