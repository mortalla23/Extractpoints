function extractPoints(input) {
    let result = {};
    
    if (input.message == null   ) {
        throw new Error("invalid uplink payload: no data received");
    }

   
    let volumeIndex=0;
  
    if (input.message.absoluteMeterCounter) {
        result["volume:"+volumeIndex++] = { unitId: "l", record: input.message.absoluteMeterCounter.value ,nature:"Absolute meter counter"};
    }
    if (input.message.reverseFlow) {
        result["volume:"+volumeIndex++] = { unitId: "l", record: input.message.reverseFlow.value ,nature:"Reverse flow"};
    }
    if (input.message.temperature) {
        result.temperature = { unitId: "Cel", record: input.message.temperature.value };
    }

    if (input.message.absoluteCurrentValue && input.message.currentDateAndTime) {
        let eventTime = new Date(input.message.currentDateAndTime).toISOString();
        result["volume:" + volumeIndex++] = {
            unitId: "l",
            records:{value: input.message.absoluteCurrentValue.value,
                eventTime: eventTime  ,
            nature: "Absolute currentValue",
        }
        };
    }
    
    if (input.message.absoluteLastRegisteredLogValue) {
        let eventTime = input.message.dateAndTimeLastRegisteredLog ? new Date(input.message.dateAndTimeLastRegisteredLog).toISOString() : "";
        result["volume:" + volumeIndex++] = {
            unitId: "l",
            records:{value:input.message.absoluteLastRegisteredLogValue.value,
                eventTime: eventTime,
            nature: "Absolute last registered log",
            eventTime: eventTime  } 
        };
    }
    
    
    if ( input.message.alarms && input.message.alarms.VIFTransmission !== undefined) {
        result.volume = { unitId: "l", record: input.message.alarms.VIFTransmission.value };
    }
    if (input.message.data && input.message.data.alarms && input.message.data.alarms.lowBatteryThreshold) {
        result.voltage = { unitId: "mV", record:input.message.data.alarms.lowBatteryThreshold.value,nature:"Low battery threshold" };
    }
    

    if (input.message.volumes) {
        input.message.volumes.forEach(volume => {
            result["volume:" + volumeIndex++] = {
                unitId: "l",
                record: volume.value,
                nature: volume.label
            };
        });
    }
    return result;
}

exports.extractPoints = extractPoints;


