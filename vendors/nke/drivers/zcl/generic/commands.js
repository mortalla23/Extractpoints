const attributeTypes = require("./attribute_types");
const attributes = require("./attributes");
const status = require("./status");
const clusters = require("./clusters");
const utils = require("../utils/common-utils");
const {decToBytes, encodeReportUnit, bytesToDec} = require("../utils/common-utils");

const commandIds = {
  ReadAttribute: 0x00,
  ReadAttributeResponse: 0x01,
  WriteAttributeNoResponse: 0x05,
  ConfigureReporting: 0x06,
  ConfigureReportingResponse: 0x07,
  ReadReportingConfiguration: 0x08,
  ReadReportingConfigurationResponse: 0x09,
  ReportAttributes: 0x0a,
  ReportAttributesAlarm: 0x8a,
  ClusterSpecificCommand: 0x50,
};

const ReadAttribute = "ReadAttribute";
const ReadAttributeResponse = "ReadAttributeResponse";
const ReportAttributes = "ReportAttributes";
const ReportAttributesAlarm = "ReportAttributesAlarm";
const WriteAttributeNoResponse = "WriteAttributeNoResponse";
const ConfigureReporting = "ConfigureReporting";
const ReadReportingConfigurationResponse = "ReadReportingConfigurationResponse";
const ConfigureReportingResponse = "ConfigureReportingResponse";
const ReadReportingConfiguration = "ReadReportingConfiguration";
const ClusterSpecificCommand = "ClusterSpecificCommand";

module.exports = {
  decodeCommand: function (decoded, bytes) {
    const commandSizeError =
      "command size is not correct for " + decoded.CommandID;

    switch (decoded.CommandID) {
      case ReadAttribute:
        if (bytes.length !== 2) {
          throw commandSizeError;
        }
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        return decoded;
      case ReadAttributeResponse:
        if (bytes.length < 4) {
          throw commandSizeError;
        }
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        decoded.Status = status.decodeStatusId(bytes.shift());
        decoded.AttributeType = attributeTypes.decodeAttributeType(
          bytes.shift()
        );
        decoded.Data = clusters
          .getClusterCodecFromStringId(decoded.ClusterID)
          .decodeData(bytes, decoded.AttributeID, decoded.AttributeType);
        return decoded;
      case ReportAttributes:
      case WriteAttributeNoResponse:
        if (bytes.length < 3) {
          throw commandSizeError;
        }
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        decoded.AttributeType = attributeTypes.decodeAttributeType(
          bytes.shift()
        );
        decoded.Data = clusters
          .getClusterCodecFromStringId(decoded.ClusterID)
          .decodeData(bytes, decoded.AttributeID, decoded.AttributeType);
        return decoded;
      case ReportAttributesAlarm:
        if (bytes.length < 3) {
          throw commandSizeError;
        }
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        decoded.AttributeType = attributeTypes.decodeAttributeType(
            bytes.shift()
        );
        decoded.Data = clusters
            .getClusterCodecFromStringId(decoded.ClusterID)
            .decodeData(bytes, decoded.AttributeID, decoded.AttributeType);
        return decoded;
      case ConfigureReporting:
        if (bytes.length < 8) {
          throw commandSizeError;
        }
        // reserved
        bytes.shift();
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        decoded.AttributeType = attributeTypes.decodeAttributeType(
            bytes.shift()
        );
        var minReport = bytes.splice(0, 2);
        decoded.MinReport = {};
        decoded.MinReport.Unit = utils.getReportUnit(minReport.slice(0, 1));
        var minFirstByte = minReport.shift() & 0x7f;
        minReport = [ minFirstByte, minReport.shift()];

        decoded.MinReport.Value = utils.bytesToDec(minReport);
        var maxReport = bytes.splice(0, 2);
        decoded.MaxReport = {};
        decoded.MaxReport.Unit = utils.getReportUnit(maxReport.slice(0, 1));
        var maxFirstByte = maxReport.shift() & 0x7f;
        maxReport = [ maxFirstByte, maxReport.shift()];
        decoded.MaxReport.Value = utils.bytesToDec(maxReport);
        decoded.Data = clusters
            .getClusterCodecFromStringId(decoded.ClusterID)
            .decodeData(bytes, decoded.AttributeID, decoded.AttributeType);
        return decoded;
      case ReadReportingConfigurationResponse:
        if (bytes.length < 8) {
          throw commandSizeError;
        }
        decoded.Status = status.decodeStatusId(bytes.shift());
        // reserved
        bytes.shift();
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        decoded.AttributeType = attributeTypes.decodeAttributeType(
          bytes.shift()
        );
        var minReport = bytes.splice(0, 2);
        decoded.MinReport = {};
        decoded.MinReport.Unit = utils.getReportUnit(minReport.slice(0, 1));
        var minFirstByte = minReport.shift() & 0x7f;
        minReport = [ minFirstByte, minReport.shift()];
        decoded.MinReport.Value = utils.bytesToDec(minReport);
        var maxReport = bytes.splice(0, 2);
        decoded.MaxReport = {};
        decoded.MaxReport.Unit = utils.getReportUnit(maxReport.slice(0, 1));
        var maxFirstByte = maxReport.shift() & 0x7f;
        maxReport = [ maxFirstByte, maxReport.shift()];
        decoded.MaxReport.Value = utils.bytesToDec(maxReport);
        decoded.Data = clusters
          .getClusterCodecFromStringId(decoded.ClusterID)
          .decodeData(bytes, decoded.AttributeID, decoded.AttributeType);
        return decoded;
      case ConfigureReportingResponse:
        if (bytes.length < 4) {
          throw commandSizeError;
        }
        decoded.Status = status.decodeStatusId(bytes.shift());
        // reserved
        bytes.shift();
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        return decoded;
      case ReadReportingConfiguration:
        if (bytes.length < 3) {
          throw commandSizeError;
        }
        // reserved
        bytes.shift();
        decoded.AttributeID = attributes.decodeAttributeId(decoded.ClusterID, [
          bytes.shift(),
          bytes.shift(),
        ]);
        return decoded;
      case ClusterSpecificCommand:
        return clusters
          .getClusterCodecFromStringId(decoded.ClusterID)
          .decodeCommand(decoded, bytes);
      default:
        throw "unknown command: " + decoded.CommandID;
    }
  },

  encodeCommand: function (message, bytes) {
    switch (message.CommandID) {
      case ReadAttribute:
        utils.checkRequiredField(message, "AttributeID");
        bytes = bytes.concat(
          attributes.encodeAttributeId(message.ClusterID, message.AttributeID)
        );
        return bytes;
      case WriteAttributeNoResponse:
        utils.checkRequiredField(message, "AttributeID");
        utils.checkRequiredField(message, "AttributeType");
        utils.checkRequiredField(message, "Data");
        bytes = bytes.concat(
          attributes.encodeAttributeId(message.ClusterID, message.AttributeID)
        );
        bytes.push(attributeTypes.encodeAttributeType(message.AttributeType));
        bytes = bytes.concat(
          clusters
            .getClusterCodecFromStringId(message.ClusterID)
            .encodeData(message.AttributeID, message.Data, message.AttributeType)
        );
        return bytes;
      case ConfigureReporting:
        utils.checkRequiredField(message, "AttributeID");
        utils.checkRequiredField(message, "AttributeType");
        utils.checkRequiredField(message, "MinReport");
        utils.checkRequiredField(message, "MaxReport");
        utils.checkRequiredField(message, "Data");
        if(message.Status != undefined){
          bytes = bytes.concat(utils.parseHexString(
              utils.decimalToHexStr(Number(message.Status), 1)
          ));
        }
        // reserved
        bytes.push(0x00);
        bytes = bytes.concat(
          attributes.encodeAttributeId(message.ClusterID, message.AttributeID)
        );
        bytes.push(attributeTypes.encodeAttributeType(message.AttributeType));

        var minReportBytes = decToBytes(message.MinReport.Value);
        while (minReportBytes.length < 2) {
          minReportBytes.unshift(0x00);
        }
        var minReportFirstByte = minReportBytes.shift() | encodeReportUnit(message.MinReport.Unit);
        minReportBytes = [minReportFirstByte, minReportBytes.shift()];
        bytes = bytes.concat(minReportBytes);

        var maxReportBytes = decToBytes(message.MaxReport.Value);
        while (maxReportBytes.length < 2) {
          maxReportBytes.unshift(0x00);
        }
        var maxReportFirstByte = maxReportBytes.shift() | encodeReportUnit(message.MaxReport.Unit);
        maxReportBytes = [maxReportFirstByte, maxReportBytes.shift()];
        bytes = bytes.concat(maxReportBytes);

        bytes = bytes.concat(
          clusters
            .getClusterCodecFromStringId(message.ClusterID)
            .encodeData(message.AttributeID, message.Data, message.AttributeType)
        );
        return bytes;
      case ReadReportingConfiguration:
        utils.checkRequiredField(message, "AttributeID");
        if(message.Status != undefined){
          bytes = bytes.concat(utils.parseHexString(
              utils.decimalToHexStr(Number(message.Status), 1)
          ));
        }
        // reserved
        bytes.push(0x00);
        bytes = bytes.concat(
          attributes.encodeAttributeId(message.ClusterID, message.AttributeID)
        );
        return bytes;
      case ClusterSpecificCommand:
        return clusters
          .getClusterCodecFromStringId(message.ClusterID)
          .encodeCommand(message, bytes);
      default:
        throw "unknown command: " + message.CommandID;
    }
  },

  decodeCommandId: function (commandIdByte) {
    const commandId = Object.keys(commandIds).find(
      (key) => commandIds[key] === commandIdByte
    );
    if (commandId === undefined) {
      throw (
        "unknown command id with byte: " + utils.bytesToHex([commandIdByte], 2)
      );
    }
    return commandId;
  },

  encodeCommandId: function (commandIdStr) {
    const commandId = commandIds[commandIdStr];
    if (commandId === undefined) {
      throw "unknown command id: " + commandIdStr;
    }
    return commandId;
  },
};
