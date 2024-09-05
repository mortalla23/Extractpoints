function extractPoints(input) {
    // console.log("input\n", input);

    let result= {};
    if (!input || !input.message ||!input.message.bytes ) {
        throw new Error("Invalid input: no data received");
    }
    
    
    
    let timeIndex = 0;
    let durationIndex=0;
  
    
    if(input.message.bytes.counter) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        if(input.message.bytes.type.includes("input 1")){
            result["counter:0"] = { unitId: "count", records:[{ value:input.message.bytes.counter.global,eventTime:eventTime,nature:"Digital input 1"}]};
        }else {
            result["counter:1"] = { unitId: "count", records:[{ value:input.message.bytes.counter.global,eventTime:eventTime,nature:"Digital input 2"}]};
        }
    }
    if(input.message.bytes.samplingPeriod) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.samplingPeriod.value,nature:"Sampling period" };
    }
    if(input.message.bytes.transmissionPeriodKeepAlive) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.transmissionPeriodKeepAlive.value ,nature:"Period keep alive"};
    }
    if(input.message.bytes.calculatedPeriodRecording) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.calculatedPeriodRecording.value,nature:"Period recording" };
    }
    if(input.message.bytes.calculatedSendingPeriod) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.calculatedSendingPeriod.value,nature:"Sending period" };
    }
    if (input.message.bytes.digitalInput1 && input.message.bytes.digitalInput1.debouncingPeriod) {
        result["duration:" + durationIndex++] = {
            unitId: "ms",
            record: input.message.bytes.digitalInput1.debouncingPeriod.value,
            nature: "Digital input 1 "+input.message.bytes.digitalInput1.type
        };
    }
    if (input.message.bytes.digitalInput2 && input.message.bytes.digitalInput2.debouncingPeriod) {
        result["duration:" + durationIndex++] = {
            unitId: "ms",
            record: input.message.bytes.digitalInput2.debouncingPeriod.value,
            nature: "Digital input 2 "+input.message.bytes.digitalInput2.type
        };
    }
    if(input.message.bytes.temperature!==undefined) {
        result["temperature"] = { unitId: "Cel", records: input.message.bytes.temperature.values };
    }
    if(input.message.bytes.humidity!==undefined) {
        result["humidity"] = { unitId: "%RH", records: input.message.bytes.humidity.values };
    }
    if(input.message.bytes.alarmTemperature) {
        result["temperature"] = { 
            unitId: "Cel", 
            record: input.message.bytes.alarmTemperature.temperature.value ,
            nature: "Alarm temperature"
    };
}
    if(input.message.bytes.alarmHumidity) {
        result["humidity"] = { 
            unitId: "%RH", 
        record: input.message.bytes.alarmHumidity.humidity.value,
        nature: "Alarm humidity"

    };
    }
    

    return result;
}
exports.extractPoints = extractPoints;
