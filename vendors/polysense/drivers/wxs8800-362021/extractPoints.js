function extractPoints(input) {
    let result = {};
    
    // console.log("Received input:\n",input);
    if (!input || !input.message ) {
        throw new Error("invalid uplink payload: no data received");
    }

  

    if (input.message.sound != null) {
        result["intensity"] = { unitId: "dB", record: input.message.sound };
    }
    if (input.message.vbat != null) {
        result["batteryVoltage"] = { unitId: "mV", record: input.message.vbat };
    }
   
    if (input.message.distance != null) {
        result["distance"] = { unitId: "mm", record: input.message.distance };
    }

    if (input.message.cnt!= null) {
            result["eventRate"]= { unitId: "count/s", record: input.message.cnt };
    }
    return result;

}
exports.extractPoints = extractPoints;
