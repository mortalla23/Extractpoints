function decodeUplink(input) {

    var bytes = input.bytes;

    var payloadType = bytes[0];
    
    var result = {
        data: {},
        warnings: [],
        errors: []
    };

    switch(payloadType){
        case 3:
            var frame = "Send Measurments LoRa Spy 2 x 16 bits";
            var redundancy = bytes[1] & 0x0F;
            var numberOfConfigurations = bytes[1] & 0xF0;
            var timeStamp = (((bytes[2]*16*16 + bytes[3])*16*16 + bytes[4])*16*16 + bytes[5])*16*16;
            var status = bytes[6]*16*16 + bytes[7];

            result.data = {
                frameType: frame,
                redundancy: redundancy,
                numberOfConfigurations: numberOfConfigurations,
                timestamp: timeStamp,
                loRaSPYStatus: status,
            }

            for(var i = 8 ; i < bytes.length ; i += 4){
                var suffix = (i == 8) ? "" : `_${(i-8)/4}`;
                result.data[`value1N${suffix}`] = (bytes[i]*16*16 + bytes[i+1])/100;
                result.data[`value2N${suffix}`] = (bytes[i+2]*16*16 + bytes[i+3])/100;
            }
            break;
        case 16:
            result.data.frameType = "ID presentation Frame Answer";
            result.data.firmwareHi = bytes[1];
            result.data.firmwareLo = bytes[2];
            result.data.swVersionMinorVersion = bytes[3];
            result.data.LoRa_SPY_Type = bytes[4];
            result.data.sensorType = bytes[5];
            if(result.data.LoRa_SPY_Type == 0x60 && result.data.sensorType == 0x06) {
                result.data.Modbus = true;
            }

            var setLEDValue = () => {
                switch((bytes[6] & 0b00001000) >> 3){
                    case 0:
                        return "Off";
                    case 1:
                        return "Green";
                    case 2:
                        return "Red";
                    case 3:
                        return "Blue";
                }
            };

            result.data.LoRa_SPY_Status = {
                parametersFault: (bytes[6] & 0b00000001),
                touchButtonFault: (bytes[6] & 0b00000010) >> 1,
                flashSeriesDefault: (bytes[6] & 0b00000100) >> 2,
                LEDColor: setLEDValue(),
                LEDStatusBit0: (bytes[6] & 0b00010000) >> 4,
                batteryEmpty: Boolean((bytes[6] & 0b00100000) >> 5),
                trackingMode: (bytes[6] & 0b01000000) >> 6,
                RTC_Fault: (bytes[6] & 0b10000000) >> 7,

                sensorFaultTrack1: (bytes[7] & 0b00000001),
                sensorFaultTrack2: (bytes[7] & 0b00000010) >> 1,
                noGaugingTrack1: (bytes[7] & 0b00000100) >> 2,
                noGaugingTrack2: (bytes[7] & 0b00001000) >> 3,
                thresholdAlarmTrack1: (bytes[7] & 0b00010000) >> 4,
                thresholdAlarmTrack2: (bytes[7] & 0b00100000) >> 5,
                t1_openDetectionAlarm: (bytes[7] & 0b01000000) >> 6,
            };

            result.data.batteryLevel = (bytes[8] + 300)/100;
            result.data.RSSI_sensor_value = bytes[9];
            result.data.currentSensorTimestamp = ((bytes[10]*16*16 + bytes[11])*16*16 + bytes[12])*16*16 + bytes[13];

            result.data.uplinkCondition = (bytes[14] & 0b00001111) ? "Wait for Acknoledgement flag" : "Periodic presentation frame";

            result.data.probeSerialNumberPresenceIndicator = (bytes[14] & 0b11110000) ? "Presence" : "Absence";

            var transmissionPeriodUnit = () => {
                switch((bytes[15] & 0b11000000) >> 6){
                    case 0:
                        return "sec";
                    case 1:
                        return "min";
                    case 2:
                        return "h";
                    default:
                        result.errors.push("Couldn't decode a transmission period unit.");
                        return "";
                }
            };

            result.data.transmissionPeriod = `${bytes[15] & 0b00111111}${transmissionPeriodUnit()}`;

            if(result.data.probeSerialNumberPresenceIndicator == "Presence"){
                result.data.probeSerialNumber = ((((((((((bytes[16]*16*16 + bytes[17])*16*16 + bytes[18])*16*16 + bytes[19])*16*16
                 + bytes[20])*16*16 + bytes[21])*16*16 + bytes[22])*16*16 + bytes[23])*16*16
                 + bytes[24])*16*16 + bytes[25])*16*16 + bytes[26])*16*16 + bytes[27];
            }
            
            break;
        case 17:
            result.data.frameType = "Alarm frame";
            result.data.timestamp = (((bytes[1]*16*16 + bytes[2])*16*16 + bytes[3])*16*16 + bytes[4])*16*16;
            
            var track1 = () => {
                switch(bytes[5] & 0b00001111){
                    case 0:
                        return "No alarm";
                    case 1:
                        return "High threshold";
                    case 2:
                        return "Low threshold";
                    default:
                        result.errors.push("Could not read data about track 1 alarm.");
                        return "Unreadable";
                }
            }
            var track2 = () => {
                switch(bytes[5] & 0b11110000){
                    case 0:
                        return "No alarm";
                    case 1:
                        return "High threshold";
                    case 2:
                        return "Low threshold";
                    default:
                        result.errors.push("Could not read data about track 2 alarm.");
                        return "Unreadable";
                }
            }

            result.data.track1Alarm = track1();
            result.data.track2Alarm = track2();

            var alarmDelay = (byteIndex) => {
                var value = '';
                switch((bytes[byteIndex] & 0b11000000) >> 6){
                    case 0:
                        var unit = "s";
                        break;
                    case 1:
                        var unit = "min";
                        break;
                    case 2:
                        var unit = "h";
                        break;
                    default:
                        var unit = "";
                        result.errors.push("Could not read the alarm delay unit.");
                }
                var delayValue = bytes[byteIndex] & 0b00111111;

                value = `${delayValue}${unit}`;
                return value;
            }

            result.data.track1AlarmDelay = alarmDelay(6);
            result.data.alarmValueTrack1 = bytes[7]*16*16 + bytes[8];
            result.data.thresholdCrossingValueTrack1 = bytes[9]*16*16 + bytes[10];

            result.data.track2Alarmdelay = alarmDelay(11);
            result.data.alarmValueTrack2 = bytes[12]*16*16 + bytes[13];
            result.data.thresholdCrossingValueTrack2 = bytes[14]*16*16 + bytes[15];

            break;
        case 51:
            result.data.frameType = "\"Send measurement table with start-finish timestamp\" command response for the 2 x 16 bit measurement type";
            result.data.amountOfMessagesTransmitted = bytes[1]*16*16 + bytes[2];
            result.data.firstMeasurementTimestamp = ((bytes[3]*16*16 + bytes[4])*16*16 + bytes[5])*16*16 + bytes[6];
            result.data.measurementsTimeIntervals = bytes[7];

            for(var i = 8 ; i < bytes.length ; i++){
                result.data[`Measurement_${i-7}`] = bytes[i];
            }

            break;
        case 39:
            result.data.frameType = "Answer to a Firmware release command";

            result.data.firmwareHi = bytes[1];
            result.data.firmwareLo = bytes[2];
            result.data.minorRelease = bytes[3];
            break;
        default:
            result.errors = ["Couldn't decode a payload type."];
    }

    return result;
}

function encodeDownlink(input) {
    var result = {
        fPort: 2,
        bytes: [],
        errors: [],
        warnings: []
    };

    let data = input;
    if(input.data != null){
        data = input.data;
    }

    result.bytes.push(148);
    if(data.MEASUREMENT_FREQUENCY != null){
        var unit;
        switch(data.MEASUREMENT_FREQUENCY.substring(-1)){
            case "m":
                unit = 4;
                break;
            case "h":
                unit = 8;
                break;
            case "s":
                unit = 0;
                break;
            default:
                unit = 4;
        }
        var measureFreq = (unit << 4) | parseInt(data.MEASUREMENT_FREQUENCY);
        result.bytes.push(measureFreq);
    }
    else {
        result.bytes.push(69);
    }
    
    if(data.TRANSMISSION_FREQUENCY != null){
        var unit;
        switch(data.TRANSMISSION_FREQUENCY.substring(-1)){
            case "m":
                unit = 4;
                break;
            case "h":
                unit = 8;
                break;
            case "s":
                unit = 0;
                break;
            default:
                unit = 4;
        }
        var transmitFreq = (unit << 4) | parseInt(data.TRANSMISSION_FREQUENCY);
        result.bytes.push(transmitFreq);
    }
    else{
        result.bytes.push(79);
    }

    result.bytes.push(0);
    
    if(data.REDONDANCE != null){
        result.bytes.push(data.REDONDANCE);
    }
    else{
        result.bytes.push(0);
    }
    
    result.bytes.push(0, 0, 1, 0);

    if(data.ALARM_MODE != null){
        switch(data.ALARM_MODE){
            case "NO ALARM":
                result.bytes.push(0);
                break;
            case "IMMEDIATE":
                result.bytes.push(1);
                break;
            case "MAINTAINED":
                result.bytes.push(2);
                break;
            default:
                result.bytes.push(0);
        }
    }
    else{
        result.bytes.push(0);
    }

    result.bytes.push(0, 1, 0);

    if(data.LOW_ALARM_THRESHOLD_V1 != null){
        result.bytes.push(parseInt(data.LOW_ALARM_THRESHOLD_V1)*100 & 0xF0);
        result.bytes.push(parseInt(data.LOW_ALARM_THRESHOLD_V1)*100 & 0x0F);
    }
    else{
        result.bytes.push(3, 32);;
    }
    
    if(data.HIGH_ALARM_THRESHOLD_V1 != null){
        result.bytes.push(parseInt(data.HIGH_ALARM_THRESHOLD_V1)*100 & 0xF0);
        result.bytes.push(parseInt(data.HIGH_ALARM_THRESHOLD_V1)*100 & 0x0F);
    }
    else{
        result.bytes.push(4, 128);
    }

    if(data.LOW_ALARM_THRESHOLD_V2 != null){
        result.bytes.push(parseInt(data.LOW_ALARM_THRESHOLD_V2)*100 & 0xF0);
        result.bytes.push(parseInt(data.LOW_ALARM_THRESHOLD_V2)*100 & 0x0F);
    }
    else{
        result.bytes.push(0, 0);;
    }
    
    if(data.HIGH_ALARM_THRESHOLD_V2 != null){
        result.bytes.push(parseInt(data.HIGH_ALARM_THRESHOLD_V2)*100 & 0xF0);
        result.bytes.push(parseInt(data.HIGH_ALARM_THRESHOLD_V2)*100 & 0x0F);
    }
    else{
        result.bytes.push(0, 0);
    }

    if(data.LOW_THRESHOL_DELAY != null){
        result.bytes.push(data.LOW_THRESHOL_DELAY);
    }
    else{
        result.bytes.push(0);
    }

    if(data.HIGH_THRESHOL_DELAY != null){
        result.bytes.push(data.HIGH_THRESHOL_DELAY);
    }
    else{
        result.bytes.push(10);
    }

    if(data.STOP_BY_PRESSING_BUTTON != null){
        switch(data.STOP_BY_PRESSING_BUTTON){
            case "NOT ALLOWED":
                result.bytes.push(0);
                break;
            case "ALLOWED":
                result.bytes.push(1);
                break;
            default:
                result.bytes.push(1);
        }
    }
    else{
        result.bytes.push(1);
    }

    if(data.DISPLAY_MEASURED_VALUE != null){
        switch(data.DISPLAY_MEASURED_VALUE){
            case "NOT DISPLAYED":
                result.bytes.push(0);
                break;
            case "DISPLAYED":
                result.bytes.push(1);
                break;
            default:
                result.bytes.push(1);
        }
    }
    else{
        result.bytes.push(1);
    }

    result.bytes.push(0);

    if(data.CHANNEL_T_MEASUREMENT_UNIT != null){
        switch(data.CHANNEL_T_MEASUREMENT_UNIT){
            case "NO UNIT":
                result.bytes.push(0);
                break;
            case "°C":
                result.bytes.push(1);
                break;
            case "°F":
                result.bytes.push(2);
                break;
            default:
                result.bytes.push(1);
        }
    }
    else{
        result.bytes.push(2);
    }

    result.bytes.push(0, 0, 0, 0, 0);

    return result;
}

exports.decodeUplink = decodeUplink;
exports.encodeDownlink = encodeDownlink;