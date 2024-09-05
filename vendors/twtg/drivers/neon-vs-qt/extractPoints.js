/**
 * Extract points
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.message - The decoded payload
 * @param {number} [input.time] - The time of the message
 * @returns {Object} The extracted points
 */

function extractPoints(input) {
    let result = {};

  if (input.device_status == null) {
      throw new Error("missing data in extract points input");
  }
  if (input.device_status.temperature != null) {
    if (input.device_status.temperature.min != null) {
      result["temperature:1"] = { unitId: "Cel", record: input.device_status.temperature.min };
    }
    if (input.device_status.temperature.max != null) {
      result["temperature:2"] = { unitId: "Cel", record: input.device_status.temperature.max };
    }
    if (input.device_status.battery_voltage.settle != null) {
      result["temperature:3"] = { unitId: "Cel", record: input.device_status.temperature.settle };
    }
  }
  if (input.device_status.battery_voltage != null) {
    if (input.device_status.battery_voltage.min != null) {
      result["batteryVoltage:1"] = { unitId: "V", record: input.device_status.battery_voltage.min };
    }
    if (input.device_status.battery_voltage.max != null) {
      result["batteryVoltage:2"] = { unitId: "V", record: input.device_status.battery_voltage.max };
    }
    if (input.device_status.battery_voltage.settle != null) {
      result["batteryVoltage:3"] = { unitId: "V", record: input.device_status.battery_voltage.settle };
    }
  }
  /*
  if (input.device_status.tx_counter != null) {
    result["tx_counter"] = input.device_status.tx_counter;
  }
  if (input.device_status.avg_rssi != null) {
    result["avg_rssi"] = input.device_status.avg_rssi;
  }
  if (input.device_status.avg_snr != null) {
    result["avg_snr"] = input.device_status.avg_snr;
  }
  if (input.device_status.event_counter != null) {
    result["event_counter"] = input.device_status.event_counter;
  }
  if (input.device_status.application_config_crc != null) {
    result["application_config_crc"] = input.device_status.application_config_crc;
  }
  if (input.device_status.device_config_crc != null) {
    result["device_config_crc"] = input.device_status.device_config_crc;
  }
  */

  return result;
}

exports.extractPoints = extractPoints;