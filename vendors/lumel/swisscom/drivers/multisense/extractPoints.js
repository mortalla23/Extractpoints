function extractPoints(input) {
    let result = {};
    
    if (typeof input.message.temperature !== "undefined") {
        result.temperature = { unitId: "Cel", record: input.message.temperature };
    }
    if (typeof input.message.accelerometer !== "undefined") {
        result["acceleration"] = { unitId: "gravity", record: input.message.accelerometer };
    }
    // if (typeof input.message.accelerometer !== "undefined") {
    //     result["acceleration:x"] = { unitId: "gravity", record: input.message.accelerometer.x };
    //     result["acceleration:y"] = { unitId: "gravity", record: input.message.accelerometer.y };
    //     result["acceleration:z"] = { unitId: "gravity", record: input.message.accelerometer.z };
    // }
    
    
    
    if (typeof input.message.humidity !== "undefined") {
        result.humidity = { unitId: "%RH", record: input.message.humidity };
    }
    if (typeof input.message.historyTemperature !== "undefined") {
        
        result.temperature = {
            unitId: "Cel",
            records: Object.values(input.message.historyTemperature) ,
            nature:"History Temperature"
        };
    }
    if (typeof input.message.historyHumidity !== "undefined") {
        
        result.humidity = {
            unitId: "%RH",
            records: Object.values(input.message.historyHumidity) ,
            nature:"History humidity"
        };
    }
   
    if (typeof input.message.batteryVoltage !== "undefined") {
        result.batteryVoltage = { unitId: "mV", record: input.message.batteryVoltage };

        // // Calcul du niveau de la batterie comme un pourcentage de la tension maximale de 3524 mV
        // let batteryLevel = Number(((input.message.batteryVoltage / 3524) * 100).toFixed(2));
        // result.batteryLevel = {};  
        
        // if (batteryLevel > 100) {
        //     result.batteryLevel.record = 100;  // S'assurer que la valeur ne dépasse pas 100%
        // } else if (batteryLevel < 0) {
        //     result.batteryLevel.record = 0;    
        // } else {
        //     result.batteryLevel.record = batteryLevel;
        // }
        // result.batteryLevel.unitId = "%";   
    }

    return result;
}

exports.extractPoints = extractPoints;
