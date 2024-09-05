var utils = require("../utils/common-utils");
const specificCommandIds = {
  Off: 0x00,
  On: 0x01,
  Toggle: 0x02,
  Pulse: 0xf1,
  Desactivate: 0x50,
};

const State = "State";

const Off = "Off";
const On = "On";
const Toggle = "Toggle";
const Pulse = "Pulse";
const Desactivate = "Desactivate";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case State:
        return {
          RelayState: (bytes.shift() & 0x01) == 1,
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case State:
        let state = data.RelayState ? 1 : 0;
        bytes = [state];
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
      case Off:
        decoded.Data = {
          SpecificCommandType: Off,
        };
        return decoded;
      case On:
        decoded.Data = {
          SpecificCommandType: On,
        };
        return decoded;
      case Toggle:
        decoded.Data = {
          SpecificCommandType: Toggle,
        };
        return decoded;
      case Pulse:
        decoded.Data = {
          SpecificCommandType: Pulse,
          PeriodInSeconds: bytes.shift(),
        };
        return decoded;
      case Desactivate:
        decoded.Data = {
          SpecificCommandType: Desactivate,
          ShouldAcceptCommands: (bytes.shift() & 0x01) == 0,
        };
        return decoded;

      default:
        throw "unknown on/off specific command: " + specificCommandIdByte;
    }
  },
  encodeCommand: function (decoded, bytes) {
    let specificCommandId =
      specificCommandIds[decoded.Data.SpecificCommandType];
    switch (decoded.Data.SpecificCommandType) {
      case On:
        bytes.push(specificCommandId);
        return bytes;
      case Off:
        bytes.push(specificCommandId);
        return bytes;
      case Toggle:
        bytes.push(specificCommandId);
        return bytes;
      case Pulse:
        bytes.push(specificCommandId);
        bytes = bytes.concat(utils.decToBytes(decoded.Data.PeriodInSeconds));
        return bytes;
      case Desactivate:
        bytes.push(specificCommandId);
        let acceptCommands = decoded.Data.ShouldAcceptCommands ? 0 : 1;
        bytes.push(acceptCommands);
        return bytes;
      default:
        throw "unknown on/off specific command: " + specificCommandId;
    }
  },
};
