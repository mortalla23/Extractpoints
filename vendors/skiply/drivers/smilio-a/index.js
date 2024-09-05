
function replaceAll(str, toRemove, toAdd){
    while(str.includes(toRemove)){
        str = str.replace(toRemove, toAdd)
    }
    return str;
}

function convertToArray(bytes)
{
    var bytesToReturn = [];

    for (var i = 0; i != bytes.length; i++) {
        if (bytes[i] < 16) {
            bytesToReturn.push(0 + bytes[i].toString(16));
        } else {
            bytesToReturn.push(bytes[i].toString(16));
        }
    }

    return (bytesToReturn);
}

function decodeUplink(input) {

    const fPort = input.fPort;
    let bytes = convertToArray(input.bytes);
    let result = {
        data: {},
        errors: [],
        warnings: []
    };

    var payloadType = parseInt("0x" + replaceAll(bytes.slice(0, 1).toString(), ',', ''));
    
    switch(payloadType){
        case 1:
            result.data.dataFrame = "Keep alive";
            result.data.batteryVoltageIDLE = parseInt("0x" + replaceAll(bytes.slice(1, 3).toString(), ',', ''));
            result.data.batteryVoltageTx = parseInt("0x" + replaceAll(bytes.slice(3, 5).toString(), ',', ''));
            break;
        case 2:
            result.data.dataFrame = "Normal";
            result.data.counter1 = parseInt("0x" + replaceAll(bytes.slice(1, 3).toString(), ',', ''));
            result.data.counter2 = parseInt("0x" + replaceAll(bytes.slice(3, 5).toString(), ',', ''));
            result.data.counter3 = parseInt("0x" + replaceAll(bytes.slice(5, 7).toString(), ',', ''));
            result.data.counter4 = parseInt("0x" + replaceAll(bytes.slice(7, 9).toString(), ',', ''));
            result.data.counter5 = parseInt("0x" + replaceAll(bytes.slice(9, 11).toString(), ',', ''));
            break;
        case 3:
            result.data.dataFrame = "SKIPLY magnetic badge";
            result.data.counter1 = parseInt("0x" + replaceAll(bytes.slice(1, 3).toString(), ',', ''));
            result.data.counter2 = parseInt("0x" + replaceAll(bytes.slice(3, 5).toString(), ',', ''));
            result.data.counter3 = parseInt("0x" + replaceAll(bytes.slice(5, 7).toString(), ',', ''));
            result.data.counter4 = parseInt("0x" + replaceAll(bytes.slice(7, 9).toString(), ',', ''));
            result.data.counter5 = parseInt("0x" + replaceAll(bytes.slice(9, 11).toString(), ',', ''));
            break;
        default:
            break;
    }

    return result;
}

exports.decodeUplink = decodeUplink;