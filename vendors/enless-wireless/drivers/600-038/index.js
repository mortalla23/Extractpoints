const devices = require("../lib/devices/devices");

class Decoder {
    constructor(type) {
        this.type = type;
        this.device = devices.initialize(type);
    }

    decode(payload) {
        if (this.device && (typeof payload === "string" || payload instanceof String)) {
            return this.device.decode(payload);
        } else if (!this.device) {
            return {
                result: null,
                error: `No decoder found for type: ${this.type}`,
            };
        } else {
            return {
                result: null,
                error: "Unsupported payload type",
            };
        }
    }
}

// exports.Decoder = Decoder; 

/************************************
**********ADDED BY ACTILITY**********
************************************/

function decodeUplink(input) {
    let decoder = new Decoder('600-038');
    let output = decoder.decode(decimalArrayToHexString(input.bytes));

    if(output.error){
        return {
            errors: [output.error],
            warnings: []
        }
    }

    const result = output.result;
    return {
        data: result,
        errors: [],
        warnings: []
    };
}

function decimalArrayToHexString(decimalArray) {
    const hexArray = decimalArray.map(value => value.toString(16).padStart(2, '0'));
    const hexString = hexArray.join('');
  
    return hexString;
}

exports.decodeUplink = decodeUplink;