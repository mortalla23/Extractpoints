function extractPoints(input) {
    let result = {};

    if (input.message.measurements == null) {
        return result;
    }

    var voltageCount = 0;
    var tempCount = 0;
    var humCount = 0;
    var pressureCount = 0;
    var distCount = 0;
    var amountCount = 0;
    var illuminanceCount = 0;
    var co2Count = 0;
    var SPLCount = 0;
    var concentrationCount = 0;
    var coounterIndex=0;

    for(const measurementIndex in input.message.measurements) {
        const measurement = input.message.measurements[measurementIndex];

        if(measurement.typeName === "battery voltage") {
            result["batteryVoltage:" + voltageCount] = { unitId: "mV", record: measurement.value };
            voltageCount++;
        }
        else if(measurement.typeName === "temperature") {
            result["temperature:" + tempCount] = { unitId: "Cel", record: measurement.value };
            tempCount++;
        }
        else if(measurement.typeName === "relative humidity") {
            result["humidity:" + humCount] = { unitId: "%RH", record: measurement.value };
            humCount++;
        }
        else if(measurement.typeName === "pressure") {
            result["pressure:" + pressureCount] = { unitId: "hPa", record: measurement.value };
            pressureCount++;
        }
        else if(measurement.typeName === "distance") {
            result["distance:" + distCount] = { unitId: "mm", record: measurement.value };
            distCount++;
        }
        else if(measurement.typeName === "illuminance") {
            result["illuminance:" + illuminanceCount] = { unitId: "lx", record: measurement.value };
            illuminanceCount++;
        }
        else if(measurement.typeName === "TVOC concentration") {
            result["amount:" + amountCount] = { unitId: "ppb", record: measurement.value };
            amountCount++;
        }
        else if(measurement.typeName === "CO") {
            result["amount:" + amountCount] = { unitId: "ppb", record: measurement.value*1000 };
            amountCount++;
        }
        else if(measurement.typeName === "CO2") {
            result["co2Level:" + co2Count] = { unitId: "ppb", record: measurement.value*1000 };
            co2Count++;
        }
        else if(measurement.typeName === "sound pressure level") {
            result["intensity:" + SPLCount] = { unitId: "dB", record: measurement.value };
            SPLCount++;
        }
        else if(measurement.typeName === "dust concentration") {
            result["concentration:" + concentrationCount] = { unitId: "ug/m3", record: measurement.value };
            concentrationCount++;
        }
        else if(measurement.typeName === "counter") {
            result["counter:" + coounterIndex] = { unitId: "count", record: measurement.value };
            coounterIndex++;
        }
    }

    return result;
}

exports.extractPoints = extractPoints;