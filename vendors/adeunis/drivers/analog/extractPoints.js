function extractPoints(input) {
    // console.log("input\n", input);
    if (!input || !input.message) {
        throw new Error("Invalid input: no data received");
    }
    if (input.message.error != null) {
        throw new Error("invalid uplink payload: incomplete data received");
    }

    let result = {};
    let timeIndex=0;
    let curIndex=0;
   
    // Extract transmission periods with "time" keys
    if (input.message.bytes.transmissionPeriodKeepAlive) {
        result["time:"+timeIndex++] = {
            unitId: "minute",
            record: input.message.bytes.transmissionPeriodKeepAlive.value,nature:"Transmission period keep alive"
        };
    }
    if (input.message.bytes.transmissionPeriodData) {
        result["time:"+timeIndex++] = {
            unitId: "minute",
            record: input.message.bytes.transmissionPeriodData.value,nature:"Transmission period data"
        };
    }
    if (input.message.bytes.threshold) {
        let recordValue;
        let hysteresisValue;
        if (input.message.bytes.threshold.high) {
            recordValue = input.message.bytes.threshold.high.value;
            hysteresisValue = input.message.bytes.threshold.high.hysteresis 
            result["current:"+curIndex++] = {
                unitId: "nA",
                record: recordValue*10,
                nature:"Threhold high value"
            };
            
            result["current:"+curIndex++] = {
                unitId: "nA",
                record: hysteresisValue*10,
                nature:"Hysteresis value"
            };
        } 
        else if (input.message.bytes.threshold.low) {
            recordValue = input.message.bytes.threshold.low.value;
            hysteresisValue = input.message.bytes.threshold.low.hysteresis 
        
        result["current:"+curIndex++] = {
            unitId: "nA",
            record: recordValue*10,
            nature:"Threhold low value"
        };
        
        result["current:"+curIndex++] = {
            unitId: "nA",
            record: hysteresisValue*10,
            nature:"Hysteresis value"
        };
    }
}

    const channels = input.message.bytes.channels;
if (channels && Array.isArray(channels)) {
    let durationIndex = 0;  
    channels.forEach(channel => {


        if (channel.externalTrigger && channel.externalTrigger.debounceDuration) {
            const duration = channel.externalTrigger.debounceDuration;
            let unitId;
            switch (duration.unit) {
                case "ms":
                    unitId = "ms";
                    break;
                case "s":
                    unitId = "s";
                    break;
                default:
                    break;
            }

            // Check if unitId has been defined before proceeding
            if (unitId) {
                // Add unitId and record to the output
                if (channel.name === "channel A" || channel.name === "channel B") {
                    result["duration:" + durationIndex++] = {
                        unitId: unitId,
                        record: duration.value,
                        nature: `${channel.name}`
                    };
                    // console.log(`Processing data for channel ${channel.name} with unitId ${unitId} and value ${duration.value}`);
                }
            }
        }
   
        if (channel!=0) {
            let unitId;
            switch (channel.unit) {
                case "V":
                    unitId = "V";
                    break;
                case "mA":
                    unitId = "mA";
                    break;
                default:
                    break;
            }

            // Check if unitId has been defined before proceeding
            if (unitId) {
                if (channel.name === "channel A") {
                    result["voltage"] = {
                        unitId: unitId,
                        record: channel.value,
                        nature:"Channel A"
                    };
                } else if (channel.name === "channel B") {
                    result["current"] = {
                        unitId: unitId,
                        record: channel.value,
                        nature:"Channel B"
                    };
                }
            }
        }
        });
    
    }

    

return result;
}
exports.extractPoints = extractPoints;
