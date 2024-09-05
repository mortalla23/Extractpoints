/* Actility IoT Flow Driver for Multisense
Version 1.0 according to Payload Specification V9

___  ___      _ _   _                         
|  \/  |     | | | (_)                        
| .  . |_   _| | |_ _ ___  ___ _ __  ___  ___ 
| |\/| | | | | | __| / __|/ _ \ '_ \/ __|/ _ \
| |  | | |_| | | |_| \__ \  __/ | | \__ \  __/
\_|  |_/\__,_|_|\__|_|___/\___|_| |_|___/\___|
                                              
  Swisscom Multisense payload decoder for APP Data only (fPort 3)
  provided as is with absolutely no warranties :)
  www.swisscom.ch/iot                                       
*/

// payload id's
var TYPE_TEMP         = 0x01; //Temperature - 2 Byte: INT16 MSB First, 0.01°C steps. 0x7FFF if ERROR.
var TYPE_HUM          = 0x02; //Humidity - 1 Byte: UINT8 (0 to 200), 0.5% steps. 0xFF if ERROR.
var TYPE_REED         = 0x03; //REED Counter - 2 Byte: UINT16 MSB First, single steps. Overflow @ 65535.
var TYPE_MOTION       = 0x04; //Motion Counter - 2 Byte: UINT16 MSB First, single steps. Overflow @ 65535.
var TYPE_ACC          = 0x05; //Accelerometer - 6 Byte: X,Y,Z All ACC values are INT16 MSB First, 1 mg steps. 0x7FFF if ERROR.
var TYPE_TEMP_H       = 0x06; //Temperature History - 16 Byte: All Temperature values are INT16 MSB First, 0.01°C steps. 0x7FFF if ERROR, 0x7FFE if not used/empty.
var TYPE_HUM_H        = 0x07; //Humidity History - 8 Byte: All Humidity values are UINT8 (0 to 200), 0.5% steps. 0xFF if ERROR, 0xFE if not used/empty.

// status modes (normal)
var EVENT_TIMED     = 128; // 10000000
var EVENT_BUTTON    =  64; // 01000000
var EVENT_REED      =  32; // 00100000
var EVENT_TEMP      =  16; // 00010000
var EVENT_HUM       =   8; // 00001000
var EVENT_MOTION    =   4; // 00000100
var EVENT_LIFE      =   2; // 00000010

// status modes (workplace)
var USAGE_START     = 128; // 10000000
var USAGE_CHECK     =  64; // 01000000
var USAGE_BUTTON    =  32; // 00100000
var USAGE_LIFE      =  16; // 00010000

// function to get unsigned int16 from binary
function bin16udec(bin) {
    var num = bin & 0xFFFF;
    return num;
}

// function to get int16 from binary
function bin16dec(bin) {
    var num = bin & 0xFFFF;
    if (0x8000 & num)
        num = - (0x010000 - num);
    return num;
}

// function to get unsigned int8 from binary
function bin8udec(bin) {
    var num = bin & 0xFF;
    return num;
}

/*
// function to get int8 from binary
function bin8dec(bin) {
    var num = bin & 0xFF;
    if (0x80 & num)
        num = - (0x0100 - num);
    return num;
}

// function to get binary from hex input
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Utility function required by the Actility driver, do not delete
function readShort(bin) {
    var result = bin & 0xffff;
    if (0x8000 & result) {
        result = -(0x010000 - result);
    }
    return result;
}
*/

// the multisense decode function
function decodeUplink(input){
    var data = input.bytes;
    var obj = {};
    obj.payloadVersion = bin8udec(data[0]);
    var mode = bin8udec(data[1]);
    var mode_status = bin8udec(data[2]);
    obj.batteryVoltage = 2000 + bin8udec(data[3]) * 6;

    // detect mode
    if (mode == 0) {
        obj.mode = "NORMAL";
        // detect status (normal)
        if (mode_status & EVENT_TIMED) {
            obj.modeStatus = "TIMED";
        } else if (mode_status & EVENT_BUTTON) {
            obj.modeStatus = "BUTTON";
        } else if (mode_status & EVENT_REED) {
            obj.modeStatus = "REED";
        } else if (mode_status & EVENT_TEMP) {
            obj.modeStatus = "TEMP";
        } else if (mode_status & EVENT_HUM) {
            obj.modeStatus = "HUM";
        } else if (mode_status & EVENT_MOTION) {
            obj.modeStatus = "MOTION";
        } else if (mode_status & EVENT_LIFE) {
            obj.modeStatus = "LIFE";
        } else {
            obj.modeStatus = "UNKNOWN";
            throw new Error("Unknown event type in NORMAL mode");
        }
    } else if (mode == 1){
        obj.mode = "WORKPLACE";
        // detect status (workplace)
        if (mode_status & USAGE_START) {
            obj.modeStatus = "START";
        } else if (mode_status & USAGE_CHECK) {
            obj.modeStatus = "CHECK";
        } else if (mode_status & USAGE_BUTTON) {
            obj.modeStatus = "BUTTON";
        } else if (mode_status & USAGE_LIFE) {
            obj.modeStatus = "LIFE";
        } else {
            obj.modeStatus = "UNKNOWN";
            throw new Error("Unknown event type in WORKPLACE mode");
        }
    } else {
        obj.mode = "UNKNOWN";
        obj.modeStatus = "UNKNOWN";
        throw new Error("Unknown mode id: '" + mode + "', message cannot be decoded");
    }


    for(var i = 4; i < data.length; i++){
        switch(data[i]){
            case TYPE_TEMP:
                var temp = bin16dec((data[i+1]<<8) | (data[i+2]))
                obj.temperature = +(Math.round((temp * 0.01) + "e+" + 2)  + "e-" +2);
                if (temp == 32767) { // 7FFF -> temp error
                    throw new Error("Invalid temperature value: 7FFF");
                }
                i+=2;
                break
            case TYPE_HUM:
                var hum = bin8udec(data[i+1])
                obj.humidity = +(Math.round((hum * 0.5) + "e+" +2)  + "e-"+2);
                if (hum == 255) { // FF -> temp error
                    throw new Error("Invalid humidity value: 255");
                }
                i+=1;
                break
            case TYPE_REED:
                obj.reedCounter = bin16udec((data[i+1]<<8) | (data[i+2]));
                i+=2;
                break
            case TYPE_MOTION:
                obj.motionCounter = bin16udec((data[i+1]<<8) | (data[i+2]));
                i+=2;
                break
            case TYPE_ACC:
                var acc = {}
                acc.x = bin16dec((data[i+1]<<8) | (data[i+2]));
                acc.y = bin16dec((data[i+3]<<8) | (data[i+4]));
                acc.z = bin16dec((data[i+5]<<8) | (data[i+6]));
                obj.accelerometer = acc;
                i+=6;
                break
            case TYPE_TEMP_H:
                obj.historyTemperature = {};
                var totalTemperature = 0;
                for(var ti = 0; ti < 8; ti++) {
                    var tmp = bin16dec((data[i+1]<<8) | (data[i+2]))
                    obj.historyTemperature[ti] = +(Math.round((tmp*0.01) + "e+"+2)  + "e-"+2)
                    if (tmp == 32767) { // 7FFF -> temp error
                        throw new Error("Invalid temperature history value: 7FFF");
                    }
                    i+=2;
                }
                obj.temperature = obj.historyTemperature[0];
                break
            case TYPE_HUM_H:
                obj.historyHumidity = {};
                var totalHumidity = 0;
                for(var ti = 0; ti < 8; ti++) {
                    var hum = bin8udec(data[i+1])
                    obj.historyHumidity[ti] = +(Math.round((hum*0.5) + "e+"+2)  + "e-"+2)
                    if (hum == 255) { // FF -> temp error
                        throw new Error("Invalid humidity history value: 255");
                    }
                    i+=1;
                }
                obj.humidity = obj.historyHumidity[0];
                break
            default: //unknown
                i=data.length;
                break
        }
    }
    return obj
}
//Only for the testing package
exports.decodeUplink = decodeUplink;