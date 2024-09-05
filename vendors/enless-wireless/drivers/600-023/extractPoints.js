function extractPoints(input) {
    if (!input || !input.message) {
        throw new Error("Invalid uplink payload: no data received to extract points");
    }

    const result = {};
    const data = input.message;

    if (data && data.states && typeof data.states.battery === 'string') {
        const batteryLevel = data.states.battery.replace('%', ''); // Retire le symbole pourcent
        result["batteryLevel"] = {
            unitId: "%",
            record: parseFloat(batteryLevel)
        };
    }

    // Extract temperature data if available
    if (data && data.values && data.values.temperature) {
        const temperatureValue = parseFloat(data.values.temperature.value);
        if (temperatureValue >= -40 && temperatureValue <= 125) {
            result["temperature"] = {
                unitId: "Cel",
                record: temperatureValue
            };
        } else {
            result["temperature"] = {
                unitId: "Cel",
                record: "Error",
                nature:"Value temperature invalid"
            };
        }
    }

    // Extract humidity data if available
    if (data && data.values && data.values.humidity) {
        const humidityValue = parseFloat(data.values.humidity.value);
        if (humidityValue >= 0 && humidityValue <= 100) {
            result["humidity"] = {
                unitId: "%RH",
                record: humidityValue
            };
        } else {
            result["humidity"] = {
                unitId: "%RH",
                record: "Error",
                nature:"Value humidity invalid"
            };
        }
    }

    // Extract CO2 level data if available
    if (data && data.values && data.values.co2) {
        const co2Value = parseFloat(data.values.co2.value);
        if (co2Value >= 0 && co2Value <= 5000) {
            result["co2Level"] = {
                unitId: "ppm",
                record: co2Value
            };
        } else {
            result["co2Level"] = {
                unitId: "ppm",
                record: "Error",
                nature:"Value co2 invalid"
            };
        }
    }

    // Extract VOC data if available
    if (data && data.values && data.values.voc) {
        const vocValue = parseFloat(data.values.voc.value);
        result["concentration"] = {
            unitId: "ppb",
            record: vocValue,
            nature: "VOC"
        };
    }

    return result;
}

exports.extractPoints = extractPoints;
