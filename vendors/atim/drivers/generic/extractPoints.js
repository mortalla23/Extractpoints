function extractPoints(input){
    let result = {};

    if(input.message == null){
        return result;
    }
    
    if (input.message["temperature0"]) {
        let temperatureReadings = [];
            for (var i = 0; i < input.message["temperature0"].value.length; i++) {
            temperatureReadings.push(input.message["temperature0"].value[i]);
        }
        result["temperature"] = {
            unitId: "Cel", 
            records: temperatureReadings
        };
    }
    
    if(input.message["temperature1"]){
        for(var i = 0  ; i < input.message["temperature1"].value.length ; i++){
            result["temperature:" + i] = { unitId: "Cel", record: input.message["temperature1"].value[i] };
        }
    }

    if(input.message["humidity0"]){
        for(var j = 0 ; j < input.message["humidity0"].value.length ; j++){
            result["humidity:" + j] = { unitId: "%RH", record: input.message["humidity0"].value[j] };
        }
    }
    if(input.message["humidity1"]){
        for(j ; j < input.message["humidity0"].value.length + input.message["humidity1"].value.length ; j++){
            result["humidity:" + j] = { unitId: "%RH", record: input.message["humidity1"].value[j] - input.message["humidity0"].value.length };
        }
    }

    if(input.message["COV"]){
        result.concentration = { unitId: "ppm", record: input.message["COV"].value[0] ,nature:"COV"};
    }
    if(input.message["CO2"]){
        result.co2Level = { unitId: "ppm", record: input.message["CO2"].value[0],nature:"CO2" };
    }
    if(input.message["periode"]){
        result.time = { unitId: "s", record: input.message["periode"].value };
    }
let battIndex=0;
    if(input.message["tensionc"]) {
        result["batteryVoltage:"+battIndex++] = { unitId: input.message["tensionc"].unit, record: input.message["tensionc"].value };
    }
    if(input.message["tensionv"]) {
        result["batteryVoltage:"+battIndex++] = { unitId: input.message["tensionv"].unit, record: input.message["tensionv"].value };
    }
    if(input.message["tenspression_differentielle"]) {
        result["pressure"] = { unitId: input.message["pression_differentielle"].unit, record: input.message["pression_differentielle"].value };
    }
    if(input.message["distance"]) {
        result["distance"] = { unitId: input.message["distance"].unit, record: input.message["distance"].value };
    }
let countIndex=0;
    if(input.message.compte0){
        result["counter:"+countIndex++]= { unitId: "count", record: input.message.compte0.value };
    }if(input.message.compte1){
        result["counter:"+countIndex++]= { unitId: "count", record: input.message.compte1.value };
    }if(input.message.compte2){
        result["counter:"+countIndex++]= { unitId: "count", record: input.message.compte2.value };
    }if(input.message.compte3){
        result["counter:"+countIndex++]= { unitId: "count", record: input.message.compte3.value };
    }

   

    return result;
}

exports.extractPoints = extractPoints;