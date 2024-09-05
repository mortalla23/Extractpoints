var utils = require("../utils/common-utils");

const MeasuredValue = "MeasuredValue";
const MinMeasuredValue = "MinMeasuredValue";
const MaxMeasuredValue = "MaxMeasuredValue";
const MeasurementPeriodAttribute = "MeasurementPeriodAttribute";
const SamplePerMeasurementAttribute = "SamplePerMeasurementAttribute";
const SamplePerConfirmationMeasurementAttribute =
  "SamplePerConfirmationMeasurementAttribute";
const SamplePeriodAttribute = "SamplePeriodAttribute";
const MeanMeasuredValueSinceLastReportAttribute =
  "MeanMeasuredValueSinceLastReportAttribute";
const MinimalMeasuredValueSinceLastReportAttribute =
  "MinimalMeasuredValueSinceLastReportAttribute";
const MaximalMeasuredValueSinceLastReportAttribute =
  "MaximalMeasuredValueSinceLastReportAttribute";

module.exports = {
  decodeData: function (bytes, attributeId) {
    switch (attributeId) {
      case MeasuredValue:
        return {
          MeasuredValue: utils.signedBytesToDec(bytes, 2),
        };
      case MinMeasuredValue:
        return {
          MinMeasuredValue: utils.signedBytesToDec(bytes, 2),
        };
      case MaxMeasuredValue:
        return {
          MaxMeasuredValue: utils.signedBytesToDec(bytes, 2),
        };
      case MeasurementPeriodAttribute:
        return {
          Period: utils.bytesToDec(bytes),
        };
      case SamplePerMeasurementAttribute:
        return {
          NumberOfSamples: utils.bytesToDec(bytes),
        };
      case SamplePerConfirmationMeasurementAttribute:
        return {
          NumberOfConfirmationSamples: utils.bytesToDec(bytes),
        };
      case SamplePeriodAttribute:
        return {
          SamplingPeriod: utils.bytesToDec(bytes),
        };
      case MeanMeasuredValueSinceLastReportAttribute:
        return {
          MeanMeasuredValueSinceLastReport: utils.signedBytesToDec(bytes, 2),
        };
      case MinimalMeasuredValueSinceLastReportAttribute:
        return {
          MinimalMeasuredValueSinceLastReport: utils.signedBytesToDec(bytes, 2),
        };
      case MaximalMeasuredValueSinceLastReportAttribute:
        return {
          MaximalMeasuredValueSinceLastReport: utils.signedBytesToDec(bytes, 2),
        };
    }

    throw "unknown attribute id: " + attributeId;
  },

  encodeData: function (attributeId, data) {
    let bytes;

    switch (attributeId) {
      case MeasuredValue:
        bytes = [];
        let measuredValueBytes = utils.decToBytes(data.MeasuredValue);
        while (measuredValueBytes.length < 2) {
          measuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(measuredValueBytes);
        return bytes;
      case MinMeasuredValue:
        bytes = [];
        let minMeasuredValueBytes = utils.decToBytes(data.MinMeasuredValue);
        while (minMeasuredValueBytes.length < 2) {
          minMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(minMeasuredValueBytes);
        return bytes;
      case MaxMeasuredValue:
        bytes = [];
        let maxMeasuredValueBytes = utils.decToBytes(data.MaxMeasuredValue);
        while (maxMeasuredValueBytes.length < 2) {
          maxMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(maxMeasuredValueBytes);
        return bytes;
      case MeasurementPeriodAttribute:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.Period));
        while (bytes.length < 4) {
          bytes.unshift(0x00);
        }
        return bytes;
      case SamplePerMeasurementAttribute:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.NumberOfSamples));
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;
      case SamplePerConfirmationMeasurementAttribute:
        bytes = [];
        bytes = bytes.concat(
          utils.decToBytes(data.NumberOfConfirmationSamples)
        );
        while (bytes.length < 2) {
          bytes.unshift(0x00);
        }
        return bytes;
      case SamplePeriodAttribute:
        bytes = [];
        bytes = bytes.concat(utils.decToBytes(data.SamplingPeriod));
        while (bytes.length < 4) {
          bytes.unshift(0x00);
        }
        return bytes;
      case MeanMeasuredValueSinceLastReportAttribute:
        bytes = [];
        let meanMeasuredValueBytes = utils.decToBytes(
          data.MeanMeasuredValueSinceLastReport
        );
        while (meanMeasuredValueBytes.length < 2) {
          meanMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(meanMeasuredValueBytes);
        return bytes;
      case MinimalMeasuredValueSinceLastReportAttribute:
        bytes = [];
        let minimalMeasuredValueBytes = utils.decToBytes(
          data.MinimalMeasuredValueSinceLastReport
        );
        while (minimalMeasuredValueBytes.length < 2) {
          minimalMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(minimalMeasuredValueBytes);
        return bytes;
      case MaximalMeasuredValueSinceLastReportAttribute:
        bytes = [];
        let maximalMeasuredValueBytes = utils.decToBytes(
          data.MaximalMeasuredValueSinceLastReport
        );
        while (maximalMeasuredValueBytes.length < 2) {
          maximalMeasuredValueBytes.unshift(0x00);
        }
        bytes = bytes.concat(maximalMeasuredValueBytes);
        return bytes;
    }

    throw "unknown attribute id: " + attributeId;
  },
};
