function extractPoints(input) {
    let points = {};

    if(!input.message ) {
        return points;
    }
    let accIndex=0;
    if(input.message.acc && input.message.acc.x_g !==undefined){
        points["acceleration:"+accIndex++] = { unitId: "gravity", record: input.message.acc.x_g,nature:"Acceleration x_g"};
       }
    
    if(input.message.acc && input.message.acc.y_g!==undefined ){
        points["acceleration:"+accIndex++] = { unitId: "gravity", record: input.message.acc.y_g ,nature:"Acceleration y_g"};
    }
    if(input.message.acc && input.message.acc.z_g!==undefined) {
        points["acceleration:"+accIndex++] = { unitId: "gravity", record: input.message.acc.z_g,nature:"Acceleration z_g" };
    }

    if(input.message.regular_message_interval_min ) {
        points["interval"] = { unitId: "minute", record: input.message.regular_message_interval_min,nature:"Regular message interval min" };
    }
    if(input.message.electrode_is_wet ) {
        points["leak"] = { unitId: "state", records: input.message.electrode_is_wet,nature: 'Electrode wetness status'};
    }
    if(input.message.num_wet_electrodes) {
        points["counter"] = { unitId: "count", record: input.message.num_wet_electrodes,nature: 'Number wet electrodes'}; 
    }
    if(input.message.temp_c ) {
        points["temperature"] = { unitId: "Cel", record: input.message.temp_c };
    }
    if(input.message.batt ) {
        points["batteryVoltage"] = { unitId: "V", record: input.message.batt };
    }
    

    return points;
}

exports.extractPoints = extractPoints;