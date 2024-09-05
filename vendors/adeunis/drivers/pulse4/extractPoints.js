function extractPoints(input){
    let points = {};

    if(input.message == null){
        return points;
    }

    if(input.message.bytes != null){
        var durationSuffix = 1;
        if(input.message.bytes.calculatedSendingPeriod != null){
            if(input.message.bytes.calculatedSendingPeriod.unit == "s"){
                points["duration:" + durationSuffix] = { unitId: "s", record: input.message.bytes.calculatedSendingPeriod.value };
                durationSuffix++;
            }
        }
        if(input.message.bytes.channels != null){
            for(i in input.message.bytes.channels){
                if(i.debouncingPeriod != null){
                    points["duration:" + durationSuffix] = { unitId: "s", record: i.debouncingPeriod.value/1000 };
                    durationSuffix++;
                }
                if(i.tample != null){
                    if(i.samplePeriodForDetection != null){
                        points["duration:" + durationSuffix] = { unitId: "s", record: i.tample.samplePeriodForDetection.value };
                        durationSuffix++;
                    }
                }
            }
        }
        if(input.message.bytes.flowCalculationPeriod != null){
            points["duration:" + durationSuffix] = { unitId: "s", record: input.message.bytes.flowCalculationPeriod.value/1000 };
            durationSuffix++;
        }
        if(input.message.bytes.samplingPeriod != null){
            points["duration:" + durationSuffix] = { unitId: "s", record: input.message.bytes.samplingPeriod.value };
            durationSuffix++;
        }

        if(input.message.bytes.timestamp != null){
            var timeInSecondsSince1rstJan1970 = new Date(input.message.bytes.timestamp).getTime();
            points.time = { unitId: "s", record: timeInSecondsSince1rstJan1970 };
        }

    }

    return points;
}

exports.extractPoints = extractPoints;