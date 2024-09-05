const utils = require("../utils/common-utils");

const attributes = {
  Basic: {
    FirmwareVersion: [0x00, 0x02],
    KernelVersion: [0x00, 0x03],
    Manufacturer: [0x00, 0x04],
    ModelIdentifier: [0x00, 0x05],
    DateCode: [0x00, 0x06],
    LocationDescription: [0x00, 0x10],
    ApplicationName: [0x80, 0x01],
  },
  SimpleMetering: {
    CurrentMetering: [0x00, 0x00],
  },
  Configuration: {
    Descriptor: [0x00, 0x04],
    NodePowerDescriptor: [0x00, 0x06],
    Action: [0xff],
  },
  Lorawan: {
    MessageType: [0x00, 0x00],
    NumberOfRetryIfConfirmed: [0x00, 0x01],
    ReAssociation: [0x00, 0x02],
    DataRate: [0x00, 0x03],
    ABPDevAddr: [0x00, 0x04],
    OTAAppEUI: [0x00, 0x05],
  },
  Temperature: {
    MeasuredValue: [0x00, 0x00],
    MinMeasuredValue: [0x00, 0x01],
    MaxMeasuredValue: [0x00, 0x02],
  },
  BinaryInput: {
    PresentValue: [0x00, 0x55],
    Count: [0x04, 0x02],
    Polarity: [0x00, 0x54],
    EdgeSelection: [0x04, 0x00],
    DebouncePeriod: [0x04, 0x01],
    ApplicationType: [0x01, 0x00],
  },
  RelativeHumidity: {
    MeasuredValue: [0x00, 0x00],
    MinMeasuredValue: [0x00, 0x01],
    MaxMeasuredValue: [0x00, 0x02],
  },
  Pressure: {
    MeasuredValue: [0x00, 0x00],
    MinMeasuredValue: [0x00, 0x01],
    MaxMeasuredValue: [0x00, 0x02],
  },
  AnalogInput: {
    PresentValue: [0x00, 0x55],
    ApplicationType: [0x01, 0x00],
    PowerDuration: [0x80, 0x03],
  },
  MultiBinaryInput: {
    PresentValues: [0x00, 0x00],
  },
  VolumeMeter: {
    Volume: [0x00, 0x00],
    VolumeDisplayMode: [0x00, 0x01],
    MinFlow: [0x00, 0x02],
    MaxFlow: [0x00, 0x03],
    FlowDisplayMode: [0x00, 0x04],
  },
  Senso: {
    Status: [0x00, 0x00],
    CountDownThresholds: [0x00, 0x01],
    InstallationRotation: [0x00, 0x02],
    VolumeRotation: [0x00, 0x03],
    TemperatureMeterFreeze: [0x00, 0x04],
    TemperatureMinTxoff: [0x00, 0x05],
    ParametersLeakFlow: [0x00, 0x06],
  },
  OnOff: {
    State: [0x00, 0x00],
  },
  PowerQuality: {
    CurrentValues: [0x00, 0x00],
    SagCycleThreshold: [0x00, 0x01],
    SagVoltageThreshold: [0x00, 0x02],
    OverVoltageThreshold: [0x00, 0x03],
  },
  DifferentialPressure: {
    MeasuredValue: [0x00, 0x00],
    MinMeasuredValue: [0x00, 0x01],
    MaxMeasuredValue: [0x00, 0x02],
    MeasurementPeriodAttribute: [0x00, 0x03],
    SamplePerMeasurementAttribute: [0x00, 0x04],
    SamplePerConfirmationMeasurementAttribute: [0x00, 0x05],
    SamplePeriodAttribute: [0x00, 0x06],
    MeanMeasuredValueSinceLastReportAttribute: [0x01, 0x00],
    MinimalMeasuredValueSinceLastReportAttribute: [0x01, 0x01],
    MaximalMeasuredValueSinceLastReportAttribute: [0x01, 0x02],
  },
  TicIce: {
    MeterType: [0x00, 0x10],
    ReadingPeriod: [0x00, 0x11],
    IceGeneralOriginal: [0x00, 0x00],
    IceGeneralCopy1: [0x01, 0x00],
    IceEpOriginal: [0x00, 0x01],
    IceEpCopy1: [0x01, 0x01],
    IceEp1Original: [0x00, 0x02],
    IceEp1Copy1: [0x01, 0x02]
  },
  TicCbe: {
    MeterType: [0x00, 0x10],
    ReadingPeriod: [0x00, 0x11],
    CbeGeneralOriginal: [0x00, 0x00],
    CbeGeneralCopy1: [0x01, 0x00],
    CbeGeneralCopy2: [0x02, 0x00],
    CbeGeneralCopy3: [0x03, 0x00],
    CbeGeneralCopy4: [0x04, 0x00],
    CbeGeneralCopy5: [0x05, 0x00],
  },
  TicCje: {
    MeterType: [0x00, 0x10],
    ReadingPeriod: [0x00, 0x11],
    CjeGeneralOriginal: [0x00, 0x00],
    CjeGeneralCopy1: [0x01, 0x00],
    CjeGeneralCopy2: [0x02, 0x00],
    CjeGeneralCopy3: [0x03, 0x00],
    CjeGeneralCopy4: [0x04, 0x00],
    CjeGeneralCopy5: [0x05, 0x00],

  },
  TicStd: {
    MeterType: [0x00, 0x10],
    ReadingPeriod: [0x00, 0x11],
    StdGeneralOriginal: [0x00, 0x00],
    StdGeneralCopy1: [0x01, 0x00],
    StdGeneralCopy2: [0x02, 0x00],
    StdGeneralCopy3: [0x03, 0x00],
    StdGeneralCopy4: [0x04, 0x00],
    StdGeneralCopy5: [0x05, 0x00],
  },
  TicPmepmi: {
    MeterType: [0x00, 0x10],
    ReadingPeriod: [0x00, 0x11],
    PmepmiGeneralOriginal: [0x00, 0x00],
    PmepmiGeneralCopy1: [0x01, 0x00],
    PmepmiGeneralCopy2: [0x02, 0x00],
    PmepmiGeneralCopy3: [0x03, 0x00],
    PmepmiGeneralCopy4: [0x04, 0x00],
    PmepmiGeneralCopy5: [0x05, 0x00],
  }
};

module.exports = {
  decodeAttributeId: function (clusterStringId, attributeByteArrayId) {
    let attributeId;
    if (attributeByteArrayId[0] == 0xff) {
      const numberOfAction = attributeByteArrayId[1];
      attributeByteArrayId = [attributeByteArrayId.shift()];
      attributeId = Object.keys(attributes[clusterStringId]).find(
        (key) =>
          JSON.stringify(attributes[clusterStringId][key]) ===
          JSON.stringify(attributeByteArrayId)
      );
      attributeId = attributeId.concat(numberOfAction);
    } else {
      attributeId = Object.keys(attributes[clusterStringId]).find(
        (key) =>
          JSON.stringify(attributes[clusterStringId][key]) ===
          JSON.stringify(attributeByteArrayId)
      );
    }
    if (attributeId === undefined) {
      throw (
        "unknown attribute id for cluster: " +
        clusterStringId +
        " and attribute id bytes: " +
        utils.bytesToHex(attributeByteArrayId)
      );
    }
    return attributeId;
  },
  encodeAttributeId: function (clusterStringId, attributeStringId) {
    if (attributeStringId.startsWith("Action")) {
      let result = attributes[clusterStringId]["Action"];
      const attributeStringIdNb = parseInt(attributeStringId.substring(6), 10);
      result = result.concat(attributeStringIdNb);
      return result;
    }
    return attributes[clusterStringId][attributeStringId];
  },
};
