function extractPoints(input) {
    // console.log("input\n", input);

    let result= {};
    if (!input || !input.message ||!input.message.bytes ) {
        throw new Error("Invalid input: no data received");
    }
    
    
    
    let timeIndex = 0;
    let durationIndex=0;
    let temperatureIndex=0;
    let co2Index=0;
    let humidityIndex=0;
    if(input.message.bytes.counter) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        if(input.message.bytes.type.includes("input 1")){
            result["counter:0"] = { unitId: "count", records:[{ value:input.message.bytes.counter.global,eventTime:eventTime,nature:"Digital input 1"}]};
        }else {
            result["counter:1"] = { unitId: "count", records:[{ value:input.message.bytes.counter.global,eventTime:eventTime,nature:"Digital input 2"}]};
        }
    }
    if(input.message.bytes.alarmTemperature) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        result["temperature"] = { 
            unitId: "Cel", 
            records:[{value:input.message.bytes.alarmTemperature.temperature.value,eventTime:eventTime ,
            nature: "Alarm temperature"}]
    };
    }
    if(input.message.bytes.alarmHumidity) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        result["humidity"] = { 
            unitId: "%RH", 
        records: [{value:input.message.bytes.alarmHumidity.humidity.value,eventTime:eventTime,
        nature: "Alarm humidity"}]

    };
    }
    if(input.message.bytes.alarmCo2) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        result["co2Level"] = { 
            unitId: "ppm", 
        records: [{value:input.message.bytes.alarmCo2.co2.value,eventTime:eventTime,
        nature:"Alarm CO2"}]

    };
    }
    

    if(input.message.bytes.temperature) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        result["temperature" ] = { unitId: "Cel", records: [{value:input.message.bytes.temperature.values,eventTime:eventTime} ]};
    }
    if(input.message.bytes.co2) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        result["co2Level" ] = { unitId: "ppm", records: [{value:input.message.bytes.co2.values,eventTime:eventTime }]};
    }
    if(input.message.bytes.humidity) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        result["humidity" ] = { unitId: "%RH", records: [{value:input.message.bytes.humidity.values ,eventTime:eventTime}]};
    }

    if(input.message.bytes.qaiRedDuration) {
        result["time" ] = { unitId: "minute", record: input.message.bytes.qaiRedDuration.value,nature:"qaiRed duration" };
    }
    if(input.message.bytes.temperatureMax) {
        result["temperature:" + temperatureIndex++] = { unitId: "Cel", record: input.message.bytes.temperatureMax.value,nature:"Temperature max" };
    }
    if(input.message.bytes.co2Max) {
        result["co2Level:" + co2Index++] = { unitId: "ppm", record: input.message.bytes.co2Max.value,nature:"Co2 max" };
    }
    if(input.message.bytes.humidityMax) {
        result["humidity:" + humidityIndex++] = { unitId: "%RH", record: input.message.bytes.humidityMax.value,nature:"Humidity max" };
    }
    if(input.message.bytes.temperatureMin) {
        result["temperature:" + temperatureIndex] = { unitId: "Cel", record: input.message.bytes.temperatureMin.value,nature:"Temperature min"};
    }
    if(input.message.bytes.co2Min) {
        result["co2Level:" + co2Index++] = { unitId: "ppm", record: input.message.bytes.co2Min.value,nature:"Co2 min" };
    }
    if(input.message.bytes.humidityMin) {
        result["humidity:" + humidityIndex++] = { unitId: "%RH", record: input.message.bytes.humidityMin.value ,nature:"Humidity min"};
    }
    if(input.message.bytes.temperatureAverage) {
        result["temperature:" + temperatureIndex] = { unitId: "Cel", record: input.message.bytes.temperatureAverage.value,nature:"Temperature average" };
    }
    if(input.message.bytes.co2Average) {
        result["co2Level:" + co2Index++] = { unitId: "ppm", record: input.message.bytes.co2Average.value,nature:"Co2 average" };
    }
    if(input.message.bytes.humidityAverage) {
        result["humidity:" + humidityIndex++] = { unitId: "%RH", record: input.message.bytes.humidityAverage.value,nature:"Humidity average" };
    }

    if(input.message.bytes.samplingPeriod) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.samplingPeriod.value,nature:"Sampling period" };
    }
    if(input.message.bytes.calculatedPeriodRecording) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.calculatedPeriodRecording.value,nature:"Period recording"};
    }
    if(input.message.bytes.calculatedSendingPeriod) {
        result["time:" + timeIndex++] = { unitId: "s", record: input.message.bytes.calculatedSendingPeriod.value,nature:"Sending period" };
    }
    if(input.message.bytes.blackOutDuration) {
        result["time:" + timeIndex++] = { unitId: "h", record: input.message.bytes.blackOutDuration.value,nature:"BlackOut duration" };
    }
    if(input.message.bytes.blackOutStartTime) {
        result["time:" + timeIndex++] = { unitId: "h", record: input.message.bytes.blackOutStartTime.value,nature:"BlackOut start time" };
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
    return result;
}
exports.extractPoints = extractPoints;
