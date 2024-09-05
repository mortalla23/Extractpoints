function decodeUplink(input) {
    let result = {
        data: {},
        errors: [],
        warnings: []
    };
    
    const bytes = input.bytes;

    let j = 0;
    if(bytes[0] !== 0x45) {
        result.data.header = {};
        switch(bytes[j++]) {
            case 0x07:
                result.data.header.payloadType = "GET_FW_VERSION";
                break;
            case 0x0A:
                result.data.header.payloadType = "RESET";
                break;
            case 0x13:
                result.data.header.payloadType = "GET_METER_SN";
                break;
            case 0x24:
                result.data.header.payloadType = "SET_TX_PAR";
                break;
            case 0x26:
                result.data.header.payloadType = "SET_ALARM_PAR";
                break;
            case 0x27:
                result.data.header.payloadType = "GET_ALARM_PAR";
                break;
            case 0x28:
                result.data.header.payloadType = "GET_ALARM_DATA";
                break;
            case 0x29:
                result.data.header.payloadType = "SET_ALARM_DATA";
                break;
            case 0x33:
                result.data.header.payloadType = "SET_LORA_DATALOG";
                break;
            default:
                result.errors.push("Unknown payload type");
        }
        
        if(bytes[j++] !== 0x01) {
            result.errors.push("Payload is not a downlink command's answer");
            return result;
        }
        else {
            result.data.header.downlinkAnswer = true;
        }

        switch(bytes[j++]) {
            case 0:
                break;
            case 1:
                if(bytes[0] === 0x24 || bytes[0] === 0x26 || bytes[0] === 0x29) {
                    result.warnings.push("Error data field not valid");
                }
                break;
            case 2:
                result.errors.push("Error on the device type");
                return result;
            case 4:
                result.errors.push("Error on the command length");
                return result;
            default:
                result.warnings.push("Unknown error code");
        }

        result.data.header.chain = bytes[j++];

        result.data.header.dataLength = bytes[j++];
    }
    switch(bytes[0]) {
        case 0x45:    // Standard Uplink
            if(bytes.length === 11) {
                let i = 1;
                
                let absMeterCounter = 0;
                absMeterCounter += bytes[i++];
                absMeterCounter += bytes[i++] << 8;
                absMeterCounter += bytes[i++] << 16;
                result.data.absoluteMeterCounter = {
                    value: absMeterCounter,
                    unit: "L"
                };

                let ratio = bytes[i++];
                result.data.absoluteMeterCounterReverseFlowRatio = ratio;
                
                let reverseFlow = 0;
                reverseFlow += bytes[i++];
                reverseFlow += bytes[i++] << 8;
                reverseFlow += bytes[i++] << 16;
                result.data.reverseFlow = {
                    value: reverseFlow,
                    unit: "L"
                };

                let alarms = [];
                if(bytes[i] & 0x01) alarms.push("Water Leakage");
                if((bytes[i] >> 1) & 0x01) alarms.push("Wrong Installation");
                if((bytes[i] >> 2) & 0x01) alarms.push("Overflow");
                if((bytes[i] >> 3) & 0x01) alarms.push("Burst");
                if((bytes[i] >> 4) & 0x01) alarms.push("Reverse Flow");
                if((bytes[i] >> 5) & 0x01) alarms.push("Low Battery");
                result.data.alarms = alarms;

                let diameter = "DN15";
                if((bytes[i] >> 6) && 1) diameter = "DN20";
                result.data.diameter = diameter;

                let medium = "Water";
                if((bytes[i++] >> 7) && 1) medium = "Not Water";
                result.data.medium = medium;

                let temperature = 0;
                temperature += bytes[i++] << 8;
                temperature += bytes[i++];
                temperature /= 10;
                result.data.temperature = {
                    value: temperature,
                    unit: "°C"
                };
            }
            else if(bytes.length === 48 || bytes.length === 46) {
                let i = 1;

                let absCurrentValue = 0;
                absCurrentValue += bytes[i++];
                absCurrentValue += bytes[i++] << 8;
                absCurrentValue += bytes[i++] << 16;
                absCurrentValue += bytes[i++] << 24;
                result.data.absoluteCurrentValue = {
                    value: absCurrentValue,
                    unit: "L"
                };

                let currentYear = bytes[i] >> 1;
                let currentMonth = (bytes[i] & 0b1) << 3; i++;
                currentMonth += bytes[i] >> 5;
                let currentDay = (bytes[i] & 0b11111); i++;
                let currentHour = (bytes[i] & 0b11111000) >> 3;
                let currentMinute = (bytes[i] & 0b111) << 3; i++;
                currentMinute += (bytes[i] & 0b11100000) >> 5;
                let currentSecond = bytes[i] & 0b11111; i++;
                result.data.currentDateAndTime = new Date(2000+currentYear, currentMonth-1, currentDay, currentHour, currentMinute, currentSecond).toISOString();

                let absLastRegisteredLogValue = 0;
                absLastRegisteredLogValue += bytes[i++];
                absLastRegisteredLogValue += bytes[i++] << 8;
                absLastRegisteredLogValue += bytes[i++] << 16;
                absLastRegisteredLogValue += bytes[i++] << 24;
                result.data.absoluteLastRegisteredLogValue = {
                    value: absLastRegisteredLogValue,
                    unit: "L"
                };

                let lastRegisteredLogYear = bytes[i] >> 1;
                let lastRegisteredLogMonth = (bytes[i] & 0b1) << 3; i++;
                lastRegisteredLogMonth += bytes[i] >> 5;
                let lastRegisteredLogDay = (bytes[i] & 0b11111); i++;
                let lastRegisteredLogHour = (bytes[i] & 0b11111000) >> 3;
                let lastRegisteredLogMinute = (bytes[i] & 0b111) << 3; i++;
                lastRegisteredLogMinute += (bytes[i] & 0b11100000) >> 5;
                let lastRegisteredLogSecond = bytes[i] & 0b11111; i++;
                result.data.dateAndTimeLastRegisteredLog = new Date(2000+lastRegisteredLogYear, lastRegisteredLogMonth-1, lastRegisteredLogDay, lastRegisteredLogHour, lastRegisteredLogMinute, lastRegisteredLogSecond).toISOString();

                let volumes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for(let volIndex in volumes) {
                    volumes[volIndex] += bytes[i++];
                    volumes[volIndex] += bytes[i++] << 8;
                    if(volumes[volIndex] > 0x7FFF) {
                        volumes[volIndex] = ~volumes[volIndex];
                        volumes[volIndex]++;
                    }
                }

                result.data.volumes = volumes.map(vol => {
                    return {
                        label: `Delta Volume ${volumes.indexOf(vol)+1}`,
                        value: vol,
                        unit: "L"
                    };
                });

                let alarms = [];
                if(bytes[i] & 0x01) alarms.push("Water Leakage");
                if((bytes[i] >> 1) & 0x01) alarms.push("Wrong Installation");
                if((bytes[i] >> 2) & 0x01) alarms.push("Overflow");
                if((bytes[i] >> 3) & 0x01) alarms.push("Burst");
                if((bytes[i] >> 4) & 0x01) alarms.push("Reverse Flow");
                if((bytes[i] >> 5) & 0x01) alarms.push("Low Battery");
                result.data.alarms = alarms;
                i++;

                if(bytes.length === 46) {
                    let temperature = 0;
                    temperature += bytes[i++] << 8;
                    temperature += bytes[i++];
                    result.data.temperature = temperature/10;
                }
            }
            else {
                result.errors.push("Incorrect payload length");
                return result;
            }

            result.data.applicationCode = 45;

            break;
        case 0x07:     // GET_FW_VERSION answer
            if(bytes.length !== 10) {
                result.errors.push("Incorrect payload length for GET_FW_VERSION answer");
                return result;
            }

            result.data.data = {};
            result.data.data.deviceType = bytes[j++];
            j += 2;
            result.data.data.FWMisura = bytes[j++];
            result.data.data.FWRadio = bytes[j++];

            break;
        case 0x0A:    // RESET answer
            if(bytes.length !== 6) {
                result.errors.push("Incorrect payload length for RESET answer");
                return result;
            }

            result.data.data = {};
            result.data.data.deviceType = bytes[j++];

            break;
        case 0x13:    // GET_METER_SN answer
            if(bytes.length !== 10) {
                result.errors.push("Incorrect payload length for GET_METER_SN answer");
                return result;
            }

            result.data.data = {};

            result.data.data.deviceType = bytes[j++];

            let serialNumber = 0;
            serialNumber += bytes[j++] << 24;
            serialNumber += bytes[j++] << 16;
            serialNumber += bytes[j++] << 8;
            serialNumber += bytes[j++];
            result.data.data.serialNumber = serialNumber;

            break;
        case 0x24:    // SET_TX_PAR answer
            if(bytes.length !== 6) {
                result.errors.push("Incorrect payload length for SET_TX_PAR answer");
                return result;
            }

            if(bytes[2] === 0x01) {
                result.warnings.push("Incorrect error code for SET_TX_PAR answer");
            }

            result.data.data = {};
            result.data.data.deviceType = bytes[j++];

            break;
        case 0x26:    // SET_ALARM_PAR answer
            if(bytes.length !== 6) {
                result.errors.push("Incorrect payload length for SET_ALARM_PAR answer");
                return result;
            }

            result.data.data = {};
            result.data.data.deviceType = bytes[j++];

            break;
        case 0x27:    // GET_ALARM_PAR answer
            if(bytes.length !== 14) {
                result.errors.push("Incorrect payload length for GET_ALARM_PAR answer");
                return result;
            }

            result.data.data = {};

            result.data.data.deviceType = bytes[j++];

            result.data.data.alarms = {};
            result.data.data.alarms.reverseFlowThreshold = {
                value: 20,
                unit: "L"
            };
            result.data.data.alarms.waterLeakTimeThreshold = {
                value: 6,
                unit: "h"
            };
            result.data.data.alarms.VIFTransmission = {
                value: 0,
                unit: "L"
            };
            j += 3;
            if(bytes[j] === 0x01) result.data.data.alarms.temperatureDataEnabled = true;
            else if(bytes[j] === 0x00) result.data.data.alarms.temperatureDataEnabled = false;
            else {
                result.errors.push("Unknown temperatureDataEnabled value for GET_ALARM_PAR answer");
            }
            j++;

            let lowBatteryThreshold = 0;
            lowBatteryThreshold += bytes[j++] << 24;
            lowBatteryThreshold += bytes[j++] << 16;
            lowBatteryThreshold += bytes[j++] << 8;
            lowBatteryThreshold += bytes[j++];
            result.data.data.alarms.lowBatteryThreshold = {
                value: lowBatteryThreshold,
                unit: "mV"
            };
            

            break;
        case 0x28:    // GET_ALARM_DATA answer
            if(bytes.length !== 24) {
                result.errors.push("Incorrect payload length for GET_ALARM_DATA answer");
                return result;
            }

            result.data.data = {};

            result.data.data.deviceType = bytes[j++];

            let alarmFlags1 = {};
            alarmFlags1.waterLeakage = (bytes[j] & 0b1) === 0b1;
            alarmFlags1.wrongInstallation = (bytes[j] & 0b10) === 0b10;
            alarmFlags1.overflow = (bytes[j] & 0b100) === 0b100;
            alarmFlags1.burst = (bytes[j] & 0b1000) === 0b1000;
            alarmFlags1.reverseFlow = (bytes[j] & 0b10000) === 0b10000;
            alarmFlags1.lowBattery = (bytes[j] & 0b100000) === 0b100000;
            result.data.data.alarmFlags1 = alarmFlags1;
            j++

            let alarmFlags2 = {};
            alarmFlags2.eepromError = (bytes[j] & 0b1000000) === 0b1000000;
            alarmFlags2.coilError = (bytes[j] & 0b10000000) === 0b10000000;
            result.data.data.alarmFlags2 = alarmFlags2;
            j++;
            
            let qMaxAlarmDate = [bytes[j].toString(16) + bytes[j+1].toString(16), parseInt(bytes[j+2].toString(16)) - 1, bytes[j+3].toString(16)];
            j += 4;
            let wrongInstallationAlarmDate = [bytes[j].toString(16) + bytes[j+1].toString(16), parseInt(bytes[j+2].toString(16)) - 1, bytes[j+3].toString(16)];
            j += 4;
            let burstAlarmDate = [bytes[j].toString(16) + bytes[j+1].toString(16), parseInt(bytes[j+2].toString(16)) - 1, bytes[j+3].toString(16)];
            j += 4;
            let reverseFlowAlarmDate = [bytes[j].toString(16) + bytes[j+1].toString(16), parseInt(bytes[j+2].toString(16)) - 1, bytes[j+3].toString(16)];
            j += 4;

            qMaxAlarmDate.forEach(d => {
                if(d === undefined || d === null) {
                    result.warnings.push("Invalid date for QMAX Alarm Date");
                    d = 0;
                }
            });

            wrongInstallationAlarmDate.forEach(d => {
                if(d === undefined || d === null) {
                    result.warnings.push("Invalid date for Wrong Installation Alarm Date");
                    d = 0;
                }
            });

            burstAlarmDate.forEach(d => {
                if(d === undefined || d === null) {
                    result.warnings.push("Invalid date for Burst Alarm Date");
                    d = 0;
                }
            });

            reverseFlowAlarmDate.forEach(d => {
                if(d === undefined || d === null) {
                    result.warnings.push("Invalid date for Reverse Flow Alarm Date");
                    d = 0;
                }
            });
            

            result.data.data.qMaxAlarmDate = new Date(qMaxAlarmDate[0], qMaxAlarmDate[1], qMaxAlarmDate[2]);
            result.data.data.wrongInstallationAlarmDate = new Date(wrongInstallationAlarmDate[0], wrongInstallationAlarmDate[1], wrongInstallationAlarmDate[2]);
            result.data.data.burstAlarmDate = new Date(burstAlarmDate[0], burstAlarmDate[1], burstAlarmDate[2]);
            result.data.data.reverseFlowAlarmDate = new Date(reverseFlowAlarmDate[0], reverseFlowAlarmDate[1], reverseFlowAlarmDate[2]);

            break;
        case 0x29:    // SET_ALARM_DATA answer
            if(bytes.length !== 5) {
                result.errors.push("Incorrect payload length for SET_ALARM_DATA answer");
                return result;
            }

            break;
        case 0x33:    // SET_LORA_DATALOG answer
            if(bytes.length !== 6) {
                result.errors.push("Incorrect payload length for SET_LORA_DATALOG answer");
                return result;
            }

            result.data.data = {};
            result.data.data.deviceType = bytes[j++];

            break;
        default:
            result.errors.push("Invalid Frame Type");
    }

    return result;
}

function encodeDownlink(input) {
    let result = {
        errors: [],
        warnings: []
    };

    let bytes = [];
    if(input.data.command === "GET_FW_VERSION") {
        bytes = [7, 0, 0, 0, 1, 5];
    }
    else if(input.data.command === "GET_METER_SN") {
        bytes = [19, 0, 0, 0, 1, 5];
    }
    else if(input.data.command === "RESET") {
        bytes = [10, 0, 0, 0, 1, 5];
    }
    else if(input.data.command === "SET_TX_PAR") {
        if(input.data.transmissionIntervals === undefined) {
            result.errors.push("Missing transmissionIntervals property for command SET_TX_PAR");
            return result;
        }

        let interval;
        if(input.data.transmissionIntervals === "6h") interval = [84, 96];
        else if(input.data.transmissionIntervals === "12h") interval = [168, 192];
        else {
            result.errors.push("Incorrect Transmission Interval Value (it should be either 6h or 12h)");
            return result;
        }
        bytes = [36, 0, 0, 0, 3, 5, interval[0], interval[1]];
    }
    else if(input.data.command === "SET_ALARM_PAR") {
        if(input.data.alarms.temperatureEnabled === undefined) {
            result.errors.push("Missing temperatureEnabled property for command SET_ALARM_PAR");
        }
        if(input.data.alarms.lowBatteryThresholdVoltage_mV === undefined) {
            result.errors.push("Missing lowBatteryThresholdVoltage_mV property for command SET_ALARM_PAR");
        }
        if(result.errors.length > 0) {
            return result;
        }

        let alarmPar = [input.data.alarms.temperatureEnabled ? 1 : 0, 0, 0, 0, 0, 0];
        alarmPar[1] = (input.data.alarms.lowBatteryThresholdVoltage_mV & 0xFF000000) >> 24;
        alarmPar[2] = (input.data.alarms.lowBatteryThresholdVoltage_mV & 0xFF0000) >> 16;
        alarmPar[3] = (input.data.alarms.lowBatteryThresholdVoltage_mV & 0xFF00) >> 8;
        alarmPar[4] = input.data.alarms.lowBatteryThresholdVoltage_mV & 0xFF;

        bytes = [38, 0, 0, 0, 9, 5, 0, 0, 0, alarmPar[0], alarmPar[1], alarmPar[2], alarmPar[3], alarmPar[4]];
    }
    else if(input.data.command === "GET_ALARM_PAR") {
        bytes = [39, 0, 0, 0, 1, 5];
    }
    else if(input.data.command === "GET_ALARM_DATA") {
        bytes = [40, 0, 0, 0, 1, 5];
    }
    else if(input.data.command === "SET_ALARM_DATA") {
        if(input.data.alarmFlags1 === undefined && input.data.alarmFlags2 === undefined) {
            result.errors.push("Missing alarmFlags1 or alarmFlags2 property for command SET_ALARM_DATA");
            return result;
        }

        let alarmData1 = 0;
        let alarmData2 = 0;
        alarmData1 += input.data.alarmFlags1.waterLeakage ? 0b1 : 0;
        alarmData1 += input.data.alarmFlags1.wrongInstallation ? 0b10 : 0;
        alarmData1 += input.data.alarmFlags1.overflow ? 0b100 : 0;
        alarmData1 += input.data.alarmFlags1.burst ? 0b1000 : 0;
        alarmData1 += input.data.alarmFlags1.reverseFlow ? 0b10000 : 0;
        alarmData1 += input.data.alarmFlags1.lowBattery ? 0b100000 : 0;
        alarmData2 += input.data.alarmFlags2.eepromError ? 0b1000000 : 0;
        alarmData2 += input.data.alarmFlags2.coilError ? 0b10000000 : 0;
        
        bytes = [41, 0, 0, 0, 3, 5, alarmData1, alarmData2];
    }
    else if(input.data.command === "SET_LORA_DATALOG") {
        if(input.data.dataloggerEnabled === undefined) {
            result.errors.push("Missing dataloggerEnabled property for command SET_LORA_DATALOG");
            return result;
        }

        bytes = [51, 0, 0, 0, 2, 5, input.data.dataloggerEnabled ? 1 : 0];
    }
    
    result.bytes = bytes;
    result.fPort = 1;

    return result;
}

exports.decodeUplink = decodeUplink;
exports.encodeDownlink = encodeDownlink;