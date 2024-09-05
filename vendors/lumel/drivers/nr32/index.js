//This driver is only available for a payload of data length of 20 bytes per payload and in the configuraton where each pack of information is spread across 2 payloads 
// 1rst payload: xxxxxxxx        01                 14               xxxxxxxx       xxxxxxxx         xxxxxxxx         xxxxxxxx          xxxxxxxx
//             (Serial nbr)(Meter address)(Data length: 20 bytes)(Total current)(L1 power factor)(L2 power factor)(L3 power factor)(Total power factor)

// 2nd payload:  xxxxxxxx         02                 14              xxxxxxxx         xxxxxxxx         xxxxxxxx           xxxxxxxx       xxxxxxxx
//             (Serial nbr)(Meter address)(Data length: 20 bytes)(L1 active power)(L2 active power)(L3 active power)(Total active power)(Total kWh)


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

    result.data.serialNumber = parseInt("0x" + replaceAll(bytes.slice(0, 4).toString(), ',', ''));

    var payloadIndex = parseInt("0x" + replaceAll(bytes.slice(4, 5).toString(), ',', '')); 
    
    switch(payloadIndex){
        case 1:
            result.data.currentTotal = Math.round(hexToFloat32(replaceAll(bytes.slice(6, 10).toString(), ',', '')) * 100) / 100;
            result.data.powerFactorL1 = Math.round(hexToFloat32(replaceAll(bytes.slice(10, 14).toString(), ',', '')) * 100) / 100;
            result.data.powerFactorL2 = Math.round(hexToFloat32(replaceAll(bytes.slice(14, 18).toString(), ',', '')) * 100) / 100;
            result.data.powerFactorL3 = Math.round(hexToFloat32(replaceAll(bytes.slice(18, 22).toString(), ',', '')) * 100) / 100;
            result.data.powerFactorTotal = Math.round(hexToFloat32(replaceAll(bytes.slice(22, 26).toString(), ',', '')) * 100) / 100;
            break;
        case 2:
            result.data.activePowerL1 = Math.round(hexToFloat32(replaceAll(bytes.slice(6, 10).toString(), ',', '')) * 100) / 100;
            result.data.activePowerL2 = Math.round(hexToFloat32(replaceAll(bytes.slice(10, 14).toString(), ',', '')) * 100) / 100;
            result.data.activePowerL3 = Math.round(hexToFloat32(replaceAll(bytes.slice(14, 18).toString(), ',', '')) * 100) / 100;
            result.data.activePowerTotal = Math.round(hexToFloat32(replaceAll(bytes.slice(18, 22).toString(), ',', '')) * 100) / 100;
            result.data.kWhTotal = Math.round(hexToFloat32(replaceAll(bytes.slice(22, 26).toString(), ',', '')) * 100) / 100;
            break;
        default:
            break;
    }

    return result;
}

/* ******************************************
 * bytes to number
 ********************************************/
function hexToFloat32(str) {
    var int = parseInt(str, 16);
    if (int > 0 || int < 0) {
        var sign = int >>> 31 ? -1 : 1;
        var exp = ((int >>> 23) & 0xff) - 127;
        var mant = ((int & 0x7fffff) + 0x800000).toString(2);
        var float32 = 0;
        for (let i = 0; i < mant.length; i += 1) {
            float32 += parseInt(mant[i]) ? Math.pow(2, exp) : 0;
            exp--;
        }
        return float32 * sign;
    } else return 0;
}

exports.decodeUplink = decodeUplink;