
function decodeUplink(input) {
    let fPort = input.fPort;
    let bytes = input.bytes;

    let result = {
        data: {

        },
        warnings: [],
        errors: []
    }


    if(bytes.length < 20){
        result.errors.push("Wrong payload length: " + bytes.length + ". It should be at least 20 bytes");
        return result;
    }

    result.data.protocolType = bytes[0];
    result.data.meterManufacturerID = (bytes[2].toString(16) + bytes[1].toString(16)).toUpperCase();

    let meterId = "";
    if(bytes[6]) meterId += bytes[6].toString(16);
    if(bytes[5]) meterId += bytes[5].toString(16);
    if(bytes[4]) meterId += bytes[4].toString(16);
    if(bytes[3]) meterId += bytes[3].toString(16);
    result.data.meterID = meterId;

    let meterMediumNumber = bytes[7];
    switch(meterMediumNumber) {
        case 3:
            result.data.meterMedium = "Gas";
            break;
        case 6:
            result.data.meterMedium = "Warm Water";
            break;
        case 7:
            result.data.meterMedium = "Water";
        default:
            break;
    }

    result.data.stateMBus = [];
    let stateMBusBits = bytes[8];
    
    switch(stateMBusBits && 0b11) {
        case 0:
            break;
        case 1:
            result.data.stateMBus.push("Application Busy");
            break;
        case 2:
            result.data.stateMBus.push("Any Application Error");
            break;
        case 3:
            result.data.stateMBus.push("Reserved");
            break;
        default:
            break;
    }

    if((stateMBusBits && 4) === 4) result.data.stateMBus.push("Power Low");
    else result.data.stateMBus.push("Power Not Low");

    if((stateMBusBits && 8) === 8) result.data.stateMBus.push("Permanent Error");
    else result.data.stateMBus.push("No Permanent Error");

    if((stateMBusBits && 16) === 16) result.data.stateMBus.push("Temporary Error");
    else result.data.stateMBus.push("No Temporary Error");

    if((stateMBusBits && 32) === 32) result.data.stateMBus.push("Communication Error 1");

    if((stateMBusBits && 64) === 64) result.data.stateMBus.push("Communication Error 2");

    if((stateMBusBits && 128) === 128) result.data.stateMBus.push("Communication Error 3");

    result.data.actualityDuration_minutes = (bytes[10] << 8) + bytes[9];

    let volumeVIF = bytes[11];
    if(volumeVIF === undefined) {
        result.errors.push("Error decoding Volume");
        return result;
    }
    let rightShift = 16 - parseInt(volumeVIF.toString(16));
    
    result.data.volume_metersCubed = ((bytes[15] << 24) + (bytes[14] << 16) + (bytes[13] << 8) + bytes[12]) / Math.pow(10, rightShift);
    
    result.data.additionalFunctions = [];
    if((bytes[16] & 0x02) >> 1) result.data.additionalFunctions.push("Continuous Flow");
    else result.data.additionalFunctions.push("No Continuous Flow");
    if((bytes[16] & 0x08) >> 3) result.data.additionalFunctions.push("Broken Pipe");
    else result.data.additionalFunctions.push("No Broken Pipes");
    if((bytes[16] & 0x20) >> 5) result.data.additionalFunctions.push("Battery Low");
    if((bytes[16] & 0x40) >> 6) result.data.additionalFunctions.push("Backflow");
    if((bytes[16] & 0x80) >> 7) result.data.additionalFunctions.push("No Usage");
    
    result.data.batteryLifeTime_semesters = 0;
    if((bytes[17] & 0x04) >> 2) result.errors.push("No ACK received from Concentrator");
    result.data.batteryLifeTime_semesters = (bytes[17] >> 3) & 0x1F;

    result.data.checksum = bytes[19] << 8 + bytes[18];

    return result;
}

exports.decodeUplink = decodeUplink;