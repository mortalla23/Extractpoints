var utils = require("../utils/common-utils");

const Status = "Status";
const CountDownThresholds = "CountDownThresholds";
const InstallationRotation = "InstallationRotation";
const VolumeRotation = "VolumeRotation";
const TemperatureMeterFreeze = "TemperatureMeterFreeze";
const TemperatureMinTxoff = "TemperatureMinTxoff";
const ParametersLeakFlow = "ParametersLeakFlow";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case Status:
        let status = bytes.shift();
        return {
          Status: {
            Leak: (status && 0x01) === 1,
            BackWaterLevel1: (status >> 1 && 0x01) === 1,
            BackWaterLevel2: (status >> 2 && 0x01) === 1,
            BackWaterLevel3: (status >> 3 && 0x01) === 1,
            Fraud: (status >> 4 && 0x01) === 1,
            Battery: (status >> 5 && 0x01) === 1,
            Installation: (status >> 6 && 0x01) === 1,
            Freeze: (status >> 7 && 0x01) === 1,
          },
        };
      case CountDownThresholds:
        return {
          Length: bytes.shift(),
          CountDowns: {
            CountDown1: utils.bytesToDec(bytes.splice(0, 2)),
            CountDown2: utils.bytesToDec(bytes.splice(0, 2)),
            CountDown3: utils.bytesToDec(bytes.splice(0, 2)),
          },
        };
      case InstallationRotation:
        return {
          InstallationRotation: bytes.shift(),
        };
      case VolumeRotation:
        return {
          VolumeRotation: utils.bytesToDec(bytes),
        };
      case TemperatureMeterFreeze:
        return {
          Temperature: utils.signedBytesToDec(bytes, 1),
        };
      case TemperatureMinTxoff:
        return {
          Temperature: utils.signedBytesToDec(bytes, 1),
        };
      case ParametersLeakFlow:
        return {
          Length: bytes.shift(),
          Parameters: {
            VolumeThreshold: utils.bytesToDec(bytes.splice(0, 1)),
            PeriodCalculateAverageLeakFlow: utils.bytesToDec(
              bytes.splice(0, 2)
            ),
            PeriodObservationAverageLeakFlow: utils.bytesToDec(
              bytes.splice(0, 2)
            ),
          },
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;
    switch (attributeId) {
      case Status:
        let result = data.Status.Freeze ? 1 : 0;
        result = (result << 1) | (data.Status.Installation ? 1 : 0);
        result = (result << 1) | (data.Status.Battery ? 1 : 0);
        result = (result << 1) | (data.Status.Fraud ? 1 : 0);
        result = (result << 1) | (data.Status.BackWaterLevel1 ? 1 : 0);
        result = (result << 1) | (data.Status.BackWaterLevel2 ? 1 : 0);
        result = (result << 1) | (data.Status.BackWaterLevel3 ? 1 : 0);
        result = (result << 1) | (data.Status.Leak ? 1 : 0);
        bytes = utils.decToBytes(result);
        return bytes;
      case CountDownThresholds:
        bytes = [];
        bytes = bytes.concat(data.Length);
        let countDown1 = utils.decToBytes(data.CountDowns.CountDown1);
        while (countDown1.length < 2) {
          countDown1.unshift(0x00);
        }
        bytes = bytes.concat(countDown1);
        let countDown2 = utils.decToBytes(data.CountDowns.CountDown2);
        while (countDown2.length < 2) {
          countDown2.unshift(0x00);
        }
        bytes = bytes.concat(countDown2);
        let countDown3 = utils.decToBytes(data.CountDowns.CountDown3);
        while (countDown3.length < 2) {
          countDown3.unshift(0x00);
        }
        bytes = bytes.concat(countDown3);
        return bytes;
      case InstallationRotation:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.InstallationRotation));
        return bytes;
      case VolumeRotation:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.VolumeRotation));
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;
      case TemperatureMeterFreeze:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.Temperature));
        return bytes;
      case TemperatureMinTxoff:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.Temperature));
        return bytes;
      case ParametersLeakFlow:
        bytes = [];
        bytes = bytes.concat(data.Length);
        let volumeThreshold = utils.decToBytes(
          data.Parameters.VolumeThreshold
        );
        bytes = bytes.concat(volumeThreshold);
        let periodCalculateAverageLeakFlow = utils.decToBytes(
          data.Parameters.PeriodCalculateAverageLeakFlow
        );
        while (periodCalculateAverageLeakFlow.length < 2) {
          periodCalculateAverageLeakFlow.unshift(0x00);
        }
        bytes = bytes.concat(periodCalculateAverageLeakFlow);
        let periodObservationAverageLeakFlow = utils.decToBytes(
          data.Parameters.PeriodObservationAverageLeakFlow
        );
        while (periodObservationAverageLeakFlow.length < 2) {
          periodObservationAverageLeakFlow.unshift(0x00);
        }
        bytes = bytes.concat(periodObservationAverageLeakFlow);
        return bytes;
      default:
        throw "unknown attribute id: " + attributeId;
    }
  },
};
