function extractPoints(input){
    let points = {};

    // Check if the message object itself is null or undefined
    if(!input || !input.message) {
        return points;
    }
    
    // Check if batteryVoltage is not null and is defined before accessing it
    if(input.message.batteryVoltage) {
        // Ensure there is a value to replace
        let voltageValue = input.message.batteryVoltage.replace("V", "");
        if (voltageValue) {
            points["batteryVoltage"] = { unitId: "V", record: parseFloat(voltageValue) };
        }
    }
    
    // Check if temperature is not null and is defined before accessing it
    if(input.message.temperature) {
        // Ensure the string is long enough for substring operation and replacement
        let temperatureValue = input.message.temperature.substring(1).replace("°Cel", "");
        if (temperatureValue) {
            points["temperature"] = { unitId: "Cel", record: parseFloat(temperatureValue) };
        }
    }
    if(input.message.carStatus) {
        if(input.message.carStatus==='Free'){
            points["presence"]={unitId:"state", record:false ,nature:"Car"};
        
        }else{
            points["presence"]={unitId:"state",record:true,nature:"Car"};
        }
    }
    return points;
    
}

exports.extractPoints = extractPoints;
