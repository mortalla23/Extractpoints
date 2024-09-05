function extractPoints(input) {
    const result = {};
    
    if (input.message.battery_volt !== undefined) {
        result.batteryVoltage = { unitId: "V", record: input.message.battery_volt };
    }
    
    if (input.message.temperature !== undefined) {
        result.temperature = { unitId: "Cel", record: parseFloat(input.message.temperature) };
    }
    
    if (input.message.humi !== undefined) {
        const humidity = parseFloat(input.message.humi);
        if (!isNaN(humidity)) {
            result.humidity = { unitId: "%RH", record: humidity };
        } else {
            console.warn("[Record Type]: Type of record 'string' DOES NOT match required sensor value type of 'double'");
        }
    }
    if (input.message.co2_ppm !== undefined) {
        result["co2Level"] = { unitId: "ppm", record: parseFloat(input.message.co2_ppm) };
    }
    let stateIndex=0;
    if (input.message.button!== undefined) {
        result["status:"+stateIndex++] = { unitId: "state", record: input.message.button===1, nature:"Button" };
    }
    if (input.message.trigger!== undefined) {
        result["status:"+stateIndex++] = { unitId: "state", record: input.message.trigger===1, nature:"Trigger" };
    }
    if (input.message.co2threshold!== undefined) {
        result["status:"+stateIndex++] = { unitId: "state", record: input.message.co2threshold===1, nature:"CO2 threshold" };
    }
    if (input.message.co2calibration!== undefined) {
        result["status:"+stateIndex++] = { unitId: "state", record: input.message.co2calibration===1, nature:"CO2 calibration" };
    }
    return result;
}

exports.extractPoints = extractPoints;
