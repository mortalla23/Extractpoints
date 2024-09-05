const basicCodec = require("../clusters/basic_codec");
const simpleMeteringCodec = require("../clusters/simple_metering_codec");
const configurationCodec = require("../clusters/configuration_codec");
const lorawanCodec = require("../clusters/lorawan_codec");
const temperatureCodec = require("../clusters/temperature_codec");
const binaryInputCodec = require("../clusters/binary_input_codec");
const relativeHumidityCodec = require("../clusters/relative_humidity_codec");
const analogInputCodec = require("../clusters/analog_input_codec");
const multiBinaryInputCodec = require("../clusters/multi_binary_input_codec");
const volumeMeterCodec = require("../clusters/volume_meter_codec");
const sensoCodec = require("../clusters/senso_codec");
const onOffCodec = require("../clusters/on_off_codec");
const powerQualityCodec = require("../clusters/power_quality_codec");
const pressureCodec = require("../clusters/pressure_codec");
const differentialPressureCodec = require("../clusters/differential_pressure_codec");
const ticIceCodec = require("../clusters/tic_ice_codec");
const ticCbeCodec = require("../clusters/tic_cbe_codec");
const ticCjeCodec = require("../clusters/tic_cje_codec");
const ticStdCodec = require("../clusters/tic_std_codec");
const ticPmepmiCodec = require("../clusters/tic_pmepmi_codec");
const utils = require("../utils/common-utils");

const clusterIds = {
  Basic: [0x00, 0x00],
  SimpleMetering: [0x00, 0x52],
  Configuration: [0x00, 0x50],
  Lorawan: [0x80, 0x04],
  Temperature: [0x04, 0x02],
  BinaryInput: [0x00, 0x0f],
  RelativeHumidity: [0x04, 0x05],
  AnalogInput: [0x00, 0x0c],
  MultiBinaryInput: [0x80, 0x05],
  VolumeMeter: [0x80, 0x02],
  Senso: [0x80, 0x03],
  OnOff: [0x00, 0x06],
  PowerQuality: [0x80, 0x52],
  Pressure: [0x04, 0x03],
  DifferentialPressure: [0x80, 0x08],
  TicIce: [0x00, 0x53],
  TicCbe: [0x00, 0x54],
  TicCje: [0x00, 0x55],
  TicStd: [0x00, 0x56],
  TicPmepmi: [0x00, 0x57]
};

module.exports = {
  decodeClusterId: function (clusterIdByteArray) {
    const clusterId = Object.keys(clusterIds).find(
      (key) =>
        JSON.stringify(clusterIds[key]) === JSON.stringify(clusterIdByteArray)
    );
    if (clusterId === undefined) {
      throw (
        "unknown cluster id with bytes: " + utils.bytesToHex(clusterIdByteArray)
      );
    }
    return clusterId;
  },
  encodeClusterId: function (clusterIdString) {
    const clusterId = clusterIds[clusterIdString];
    if (clusterId === undefined) {
      throw "unknown cluster id: " + clusterIdString;
    }
    return clusterId;
  },
  getClusterCodecFromStringId: function (clusterIdString) {
    switch (clusterIdString) {
      case "Basic":
        return basicCodec;
      case "SimpleMetering":
        return simpleMeteringCodec;
      case "Configuration":
        return configurationCodec;
      case "Lorawan":
        return lorawanCodec;
      case "Temperature":
        return temperatureCodec;
      case "BinaryInput":
        return binaryInputCodec;
      case "RelativeHumidity":
        return relativeHumidityCodec;
      case "AnalogInput":
        return analogInputCodec;
      case "MultiBinaryInput":
        return multiBinaryInputCodec;
      case "VolumeMeter":
        return volumeMeterCodec;
      case "Senso":
        return sensoCodec;
      case "OnOff":
        return onOffCodec;
      case "PowerQuality":
        return powerQualityCodec;
      case "Pressure":
        return pressureCodec;
      case "DifferentialPressure":
        return differentialPressureCodec;
      case "TicIce":
        return ticIceCodec;
      case "TicCbe":
        return ticCbeCodec;
      case "TicCje":
        return ticCjeCodec;
      case "TicStd":
        return ticStdCodec;
      case "TicPmepmi":
        return ticPmepmiCodec;
      default:
        throw "unknown cluster id: " + clusterIdString;
    }
  },
};
