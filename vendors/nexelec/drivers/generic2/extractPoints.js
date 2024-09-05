
function extractPoints(input){
    var points = {};

    if(input.message === null) {
        return points;
    }

    let timeIncrement = 1;
    let tempIncrement = 1;
    let humIncrement = 1;
    let co2Increment = 1;
    let concentIncrement = 1;
    let lightIncrement = 1;
    let noiseIncrement = 1;
    let occupancyIncrement = 1;
    let voltageIncrement = 1;
    let ageIncrement = 1;
    
    if(input.message["typeOfMessage"] === "Periodic data") {
        if(input.message["temperature"] && input.message["temperature"].value) {
            points[`temperature:${tempIncrement++}`] = { unitId: "Cel", record: input.message["temperature"].value };
        }
        
        if(input.message["humidity"] && input.message["humidity"].value) {
            points[`humidity:${humIncrement++}`] = { unitId: "%RH", record: input.message["humidity"].value };
        }
        
        if(input.message["co2"] && input.message["co2"].value) {
            points[`co2Level:${co2Increment++}`] = { unitId: "ppm", record: input.message["co2"].value };
        }
        
        if(input.message["covt"] && input.message["covt"].value) {
            points[`concentration:${concentIncrement++}`] = { unitId: "ug/m3", record: input.message["covt"].value };
        }
        
        if(input.message["luminosity"] && input.message["luminosity"].value) {
            points[`illuminance:${lightIncrement++}`] = { unitId: "lx", record: input.message["luminosity"].value };
        }
        
        if(input.message["averageNoise"] && input.message["averageNoise"].value) {
            points[`intensity:${noiseIncrement++}`] = { unitId: "dB", record: input.message["averageNoise"].value };
        }
        
        if(input.message["peakNoise"] && input.message["peakNoise"].value) {
            points[`intensity:${noiseIncrement++}`] = { unitId: "dB", record: input.message["peakNoise"].value };
        }
        
        if(input.message["occupancyRate"] && input.message["occupancyRate"].value) {
            points[`percentage:${occupancyIncrement++}`] = { unitId: "%", record: input.message["occupancyRate"].value };
        }
    }
    else if(input.message["typeOfMessage"] === "CO2 Historical Data"){
        if(input.message["co2"] && input.message["co2"].value && input.message["co2"].unit) {
            for(let co2Value of input.message["co2"].value) {
                points[`co2Level:${co2Increment++}`] = { unitId: "ppm", record: co2Value };
            }
        }
    }
    else if(input.message["typeOfMessage"] === "Temperature Historical Data") {
        if(input.message["temperature"] && input.message["temperature"].value && input.message["temperature"].unit) {
            for(let timeValue of input.message["temperature"].value) {
                points[`temperature:${tempIncrement++}`] = { unitId: "Cel", record: timeValue };
            }
        }
    }
    else if(input.message["typeOfMessage"] === "Product Status") {
        if(input.message["batteryVoltage"] && input.message["batteryVoltage"].value) {
            points[`batteryVoltage:${voltageIncrement++}`] = { unitId: "mV", record: input.message["batteryVoltage"].value };
        }
        
        if(input.message["cumulativeProductActivationTime"] && input.message["cumulativeProductActivationTime"].value) {
            points[`age:${ageIncrement++}`] = { unitId: "hour", record: input.message["cumulativeProductActivationTime"].value*30*24 };
        }

        if(input.message["timeSinceLastManualCalibration"] && input.message["timeSinceLastManualCalibration"].value) {
            points[`age:${ageIncrement++}`] = { unitId: "hour", record: input.message["timeSinceLastManualCalibration"].value*24 };
        }

        if(input.message["lowBatterieThreshold"] && input.message["lowBatterieThreshold"].value) {
            points[`batteryVoltage:${voltageIncrement++}`] = { unitId: "mV", record: input.message["lowBatterieThreshold"].value };
        }
    }
    else if(input.message["typeOfMessage"] === "Product Configuration") {
        if(input.message["periodBetween2measures"] && input.message["periodBetween2measures"].value) {
            points[`interval:${timeIncrement++}`] = { unitId: "minute", record: input.message["periodBetween2measures"].value };
        }
        
        if(input.message["mediumCO2Threshold"] && input.message["mediumCO2Threshold"].value) {
            points[`co2Level:${co2Increment++}`] = { unitId: "ppm", record: input.message["mediumCO2Threshold"].value };
        }
        
        if(input.message["dataTransmissionPeriod"] && input.message["dataTransmissionPeriod"].value) {
            points[`interval:${timeIncrement++}`] = { unitId: "minute", record: input.message["dataTransmissionPeriod"].value };
        }

        if(input.message["deltaCO2"] && input.message["deltaCO2"].value) {
            points[`co2Level:${co2Increment++}`] = { unitId: "ppm", record: input.message["deltaCO2"].value };
        }

        if(input.message["deltaTemperature"] && input.message["deltaTemperature"].value) {
            points[`temperature:${tempIncrement++}`] = { unitId: "Cel", record: input.message["deltaTemperature"].value };
        }

        if( input.message["productDateYear"] && input.message["productDateYear"].value &&
            input.message["productDateMonth"] && input.message["productDateMonth"].value &&
            input.message["productDateDay"] && input.message["productDateDay"].value &&
            input.message["productDateHours"] && input.message["productDateHours"].value &&
            input.message["productDateMinutes"] && input.message["productDateMinutes"].value) {

            points[`age:${ageIncrement++}`] = { 
                unitId: "s",
                record: new Date(input.message["productDateYear"].value, input.message["productDateMonth"].value - 1, input.message["productDateDay"].value, input.message["productDateHours"].value, input.message["productDateMinutes"].value).getTime()
            };
        }
    }

    
    if(input.message["typeOfMessage"] === "CO2 Historical Data" || input.message["typeOfMessage"] === "Temperature Historical Data") {
        if(input.message["periodBetweenRecord"] && input.message["periodBetweenRecord"].value) {
            points[`interval:${timeIncrement++}`] = { unitId: "minute", record: input.message["periodBetweenRecord"].value }
        }
    }


    return points;
}

exports.extractPoints = extractPoints;