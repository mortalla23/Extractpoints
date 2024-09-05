//  this method which will implement the points "contract"
function extractPoints(input) {
    let result = {};

    if (input.message == null) {
        throw new Error("invalid uplink payload: no data received");
    }
    let tempIndex=0;
    if (input.message.temperature != null) {
        // Check if 'temperature2' is also present; if so, handle both temperatures distinctly
        if (input.message.temperature2 != null) {
            result["temperature:" + tempIndex++] = { unitId: "Cel", record: input.message.temperature };
            result["temperature:" + tempIndex++] = { unitId: "Cel", record: input.message.temperature2, nature: "Temperature 2" };
        } else {
            // If 'temperature2' is not present, only add the single temperature entry
            result["temperature"] = { unitId: "Cel", record: input.message.temperature };
        }
    }
    
    if (input.message.temperatureWithNTU != null) {
        result["temperature"] = { unitId: "Cel", record: input.message.temperatureWithNTU,nature:"Temperature With NTU" };
    }
   
    if (input.message.humidity != null) {
        result["humidity"] = { unitId: "%RH", record: input.message.humidity };
    }
    if (input.message.TE5SoildHumidity != null) {
        result["humidity"] = { unitId: "%RH", record: input.message.TE5SoildHumidity ,nature:"TE5Soil Humidity"};
    }
    if (input.message.EC5SoildHumidity != null) {
        result["humidity"] = { unitId: "%RH", record: input.message.EC5SoildHumidity ,nature:"EC5Soil Humidity"};
    }
    if (input.message.batteryVoltage != null) {
        result["batteryVoltage"] = { unitId: "V", record: input.message.batteryVoltage };
        // result.batteryLevel = { unitId: "%", record: getBatteryLevel(input.message.batteryVoltage) };
    }
    if (input.message.illuminance != null) {
        result["illuminance"] = { unitId: "lx", record: input.message.illuminance };
    }
    if (input.message.energy != null) {
        result["energy"] = { unitId: "kWh", record: input.message.energy };
    }
    if (input.message.current != null) {
        result["current"] = { unitId: "mA", record: input.message.current };
    }
    if (input.message.power != null) {
        result["power"] = { unitId: "kW", record: input.message.power };
    }
    if (input.message.resistive != null) {
        result["resistance"] = { unitId: "Ohm", record: input.message.resistive };
    }
    if (input.message.PH != null) {
        result["acidity"] = { unitId: "pH", record: input.message.PH };
    }
    if (input.message.CO2 != null) {
        result["co2Level"] = { unitId: "ppm", record: input.message.CO2 };
    }
    let conIndex=0;
    if (input.message.pm1 != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm1 ,nature:"pm1"};
    }
    if (input.message.pm10 != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm10 ,nature:"pm10"};
    }
    if (input.message.pm25 != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm25 ,nature:"pm25"};
    }
    if (input.message.pm03p != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm03p,nature:"pm03p" };
    }
    if (input.message.pm05p != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm05p,nature:"pm05p" };
    }
    if (input.message.pm010p != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm010p ,nature:"pm010p"};
    }
    if (input.message.pm25p != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm25p ,nature:"pm25p"};
    }
    if (input.message.pm5p != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm5p,nature:"pm5p" };
    }
    if (input.message.pm10p != null) {
        result["concentration:" +conIndex++] = { unitId: "ug/m3", record: input.message.pm10p,nature:"pm10p" };
    }
    
    if (input.message.O3 != null) {
        result["concentration:" + conIndex++] = { unitId: "ppb", record: input.message.O3, nature: "Ozone (O3)" };
    }
    if (input.message.CO != null) {
        result["concentration:" + conIndex++] = { unitId: "ppm", record: input.message.CO, nature: "Carbon Monoxide (CO)" };
    }
    if (input.message.NO != null) {
        result["concentration:" + conIndex++] = { unitId: "ppb", record: input.message.NO, nature: "Nitric Oxide (NO)" };
    }
    if (input.message.NO2 != null) {
        result["concentration:" + conIndex++] = { unitId: "ppb", record: input.message.NO2, nature: "Nitrogen Dioxide (NO2)" };
    }
    if (input.message.SO2 != null) {
        result["concentration:" + conIndex++] = { unitId: "ppb", record: input.message.SO2, nature: "Sulfur Dioxide (SO2)" };
    }
    if (input.message.H2S != null) {
        result["concentration:" + conIndex++] = { unitId: "ppb", record: input.message.H2S, nature: "Hydrogen Sulfide (H2S)" };
    }
    if (input.message.NH3 != null) {
        result["concentration:" + conIndex++] = { unitId: "ppb", record: input.message.NH3, nature: "Ammonia (NH3)" };
    }
    if (input.message.noise != null) {
        result["sound"] = { unitId: "hertz", record: input.message.noise, nature: "Noise" };
    }
    if (input.message.windSpeed != null) {
        result["speed"] = { unitId: "m/s", record: input.message.windSpeed, nature: "Wind speed" };
    }
    let accIndex=0;
    if (input.message.dataX != null) {
        result["acceleration:"+accIndex++] = { unitId: "m/s2", record: input.message.dataX ,nature:"dataX"};
    }
    if (input.message.dataY != null) {
        result["acceleration:"+accIndex++] = { unitId: "m/s2", record: input.message.dataY ,nature:"dataY"};
    }
    if (input.message.dataZ != null) {
        result["acceleration:"+accIndex++] = { unitId: "m/s2", record: input.message.dataZ ,nature:"dataZ"};
    }
    return result;
}
exports.extractPoints = extractPoints;