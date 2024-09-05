var utils = require("../utils/common-utils");
const specificCommandIds = {
  Reset: 0x00,
};

const CurrentValues = "CurrentValues";
const SagCycleThreshold = "SagCycleThreshold";
const SagVoltageThreshold = "SagVoltageThreshold";
const OverVoltageThreshold = "OverVoltageThreshold";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case CurrentValues:
        return {
          Counter: bytes.shift(),
          Fields: {
            Freq: utils.bytesToDec(bytes.splice(0, 2)),
            FreqMin: utils.bytesToDec(bytes.splice(0, 2)),
            FreqMax: utils.bytesToDec(bytes.splice(0, 2)),
            Vrms: utils.bytesToDec(bytes.splice(0, 2)),
            VrmsMin: utils.bytesToDec(bytes.splice(0, 2)),
            VrmsMax: utils.bytesToDec(bytes.splice(0, 2)),
            Vpeak: utils.bytesToDec(bytes.splice(0, 2)),
            VpeakMin: utils.bytesToDec(bytes.splice(0, 2)),
            VpeakMax: utils.bytesToDec(bytes.splice(0, 2)),
            OverVoltageNumber: utils.bytesToDec(bytes.splice(0, 2)),
            SagNumber: utils.bytesToDec(bytes.splice(0, 2)),
            BrownoutNumber: utils.bytesToDec(bytes.splice(0, 2)),
          },
        };
      case SagCycleThreshold:
        return {
          SagHalfCycleThreshold: bytes.shift(),
        };
      case SagVoltageThreshold:
        return {
          SagVoltageThreshold: utils.bytesToDec(bytes.splice(0, 2)),
        };
      case OverVoltageThreshold:
        return {
          PeakOverVoltageThreshold: utils.bytesToDec(bytes.splice(0, 2)),
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case CurrentValues:
        bytes = utils.decToBytes(data.Counter);
        freqBytes = utils.decToBytes(data.Fields.Freq);
        while (freqBytes.length < 2) {
          freqBytes.unshift(0x00);
        }
        bytes = bytes.concat(freqBytes);
        freqMinBytes = utils.decToBytes(data.Fields.FreqMin);
        while (freqMinBytes.length < 2) {
          freqMinBytes.unshift(0x00);
        }
        bytes = bytes.concat(freqMinBytes);
        freqMaxBytes = utils.decToBytes(data.Fields.FreqMax);
        while (freqMaxBytes.length < 2) {
          freqMaxBytes.unshift(0x00);
        }
        bytes = bytes.concat(freqMaxBytes);
        vrmsBytes = utils.decToBytes(data.Fields.Vrms);
        while (vrmsBytes.length < 2) {
          vrmsBytes.unshift(0x00);
        }
        bytes = bytes.concat(vrmsBytes);
        vrmsMinBytes = utils.decToBytes(data.Fields.VrmsMin);
        while (vrmsMinBytes.length < 2) {
          vrmsMinBytes.unshift(0x00);
        }
        bytes = bytes.concat(vrmsMinBytes);
        vrmsMaxBytes = utils.decToBytes(data.Fields.VrmsMax);
        while (vrmsMaxBytes.length < 2) {
          vrmsMaxBytes.unshift(0x00);
        }
        bytes = bytes.concat(vrmsMaxBytes);
        vpeakBytes = utils.decToBytes(data.Fields.Vpeak);
        while (vpeakBytes.length < 2) {
          vpeakBytes.unshift(0x00);
        }
        bytes = bytes.concat(vpeakBytes);
        vpeakMinBytes = utils.decToBytes(data.Fields.VpeakMin);
        while (vpeakMinBytes.length < 2) {
          vpeakMinBytes.unshift(0x00);
        }
        bytes = bytes.concat(vpeakMinBytes);
        vpeakMaxBytes = utils.decToBytes(data.Fields.VpeakMax);
        while (vpeakMaxBytes.length < 2) {
          vpeakMaxBytes.unshift(0x00);
        }
        bytes = bytes.concat(vpeakMaxBytes);
        overVoltageNumberBytes = utils.decToBytes(
          data.Fields.OverVoltageNumber
        );
        while (overVoltageNumberBytes.length < 2) {
          overVoltageNumberBytes.unshift(0x00);
        }
        bytes = bytes.concat(overVoltageNumberBytes);
        sagNumberBytes = utils.decToBytes(data.Fields.SagNumber);
        while (sagNumberBytes.length < 2) {
          sagNumberBytes.unshift(0x00);
        }
        bytes = bytes.concat(sagNumberBytes);
        brownoutNumberBytes = utils.decToBytes(data.Fields.BrownoutNumber);
        while (brownoutNumberBytes.length < 2) {
          brownoutNumberBytes.unshift(0x00);
        }
        bytes = bytes.concat(brownoutNumberBytes);
        return bytes;

      case SagCycleThreshold:
        bytes = [data.SagHalfCycleThreshold];
        return bytes;
      case SagVoltageThreshold:
        bytes = utils.decToBytes(data.SagVoltageThreshold);
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;
      case OverVoltageThreshold:
        bytes = utils.decToBytes(data.PeakOverVoltageThreshold);
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;
    }

    throw "unknown attribute id: " + attributeId;
  },

  decodeCommand: function (decoded, bytes) {
    let specificCommandIdByte = bytes.shift();
    let specificCommandId = Object.keys(specificCommandIds).find(
      (key) => specificCommandIds[key] === specificCommandIdByte
    );
    switch (specificCommandId) {
      case "Reset":
        let fieldsByte = bytes.shift();
        decoded.Data = {
          SpecificCommandType: "Reset",
          Fields: {
            ResetFreqMinAndMax: (fieldsByte & 0x01) == 1,
            ResetVrmsMinAndMax: ((fieldsByte >> 1) & 0x01) == 1,
            ResetVpeakMinAndMax: ((fieldsByte >> 2) & 0x01) == 1,
            ResetSagNumber: ((fieldsByte >> 3) & 0x01) == 1,
            ResetOverVoltageNumber: ((fieldsByte >> 4) & 0x01) == 1,
            ResetOverBrownoutNumber: ((fieldsByte >> 5) & 0x01) == 1,
          },
        };
        return decoded;

      default:
        throw "unknown on/off specific command: " + specificCommandIdByte;
    }
  },
  encodeCommand: function (decoded, bytes) {
    let specificCommandId =
      specificCommandIds[decoded.Data.SpecificCommandType];
    switch (specificCommandId) {
      case 0x00:
        bytes.push(specificCommandId);
        let result = decoded.Data.Fields.ResetOverBrownoutNumber ? 1 : 0;
        result =
          (result << 1) | (decoded.Data.Fields.ResetOverVoltageNumber ? 1 : 0);
        result = (result << 1) | (decoded.Data.Fields.ResetSagNumber ? 1 : 0);
        result =
          (result << 1) | (decoded.Data.Fields.ResetVpeakMinAndMax ? 1 : 0);
        result =
          (result << 1) | (decoded.Data.Fields.ResetVrmsMinAndMax ? 1 : 0);
        result =
          (result << 1) | (decoded.Data.Fields.ResetFreqMinAndMax ? 1 : 0);
        bytes = bytes.concat(result);
        return bytes;
      default:
        throw "unknown on/off specific command: " + specificCommandId;
    }
  },
};
