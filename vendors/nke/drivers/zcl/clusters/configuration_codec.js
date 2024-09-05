var utils = require("../utils/common-utils");
const specificCommandIds = {
  REBOOT: 0x00,
  RemoveReports: 0x02,
  GetSpecificBatch: 0x03,
  ExecuteActions: 0xf0,
};

const Descriptor = "Descriptor";
const NodePowerDescriptor = "NodePowerDescriptor";
const Action = "Action";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case Descriptor:
        bytes.splice(0, 2);
        let endpoints = [];
        let nbEndpoints = bytes.shift();

        for (let i = 0; i < nbEndpoints; i++) {
          let endpoint = {};
          endpoint.EndpointNumber = bytes.shift();
          let numberOfInputClusters = bytes.shift();
          endpoint.UsedInputClusterId = [];
          for (let j = 0; j < numberOfInputClusters; j++) {
            endpoint.UsedInputClusterId.push(
              utils.bytesToDec(bytes.splice(0, 2))
            );
          }
          let numberOfOutputClusters = bytes.shift();
          endpoint.UsedOutputClustersId = [];
          for (let j = 0; j < numberOfOutputClusters; j++) {
            endpoint.UsedOutputClustersId.push(
              utils.bytesToDec(bytes.splice(0, 2))
            );
          }
          endpoints.push(endpoint);
        }
        return {
          Endpoints: endpoints,
        };
      case NodePowerDescriptor:
        bytes.shift();
        let result = {
          CurrentPowerMode: utils.getPowerMode(bytes.shift()),
        };
        let availablePowerSources = bytes.shift();
        result.AvailablePowerSourceBitField = availablePowerSources;
        result.VoltageLevels = [];
        for (let i = 0; i < availablePowerSources; i++) {
          result.VoltageLevels.push(bytes.shift() * 256 + bytes.shift());
        }
        result.CurrentPowerSource = utils.getPowerSource(bytes.shift());
        return result;
    }
    if (attributeId.startsWith(Action)) {
      bytes.shift();
      return {
        ZclCommand: utils.bytesToHex(bytes),
      };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case NodePowerDescriptor:
        let bytesToAdd = [];
        bytesToAdd = bytesToAdd.concat(
          utils.encodePowerMode(data.CurrentPowerMode)
        );
        bytesToAdd = bytesToAdd.concat(
            utils.decToBytes(data.AvailablePowerSourceBitField)
        );
        let voltageLevelArrayBytes = [];
        for (let i = 0; i < data.VoltageLevels.length; i++) {
          let voltageLevelArray = [];
          voltageLevelArray.push(utils.decToBytes(data.VoltageLevels[i]));
          while (voltageLevelArray.length < 2) {
            voltageLevelArray.unshift(0x00);
          }
          voltageLevelArrayBytes.push(voltageLevelArray);
        }
        voltageLevelArrayBytes = [].concat.apply([], voltageLevelArrayBytes);
        bytesToAdd = bytesToAdd.concat(voltageLevelArrayBytes);
        bytesToAdd = [].concat.apply([], bytesToAdd);
        bytesToAdd = bytesToAdd.concat(
          utils.encodePowerSource(data.CurrentPowerSource)
        );
        let bytes = [bytesToAdd.length];
        bytes = bytes.concat(bytesToAdd);
        return bytes;
    }
    if (attributeId.startsWith(Action)) {
      bytes = [data.ZclCommand.length / 2];
      bytes = bytes.concat(utils.hexToBytes(data.ZclCommand));
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
      case "REBOOT":
        decoded.Data = {
          specificCommandType: "REBOOT",
        };
        return decoded;
      case "RemoveReports":
        decoded.Data = {
          specificCommandType: "RemoveReports",
          reportsToRemove: utils.getReportType(bytes.shift()),
        };
        return decoded;
      case "GetSpecificBatch":
        decoded.Data = {
          specificCommandType: "GetSpecificBatch",
          batchCounter: bytes.shift(),
        };
        return decoded;
      case "ExecuteActions":
        decoded.Data = {
          specificCommandType: "ExecuteActions",
        };
        const size = bytes.shift() / 2;
        for (let i = 1; i <= size; i++) {
          const ActionId = "ActionId".concat(i.toString());
          const ActionVal = "ActionVal".concat(i.toString());
          decoded.Data[ActionId] = bytes.shift();
          decoded.Data[ActionVal] = bytes.shift();
        }
        return decoded;
    }
    throw "unknown configuration specific command: " + specificCommandIdByte;
  },

  encodeCommand: function (decoded, bytes) {
    let specificCommandId =
      specificCommandIds[decoded.Data.specificCommandType];
    switch (specificCommandId) {
      case 0x02:
        bytes.push(specificCommandId);
        bytes.push(utils.encodeReportType(decoded.Data.reportsToRemove));
        return bytes;
      case 0xf0:
        bytes.push(specificCommandId);
        let actions = [];
        let i = 1;
        let ActionId = "ActionId".concat(i.toString());
        let ActionVal = "ActionVal".concat(i.toString());
        while (
          decoded.Data[ActionId] != null &&
          decoded.Data[ActionVal] != null
        ) {
          actions.push(decoded.Data[ActionId]);
          actions.push(decoded.Data[ActionVal]);
          i++;
          ActionId = "ActionId".concat(i.toString());
          ActionVal = "ActionVal".concat(i.toString());
        }
        bytes.push(i + 1);
        bytes = bytes.concat(actions);
        return bytes;
      case 0x03:
        bytes.push(specificCommandId);
        bytes.push(decoded.Data.batchCounter);
        return bytes;
      default:
        bytes.push(specificCommandId);
        return bytes;
    }
  },
};
