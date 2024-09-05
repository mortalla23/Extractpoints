function extractPoints(input){

    let points = {};

    if(input.message == null){
        return points;
    }

    if(input.message.bytes != null){
        var durationSuffix = 1;
        if(input.message.bytes.transmissionPeriodKeepAlive != null){
            if(input.message.bytes.transmissionPeriodKeepAlive.unit == "s"){
                points["duration:" + durationSuffix] = { unitId: "s", record: input.message.bytes.transmissionPeriodKeepAlive.value };
                durationSuffix++;
            }
        }
        if(input.message.bytes.samplingPeriod != null){
            if(input.message.bytes.samplingPeriod.unit == "s"){
                points["duration:" + durationSuffix] = { unitId: "s", record: input.message.bytes.samplingPeriod.value};
                durationSuffix++;
            }
        }
        if(input.message.bytes.calculatedPeriodRecording != null){
            if(input.message.bytes.calculatedPeriodRecording.unit == "s"){
                points["duration:" + durationSuffix] = { unitId: "s", record: input.message.bytes.calculatedPeriodRecording.value };
                durationSuffix++;
            }
        }
        if(input.message.bytes.calculatedSendingPeriod != null){
            if(input.message.bytes.calculatedSendingPeriod.unit == "s"){
                points["duration:" + durationSuffix] = { untiId: "s", record: input.message.bytes.calculatedSendingPeriod.value };
                durationSuffix++;
            }
        }

        if(input.message.bytes.temperatures != null){
        
            var valuesListSuffix = 1;
            if(input.message.bytes.decodingInfo != "values: [t=0, t-1, t-2, ...]"){
                for(var i = 0 ; i < input.message.bytes.temperatures.length ; i++){
                    var suffix = i;
                    var unit = (input.message.bytes.temperatures[i].unit == "°C") ? "Cel" : null;
                    if(unit != null){
                        points["temperature:" + suffix] = { unitId: "Cel", record: input.message.bytes.temperatures[i].value };
                    }
                }
            }
            else{
                for(var i = 0 ; i < input.message.bytes.temperatures.length ; i++){
                    for(var j = 0 ; j < input.message.bytes.temperatures[i].values.length ; j++){
                        var unit = (input.message.bytes.temperatures[i].unit == "°C") ? "Cel" : null;
                        if(unit != null){
                            points["temperature:" + valuesListSuffix] = { unitId: "Cel", record: input.message.bytes.temperatures[i].values[j] };
                        }
                        valuesListSuffix++;
                    }
                }
            }

        }
    }

    return points;
}

exports.extractPoints = extractPoints;