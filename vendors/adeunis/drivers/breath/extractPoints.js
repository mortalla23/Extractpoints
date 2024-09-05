function extractPoints(input){

    let points = {};

    if(input.message == null){
        return points;
    }

    if(input.message.bytes == null) {
        return points;
    }

    
    let durationIndex = 0;
    let concentrationIndex = 0;
 
    if(input.message.bytes.counter) {
        let eventTime = new Date(input.message.bytes.timestamp).toISOString();
        if(input.message.bytes.type.includes("input 1")){
            points["counter:0"] = { unitId: "count", records:[{ value:input.message.bytes.counter.global,eventTime:eventTime,nature:"Digital input 1"}]};
        }else {
            points["counter:1"] = { unitId: "count", records:[{ value:input.message.bytes.counter.global,eventTime:eventTime,nature:"Digital input 2"}]};
        }
    }
    if(input.message.bytes.historyPeriod) {
        points["duration:" + durationIndex++] = { unitId: "s", record: input.message.bytes.historyPeriod.value ,nature:"History period"};
    }
    if(input.message.bytes.alarmRepeatPeriod) {
        points["duration:" + durationIndex++] = { unitId: "s", record: input.message.bytes.alarmRepeatPeriod.value ,nature:"Alarm repeat period"};
    }
    if(input.message.bytes.digitalInput1 && input.message.bytes.digitalInput1.debouncingPeriod) {
        points["duration:" + durationIndex++] = { unitId: "ms", record: input.message.bytes.digitalInput1.debouncingPeriod.value ,nature:"Digital input 1"};
    }
    if(input.message.bytes.digitalInput2 && input.message.bytes.digitalInput2.debouncingPeriod) {
        points["duration:" + durationIndex++] = { unitId: "ms", record: input.message.bytes.digitalInput2.debouncingPeriod.value ,nature:"Digital input 2"};
    }

    if(input.message.bytes.tvoc && input.message.bytes.tvoc.min) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.tvoc.min.value ,nature:"Tvoc min"};
    }
    if(input.message.bytes.tvoc && input.message.bytes.tvoc.max) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.tvoc.max.value,nature:"Tvoc max" };
    }
    if(input.message.bytes.tvoc && input.message.bytes.tvoc.average) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.tvoc.average.value,nature:"Tvoc average" };
    }
    if(input.message.bytes.tvoc && input.message.bytes.tvoc.duration) {
        points["duration:" + durationIndex++] = { unitId: "minute", record: input.message.bytes.tvoc.duration.value };
    }
    if(input.message.bytes.tvoc && input.message.bytes.tvoc.alarmStatus) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.tvoc.value ,nature:"Tvoc"};
    }
    else if(input.message.bytes.tvoc && input.message.bytes.tvoc.value) {
        for(let valueIndex in input.message.bytes.tvoc.value) {
            points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.tvoc.value[valueIndex],nature:"Tvoc" };
        }
    }

    if(input.message.bytes.pm10 && input.message.bytes.pm10.min) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm10.min.value ,nature:"Pm10 min"};
    }
    if(input.message.bytes.pm10 && input.message.bytes.pm10.max) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm10.max.value ,nature:"Pm10 max"};
    }
    if(input.message.bytes.pm10 && input.message.bytes.pm10.average) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm10.average.value ,nature:"Pm10 average"};
    }
    if(input.message.bytes.tvoc && input.message.bytes.tvoc.values) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.tvoc.values ,nature:"Tvoc"};
    }
    if(input.message.bytes.pm10 && input.message.bytes.pm10.duration) {
        points["duration:" + durationIndex++] = { unitId: "minute", record: input.message.bytes.pm10.duration.value };
    }
    if(input.message.bytes.pm10 && input.message.bytes.pm10.alarmStatus) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm10.value,nature:"Pm10" };
    }
    if(input.message.bytes.pm10 && input.message.bytes.pm10.values) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm10.values,nature:"Pm10" };
    }
    else if(input.message.bytes.pm10 && input.message.bytes.pm10.value) {
        for(let valueIndex in input.message.bytes.pm10.value) {
            points["concentration:"+concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm10.value[valueIndex] ,nature:"Pm10"};
        }
    }

    if(input.message.bytes.pm25 && input.message.bytes.pm25.min) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm25.min.value ,nature:"Pm25 min"};
    }
    if(input.message.bytes.pm25 && input.message.bytes.pm25.max) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm25.max.value,nature:"Pm25 max" };
    }
    if(input.message.bytes.pm25 && input.message.bytes.pm25.average) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm25.average.value,nature:"Pm25 average" };
    }
    if(input.message.bytes.pm25 && input.message.bytes.pm25.duration) {
        points["duration:" + durationIndex++] = { unitId: "minute", record: input.message.bytes.pm25.duration.value };
    }
    if(input.message.bytes.pm25 && input.message.bytes.pm25.alarmStatus) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm25.value ,nature:"Pm25"};
    }
    if(input.message.bytes.pm25 && input.message.bytes.pm25.values) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm25.values,nature:"Pm25" };
    }
    else if(input.message.bytes.pm25 && input.message.bytes.pm25.value) {
        for(let valueIndex in input.message.bytes.pm25.value) {
            points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm25.value[valueIndex],nature:"Pm25" };
        }
    }

    if(input.message.bytes.pm1 && input.message.bytes.pm1.min) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm1.min.value,nature:"Pm1 min" };
    }
    if(input.message.bytes.pm1 && input.message.bytes.pm1.max) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm1.max.value,nature:"Pm1 max" };
    }
    if(input.message.bytes.pm1 && input.message.bytes.pm1.average) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm1.average.value,nature:"Pm1 average" };
    }
    if(input.message.bytes.pm1 && input.message.bytes.pm1.duration) {
        points["duration:" + durationIndex++] = { unitId: "minute", record: input.message.bytes.pm1.duration.value };
    }
    if(input.message.bytes.pm1 && input.message.bytes.pm1.alarmStatus) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm1.value,nature:"Pm1" };
    }
    if(input.message.bytes.pm1 && input.message.bytes.pm1.values) {
        points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm1.values ,nature:"Pm1"};
    }
    else if(input.message.bytes.pm1 && input.message.bytes.pm1.value) {
        for(let valueIndex in input.message.bytes.pm1.value) {
            points["concentration:" + concentrationIndex++] = { unitId: "ug/m3", record: input.message.bytes.pm1.value[valueIndex],nature:"Pm1" };
        }
    }
    
    

    return points;
}

exports.extractPoints = extractPoints;