/**
 * Extract points
 * @param {Object} input - An object provided by the IoT Flow framework
 * @returns {Object} The extracted points
 */
function extractPoints(input) {
  let result = {};
let tempIndex=0;
let battIndex=0;
  // Vérifiez si l'objet input.message existe et si input.message.application_event est défini
  if (input.message && input.message.application_event && input.message.application_event.temperature) {
      result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.application_event.temperature.avg ,nature:"avg"};
      result["temperature:"+tempIndex++]= { unitId: "Cel", record: input.message.application_event.temperature.min,nature:"min" };
      result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.application_event.temperature.max,nature:"max" };
  }

  // Vérifiez si input.message.device_status existe et traitez ses différentes propriétés
  if (input.message && input.message.device_status) {
      if (input.message.device_status.temperature) {
          result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.device_status.temperature.min,nature:"min" };
          result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.device_status.temperature.max ,nature:"max"};
          result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.device_status.temperature.avg,nature:"avg" };
      }
      if (input.message.device_status.battery_voltage) {
          result["batteryVoltage:"+battIndex++] = { unitId: "V", record: input.message.device_status.battery_voltage.low, nature:"low" };
          result["batteryVoltage:"+battIndex++] = { unitId: "V", record: input.message.device_status.battery_voltage.high, nature:"high" };
          result["batteryVoltage:"+battIndex++] = { unitId: "V", record: input.message.device_status.battery_voltage.settle,  nature:"settle" };
      }
      if (input.message.device_status.avg_rssi) {
        result["rssi"] = { unitId: "dBm", record: input.message.device_status.avg_rssi,nature:"avg_rssi" };
    }
    if (input.message.device_status.avg_snr) {
      result["snr"] = { unitId: "dB", record: input.message.device_status.avg_snr,nature:"avg_snr" };
  }
  } else {
      // Gérez l'absence de device_status en lançant une exception ou en gérant une condition d'erreur
      console.warn("Device status data is missing in the input");
  }

  return result;
}

exports.extractPoints = extractPoints;
