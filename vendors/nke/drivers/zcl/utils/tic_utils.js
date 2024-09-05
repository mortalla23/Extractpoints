const utils = require("../utils/common-utils");

function decode(attributeType, bytes, fieldsValues) {
    const ticFieldList = retrieveTicFieldList(attributeType, bytes);
    const ticFieldsValues = retrieveFieldsValues(ticFieldList, fieldsValues, bytes);
    return {
        FieldsSelector: {
            IsTicOK: ticFieldList.isTicOK,
            IsStandard: ticFieldList.isStandard,
            FieldsListType: ticFieldList.fieldsListType,
            Size: ticFieldList.size
        },
        Fields: ticFieldsValues
    }
}

exports.decode = decode;

function decodeSpecificCommand(bytes) {
    const descriptor = bytes.shift();
    const isOk = retrieveIsOk(descriptor);
    const isStandard = retrieveIsStandard(descriptor);
    const ticFieldsListType = retrieveTicFieldsListType(descriptor);
    const selectorSize = retrieveSelectorSize(descriptor);
    return {
        FieldsSelector: {
            IsTicOK: isOk,
            IsStandard: isStandard,
            FieldsListType: ticFieldsListType,
            Size: selectorSize
        }
    }
}

exports.decodeSpecificCommand = decodeSpecificCommand;

function retrieveTicFieldList(attributeType, bytes) {
    let sizeOfTicFields;

    if (attributeType === "ByteString") {
        sizeOfTicFields = bytes.shift();
    } else if (attributeType === "LongByteString") {
        sizeOfTicFields = bytes.shift() * 256 + bytes.shift();
    } else {
        throw ("attribute type is not supported");
    }

    if (bytes.length != sizeOfTicFields) {
        throw ("problem with size");
    }

    let fieldsPositions;

    const descriptor = bytes.shift();

    const isOk = retrieveIsOk(descriptor);
    const isStandard = retrieveIsStandard(descriptor);
    const ticFieldsListType = retrieveTicFieldsListType(descriptor);
    const selectorSize = retrieveSelectorSize(descriptor);

    if (selectorSize === 0) {
        fieldsPositions = bytes.splice(0, 7);
    } else {
        fieldsPositions = bytes.splice(0, selectorSize - 1);
    }

    let fieldBits = retrieveFieldsPosition(fieldsPositions, ticFieldsListType);

    return {
        isTicOK: isOk,
        isStandard: isStandard,
        fieldsListType: ticFieldsListType,
        size: selectorSize,
        fieldsPosition: fieldBits
    }
}

function retrieveTicFieldsListType(descriptor) {
    return (descriptor & 0x20) == 0x00 ? "DescVarBitField" : "DescVarIndexes";
}

function retrieveIsOk(descriptor) {
    return (descriptor & 0x80) == 0x00;
}

function retrieveIsStandard(descriptor) {
    return (descriptor & 0x40) == 0x00;
}

function retrieveSelectorSize(descriptor) {
    return descriptor & 0x1f;
}

function retrieveFieldsPosition(fieldsPositions, ticFieldsListType) {
    let fieldsBits = [];

    if (ticFieldsListType === "DescVarBitField") {
        for (let i = 0; i < fieldsPositions.length; i++) {
            let mask = 1;
            for (let j = 0; j < 8; j++) {
                if ((mask & fieldsPositions[fieldsPositions.length - i - 1]) == mask) {
                    fieldsBits.push(i * 8 + j);
                }
                mask = mask << 1;
            }
        }
    } else {
        for (fieldsPosition of fieldsPositions) {
            fieldsBits.push(fieldsPosition);
        }
    }
    return fieldsBits;
}

function retrieveFieldsValues(ticFieldsList, clusterFields, bytes) {
    let fields = {};
    ticFieldsList.fieldsPosition.forEach(
        position => {
            let ticField = clusterFields.get(position);
            fields[ticField.label] = decodeFieldType(ticField.ticFieldType, bytes);
        }
    );
    return fields;
}

function decodeFieldType(fieldType, bytes) {
    switch (fieldType) {
        case "Empty": {
            return null;
        }
        case "Float": {
            const hex = utils.bytesToHex(bytes.splice(0, 4));
            let int = parseInt(hex, 16);
            if (int > 0 || int < 0) {
                let sign = (int >>> 31) ? -1 : 1;
                let exp = (int >>> 23 & 0xff) - 127;
                let mantissa = ((int & 0x7fffff) + 0x800000).toString(2);
                let float32 = 0;
                for (i = 0; i < mantissa.length; i += 1) {
                    float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0;
                    exp--;
                }
                ;
                return float32 * sign;
            } else {
                return 0;
            }
            break;
        }
        case "U8": {
            return bytes.shift();
        }
        case "U16": {
            return utils.bytesToDec(bytes.splice(0, 2));
        }
        case "U24": {
            return utils.bytesToDec(bytes.splice(0, 3));
        }
        case "U32": {
            return utils.bytesToDec(bytes.splice(0, 4));
        }
        case "I16": {
            return utils.signedBytesToDec(bytes.splice(0, 2), 2);
        }
        case "Char": {
            return utils.bytesToAscii(bytes.splice(0, 1));
        }
        case "Cstring": {
            let foundBackSlash0 = false;
            let cstring = "";
            while (!foundBackSlash0) {
                let s = utils.utf8ByteArrayToString(bytes.splice(0, 1));
                if (s.charAt(0) == "\0") {
                    foundBackSlash0 = true;
                } else {
                    cstring = cstring.concat(s);
                }
            }
            return cstring;
        }
        case "HEXSTRING": {
            const size = utils.bytesToDec(bytes.splice(0, 1));
            return utils.bytesToHex(bytes.splice(0, size));
        }
        case "hmDM": {
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            return hour + ":" + minute + ":" + day + ":" + month;
        }
        case "DMh": {
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            return day + ":" + month + ":" + hour;
        }
        case "hm": {
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            return hour + ":" + minute;
        }
        case "DMYhms": {
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            let year = bytes.shift();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = bytes.shift();
            if (second < 10) {
                second = "0".concat(second);
            }
            return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
        }
        case "SDMYhms": {
            const string = utils.bytesToAscii(bytes.splice(0, 1));
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            let year = bytes.shift();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = bytes.shift();
            if (second < 10) {
                second = "0".concat(second);
            }
            return string + "" + day + "" + month + "" + year + "" + hour + "" + minute + "" + second;
        }
        case "SDMYhmsU8": {
            const string = utils.bytesToAscii(bytes.splice(0, 1));
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            let year = bytes.shift();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = bytes.shift();
            if (second < 10) {
                second = "0".concat(second);
            }
            const u8 = bytes.shift();
            return string + "" + day + "" + month + "" + year + "" + hour + "" + minute + "" + second + "" + u8;
        }
        case "SDMYhmsU16": {
            const string = utils.bytesToAscii(bytes.splice(0, 1));
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            let year = bytes.shift();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = bytes.shift();
            if (second < 10) {
                second = "0".concat(second);
            }
            const u16 = utils.bytesToDec(bytes.splice(0, 2));
            return string + "" + day + "" + month + "" + year + "" + hour + "" + minute + "" + second + "" + u16;
        }
        case "SDMYhmsU24": {
            const string = utils.bytesToAscii(bytes.splice(0, 1));
            let day = bytes.shift();
            if (day < 10) {
                day = "0".concat(day);
            }
            let month = bytes.shift();
            if (month < 10) {
                month = "0".concat(month);
            }
            let year = bytes.shift();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = bytes.shift();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = bytes.shift();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = bytes.shift();
            if (second < 10) {
                second = "0".concat(second);
            }
            const u24 = utils.bytesToDec(bytes.splice(0, 3));
            return string + "" + day + "" + month + "" + year + "" + hour + "" + minute + "" + second + "" + u24;
        }
        case "tsDMYhms": {
            const timestamp = utils.bytesToDec(bytes.splice(0, 4));
            const date = new Date(timestamp * 1000);
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = "0".concat(month);
            }
            let day = date.getDate();
            if (day < 10) {
                day = "0".concat(day);
            }
            let year = date.getFullYear();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = date.getHours();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = date.getMinutes();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = date.getSeconds();
            if (second < 10) {
                second = "0".concat(second);
            }

            return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second + " UTC";
        }
        case "E_DIV": {
            let ediv = ["!?!", "*", "", "  ACTIF", "ACTIF", "CONSO", "CONTROLE", "DEP", "INACTIF", "PROD", "TEST", "kVA", "kW"];
            const header = bytes.shift();
            let edivByte = header & 0x7f;
            if (((header >> 7) & 0x01) == 0) {
                return ediv[edivByte];
            } else {
                if (bytes.length <= 128) {
                    return utils.utf8ByteArrayToString(bytes.splice(0, edivByte));
                } else {
                    throw ("error : E_DIV size should be <= 128!");
                }
            }
        }
        case "E_CONTRAT": {
            let econtrat = ["!?!", "*", "", "PT 4 SUP36", "PT 5 SUP36", "HTA 5", "HTA 8", "TJ EJP", "TJ EJP-HH", "TJ EJP-PM", "TJ EJP-SD", "TJ LU", "TJ LU-CH", "TJ LU-P", "TJ LU-PH", "TJ LU-SD", "TJ MU", "TV A5 BASE", "TV A8 BASE"];
            const header = bytes.shift();
            let econtratByte = header & 0x7f;
            if (((header >> 7) & 0x01) == 0) {
                return econtrat[econtratByte];
            } else {
                if (bytes.length <= 128) {
                    return utils.utf8ByteArrayToString(bytes.splice(0, econtratByte));
                } else {
                    throw ("error : E_CONTRAT size should be <= 128!");
                }
            }
        }
        case "E_PT": {
            let ept = ["!?!", "*", "", " ? ", "000", "HC", "HCD", "HCE", "HCH", "HH", "HH ", "HP", "HP ", "HPD", "HPE", "HPH", "JA", "JA ", "P", "P  ", "PM", "PM ", "XXX"];
            const header = bytes.shift();
            let eptByte = header & 0x7f;
            if (((header >> 7) & 0x01) == 0) {
                return ept[eptByte];
            } else {
                if (bytes.length <= 128) {
                    return utils.utf8ByteArrayToString(bytes.splice(0, eptByte));
                } else {
                    throw ("error : E_PT size should be <= 128!");
                }
            }
        }
        case "tsDMYhms_E_PT": {
            let ept = ["!?!", "*", "", " ? ", "000", "HC", "HCD", "HCE", "HCH", "HH", "HH ", "HP", "HP ", "HPD", "HPE", "HPH", "JA", "JA ", "P", "P  ", "PM", "PM ", "XXX"];
            const timestamp = utils.bytesToDec(bytes.splice(0, 4));
            const date = new Date(timestamp);
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = "0".concat(month);
            }
            let day = date.getDate();
            if (day < 10) {
                day = "0".concat(day);
            }
            let year = date.getFullYear();
            if (year < 10) {
                year = "0".concat(year);
            }
            let hour = date.getHours();
            if (hour < 10) {
                hour = "0".concat(hour);
            }
            let minute = date.getMinutes();
            if (minute < 10) {
                minute = "0".concat(minute);
            }
            let second = date.getSeconds();
            if (second < 10) {
                second = "0".concat(second);
            }

            const header = bytes.shift();
            let eptByte = header & 0x7f;
            if (((header >> 7) & 0x01) == 0) {
                return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second + " "
                ept[eptByte];
            } else {
                if (bytes.length <= 128) {
                    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second + " " + utils.utf8ByteArrayToString(bytes.splice(0, eptByte));
                } else {
                    throw ("error : E_PT size should be <= 128!");
                }
            }
        }
        case "U24_E_DIV": {
            let ediv = ["!?!", "*", "", "  ACTIF", "ACTIF", "CONSO", "CONTROLE", "DEP", "INACTIF", "PROD", "TEST", "kVA", "kW"];
            const u24 = utils.bytesToDec(bytes.splice(0, 3));
            const header = bytes.shift();
            let edivByte = header & 0x7f;
            if (((header >> 7) & 0x01) == 0) {
                return  u24 + " " + ediv[edivByte];
            } else {
                if (bytes.length <= 128) {
                    return u24 + " " + utils.utf8ByteArrayToString(bytes.splice(0, edivByte));
                } else {
                    throw ("error : E_DIV size should be <= 128!");
                }
            }
        }
        case "SSSS": {
            return utils.bytesToHex(bytes.splice(0, 2));
        }
        case "11hhmmSSSS": {
            let result = bytes.shift() + ":" + bytes.shift();
            for (let i = 0; i < 10; i++) {
                result = result.concat(":" + bytes.shift() + ":" + bytes.shift());
            }
            result = result.concat(utils.bytesToHex(bytes.splice(0, 2)));
            return result;
        }
        case "bf8d": {
            return utils.bytesToDec(bytes.splice(0, 1));
        }
        case "U32xbe": {
            return utils.bytesToHex(bytes.splice(0, 4));
        }

    }
}

function encode(attributeType, data, fieldsValues) {
    let bytes = [];
    let temporaryBytes = [];
    const size = retrieveSize(data, temporaryBytes, fieldsValues);
    if (attributeType === "ByteString") {
        bytes = bytes.concat(utils.decToBytes(size));
    } else if (attributeType === "LongByteString") {
        let toPush = utils.decToBytes(size);
        while (toPush.length < 2) {
            toPush.unshift(0x00);
        }
        bytes = bytes.concat(toPush);
    } else {
        throw ("attribute type is not supported");
    }
    bytes = writePosition(data, bytes, fieldsValues);
    bytes = writeValue(data, bytes, fieldsValues);
    return bytes;
}

exports.encode = encode;

function encodeSpecificCommand(data) {
    return descriptor(data);
}

exports.encodeSpecificCommand = encodeSpecificCommand;

function retrieveSize(data, bytes, fieldsValues) {
    bytes = writePosition(data, bytes, fieldsValues);
    bytes = writeValue(data, bytes, fieldsValues);
    return bytes.length;
}

function writeValue(data, bytes, fieldsValues) {
    for (let fieldLabel of Object.keys(data.Fields)) {
        for (let [key, value] of fieldsValues) {
            if (fieldLabel === value.label) {
                bytes = encodeFieldType(data.Fields[fieldLabel], value.ticFieldType, bytes);
            }
        }
    }
    return bytes;
}

function writePosition(data, bytes, fieldsValues) {
    const selectorSize = retrieveSelectorSize(descriptor(data));
    let position = retrievePosition(data, bytes, fieldsValues);
    position.sort();
    let mask1 = 1;
    let mask2 = 1;
    if (selectorSize == 0) {
        for (let i = position.length - 1; i > 0; i--) {
            let n = position[i] - position[i - 1];
            if (position[i] <= 32) {
                mask1 = (mask1 << n) | 0x01;
            } else {
                if (mask2 == 1) {
                    if (n >= 32) {
                        mask2 = (mask2 << n - 32);
                    } else {
                        mask2 = (mask2 << n) | 0x01;
                    }
                } else {
                    mask2 = (mask2 << position[i] - 32);
                }
            }
        }
        mask1 = mask1 << position[0];
        if (mask1 == 1) {
            mask1 = 0;
        }
        if (mask2 == 1) {
            mask2 = 0;
        }
        const toPush2 = utils.decToBytes(mask2);
        while (toPush2.length < 3) {
            toPush2.unshift(0x00);
        }
        bytes = bytes.concat(toPush2);

        const toPush1 = utils.decToBytes(mask1);
        while (toPush1.length < 4) {
            toPush1.unshift(0x00);
        }
        bytes = bytes.concat(toPush1);
    } else {
        let array = [];
        for (let i = position.length - 1; i >= 0; i--) {
            let mask = 1;
            mask = (mask << (position[i] % 8));
            let n = position[i] / 8;
            array[n] = (array[n] | mask);
        }

        bytes = bytes.concat(array);
    }
    return bytes;
}

function retrievePosition(data, bytes, fieldsValues) {
    bytes.push(descriptor(data));
    let position = [];
    for (let field of Object.keys(data.Fields)) {
        for (let [key, value] of fieldsValues) {
            if (field === value.label) {
                position.push(key);
            }
        }
    }
    return position;
}

function descriptor(data) {
    const isTicOkBit = (data.FieldsSelector.IsTicOK ? 0 : 1) << 7;
    const isStandardBit = (data.FieldsSelector.IsStandard ? 0 : 1) << 6;
    const ticFieldsListTypeBit = encodeTicFieldsListType(data.FieldsSelector.FieldsListType) << 5;
    const selectorSizeBit = ((data.FieldsSelector.Size) & 0x1f);
    return (isTicOkBit | isStandardBit | ticFieldsListTypeBit | selectorSizeBit);
}

function encodeTicFieldsListType(type) {
    switch (type) {
        case "DescVarBitField":
            return 0;
        case "DescVarIndexes":
            return 1;
    }
}

function encodeFieldType(fieldValue, fieldType, bytes) {
    switch (fieldType) {
        case "Empty": {
            return bytes;
        }
        case "Float": {
            let toPush = utils.decToBytes(fieldValue);
            while (toPush.length < 4) {
                toPush.unshift(0x00);
            }
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "U8": {
            if (fieldValue < 0) {
                throw ("error: value should be unsigned!" + fieldValue);
            }
            let toPush = utils.decToBytes(fieldValue);
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "U16": {
            if (fieldValue < 0) {
                throw ("error: value should be unsigned!" + fieldValue);
            }
            let toPush = utils.decToBytes(fieldValue);
            while (toPush.length < 2) {
                toPush.unshift(0x00);
            }
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "U24": {
            if (fieldValue < 0) {
                throw ("error: value should be unsigned!" + fieldValue);
            }
            let toPush = utils.decToBytes(fieldValue);
            while (toPush.length < 3) {
                toPush.unshift(0x00);
            }
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "U32": {
            if (fieldValue < 0) {
                throw ("error: value should be unsigned!" + fieldValue);
            }
            let toPush = utils.decToBytes(fieldValue);
            while (toPush.length < 4) {
                toPush.unshift(0x00);
            }
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "I16": {
            let toPush = utils.decToBytes(fieldValue);
            while (toPush.length < 2) {
                toPush.unshift(0x00);
            }
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "Char": {
            bytes = bytes.concat(utils.asciiToBytes(fieldValue));
            return bytes;
        }
        case "Cstring": {
            bytes = bytes.concat(utils.stringToUtf8ByteArray(fieldValue));
            bytes = bytes.concat(utils.stringToUtf8ByteArray("\0"));
            return bytes;
        }
        case "HEXSTRING": {
            bytes = bytes.concat(utils.decToBytes(fieldValue.length));
            bytes = bytes.concat(utils.hexToBytes(fieldValue));
            return bytes;
        }
        case "hmDM": {
            if (fieldValue.length == 11) {
                const values = fieldValue.split(":");
                bytes = bytes.concat(utils.decToBytes(parseInt(values[0])));
                bytes = bytes.concat(utils.decToBytes(parseInt(values[1])));
                bytes = bytes.concat(utils.decToBytes(parseInt(values[2])));
                bytes = bytes.concat(utils.decToBytes(parseInt(values[3])));
                return bytes;
            } else {
                throw ("error: hmDM size should be 11!");
            }
        }
        case "DMh": {
            if (fieldValue.length == 8) {
                const values = fieldValue.split(":");
                bytes = bytes.concat(utils.decToBytes(parseInt(values[0])));
                bytes = bytes.concat(utils.decToBytes(parseInt(values[1])));
                bytes = bytes.concat(utils.decToBytes(parseInt(values[2])));
                return bytes;
            } else {
                throw ("error: DMh size should be 8!");
            }
        }
        case "hm": {
            if (fieldValue.length == 5) {
                const values = fieldValue.split(":");
                bytes = bytes.concat(utils.decToBytes(parseInt(values[0])));
                bytes = bytes.concat(utils.decToBytes(parseInt(values[1])));
                return bytes;
            } else {
                throw ("error: hm size should be 5!");
            }
        }
        case "DMYhms": {
            if (fieldValue.length == 17) {
                const dateAndTime = fieldValue.split(" ");
                const date = dateAndTime[0].split("/");
                const time = dateAndTime[1].split(":");
                bytes = bytes.concat(utils.decToBytes(parseInt(date[0])));
                bytes = bytes.concat(utils.decToBytes(parseInt(date[1])));
                bytes = bytes.concat(utils.decToBytes(parseInt(date[2])));
                bytes = bytes.concat(utils.decToBytes(parseInt(time[0])));
                bytes = bytes.concat(utils.decToBytes(parseInt(time[1])));
                bytes = bytes.concat(utils.decToBytes(parseInt(time[2])));
                return bytes;
            } else {
                throw ("error: DMYhms size should be 17!");
            }
        }
        case "SDMYhms": {
            if (fieldValue.length == 13) {
                bytes = bytes.concat(utils.asciiToBytes(fieldValue.substring(0, 1)));
                for (let i = 1; i < fieldValue.length; i += 2) {
                    bytes = bytes.concat(utils.decToBytes(parseInt(fieldValue.substring(i, i + 2))));
                }
                return bytes;
            } else {
                throw ("error: SDMYhms size should be 13");
            }
        }
        case "SDMYhmsU8": {
            if (fieldValue.length == 15) {
                bytes = bytes.concat(utils.asciiToBytes(fieldValue.substring(0, 1)));
                for (let i = 1; i < fieldValue.length; i += 2) {
                    bytes = bytes.concat(utils.decToBytes(parseInt(fieldValue.substring(i, i + 2))));
                }
                return bytes;
            } else {
                throw ("error: SDMYhmsU8 size should be 15!");
            }
        }
        case "SDMYhmsU16": {
            if (fieldValue.length == 17) {
                bytes = bytes.concat(utils.asciiToBytes(fieldValue.substring(0, 1)));
                for (let i = 1; i < fieldValue.length - 4; i += 2) {
                    bytes = bytes.concat(utils.decToBytes(parseInt(fieldValue.substring(i, i + 2))));
                }
                let toPush = utils.decToBytes(parseInt(fieldValue.substring(13, 17)));
                while (toPush.length < 2) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
                return bytes;
            } else {
                throw ("error: SDMYhmsU16 size should be 17!");
            }
        }
        case "SDMYhmsU24": {
            if (fieldValue.length == 19) {
                bytes = bytes.concat(utils.asciiToBytes(fieldValue.substring(0, 1)));
                for (let i = 1; i < fieldValue.length - 6; i += 2) {
                    bytes = bytes.concat(utils.decToBytes(parseInt(fieldValue.substring(i, i + 2))));
                }
                let toPush = utils.decToBytes(parseInt(fieldValue.substring(13, 19)));
                while (toPush.length < 3) {
                    toPush.unshift(0x00);
                }
                bytes = bytes.concat(toPush);
                return bytes;
            } else {
                throw ("error: SDMYhmsU24 size should be 19!");
            }
        }
        case "tsDMYhms": {
            const dateAndTime = fieldValue.split(" ");
            const date = dateAndTime[0].split("/");
            const time = dateAndTime[1].split(":");
            const day = parseInt(date[0]);
            const month = parseInt(date[1]);
            const year = parseInt(date[2]);
            const hour = parseInt(time[0]);
            const minute = parseInt(time[1]);
            const second = parseInt(time[2]);
            const datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
            bytes = bytes.concat(utils.decToBytes(datum.getTime() / 1000));
            return bytes;
        }
        case "E_DIV": {
            const ediv = ["!?!", "*", "", "  ACTIF", "ACTIF", "CONSO", "CONTROLE", "DEP", "INACTIF", "PROD", "TEST", "kVA", "kW"];
            let found = false;
            let header = fieldValue.length;
            for (let i = 0; i < ediv.length; i++) {
                if (ediv[i] == fieldValue) {
                    if ((i & 0x7f) == i) {
                        found = true;
                        header = i;
                    } else {
                        throw ("error: unknown Enum Div");
                    }
                }
            }
            if (found) {
                bytes = bytes.concat(utils.decToBytes(header));
            } else {
                bytes = bytes.concat(utils.decToBytes(header));
                bytes = bytes.concat(utils.stringToUtf8ByteArray(fieldValue));
            }
            return bytes;
        }
        case "E_CONTRAT": {
            const econtrat = ["!?!", "*", "", "PT 4 SUP36", "PT 5 SUP36", "HTA 5", "HTA 8", "TJ EJP", "TJ EJP-HH", "TJ EJP-PM", "TJ EJP-SD", "TJ LU", "TJ LU-CH", "TJ LU-P", "TJ LU-PH", "TJ LU-SD", "TJ MU", "TV A5 BASE", "TV A8 BASE"];
            let found = false;
            let header = fieldValue.length;
            for (let i = 0; i < econtrat.length; i++) {
                if (econtrat[i] == fieldValue) {
                    if ((i & 0x7f) == i) {
                        found = true;
                        header = i;
                    } else {
                        throw ("error: unknown Enum Contrat");
                    }
                }
            }
            if (found) {
                bytes = bytes.concat(utils.decToBytes(header));
            } else {
                bytes = bytes.concat(utils.decToBytes(header));
                bytes = bytes.concat(utils.stringToUtf8ByteArray(fieldValue));
            }
            return bytes;
        }
        case "E_PT": {
            const ept = ["!?!", "*", "", " ? ", "000", "HC", "HCD", "HCE", "HCH", "HH", "HH ", "HP", "HP ", "HPD", "HPE", "HPH", "JA", "JA ", "P", "P  ", "PM", "PM ", "XXX"];
            let found = false;
            let header = fieldValue.length;
            for (let i = 0; i < ept.length; i++) {
                if (ept[i] == fieldValue) {
                    if ((i & 0x7f) == i) {
                        found = true;
                        header = i;
                    } else {
                        throw ("error: unknown Enum Contrat");
                    }
                }
            }
            if (found) {
                bytes = bytes.concat(utils.decToBytes(header));
            } else {
                bytes = bytes.concat(utils.decToBytes(header));
                bytes = bytes.concat(utils.stringToUtf8ByteArray(fieldValue));
            }
            return bytes;
        }
        case "tsDMYhms_E_PT": {
            const allData = fieldValue.split(" ");
            const date = allData[0].split("/");
            const time = allData[1].split(":");
            const day = parseInt(date[0]);
            const month = parseInt(date[1]);
            const year = parseInt(date[2]);
            const hour = parseInt(time[0]);
            const minute = parseInt(time[1]);
            const second = parseInt(time[2]);
            const datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
            bytes = bytes.concat(utils.decToBytes(datum.getTime() / 1000));
            const ept = ["!?!", "*", "", " ? ", "000", "HC", "HCD", "HCE", "HCH", "HH", "HH ", "HP", "HP ", "HPD", "HPE", "HPH", "JA", "JA ", "P", "P  ", "PM", "PM ", "XXX"];
            let found = false;
            let header = allData[2].length;
            for (let i = 0; i < ept.length; i++) {
                if (ept[i] == allData[2]) {
                    if ((i & 0x7f) == i) {
                        found = true;
                        header = i;
                    } else {
                        throw ("error: unknown Enum Contrat");
                    }
                }
            }
            if (found) {
                bytes = bytes.concat(utils.decToBytes(header));
            } else {
                bytes = bytes.concat(utils.decToBytes(header));
                bytes = bytes.concat(utils.stringToUtf8ByteArray(allData[2]));
            }
            return bytes;
        }
        case "U24_E_DIV": {
            const allData = fieldValue.split(" ");
            bytes = bytes.concat(utils.decToBytes(parseInt(allData[0])));
            const ediv = ["!?!", "*", "", "  ACTIF", "ACTIF", "CONSO", "CONTROLE", "DEP", "INACTIF", "PROD", "TEST", "kVA", "kW"];
            let found = false;
            let header = allData[1].length;
            for (let i = 0; i < ediv.length; i++) {
                if (ediv[i] == allData[1]) {
                    if ((i & 0x7f) == i) {
                        found = true;
                        header = i;
                    } else {
                        throw ("error: unknown Enum Div");
                    }
                }
            }
            if (found) {
                bytes = bytes.concat(utils.decToBytes(header));
            } else {
                bytes = bytes.concat(utils.decToBytes(header));
                bytes = bytes.concat(utils.stringToUtf8ByteArray(allData[1]));
            }
            return bytes;
        }
        case "SSSS": {
            if (fieldValue.length == 4) {
                bytes = bytes.concat(utils.hexToBytes(fieldValue));
            } else {
                throw ("error: SSSS size should be 4!");
            }
        }
        case "11hhmmSSSS": {
            const string = fieldValue.substring(fieldValue.length - 5, fieldValue.length - 1);
            bytes = bytes.concat(utils.hexToBytes(string));
            fieldValue = fieldValue.substring(0, fieldValue.length - 5);
            const allData = fieldValue.split(":");
            for (let i = 0; i < allData.length; i++) {
                bytes = bytes.concat(utils.decToBytes(parseInt(allData[i])));
            }
            return bytes;
        }
        case "bf8d": {
            if (fieldValue < 0) {
                throw ("error: value should be unsigned!" + fieldValue);
            }
            const toPush = utils.decToBytes(fieldValue);
            bytes = bytes.concat(toPush);
            return bytes;
        }
        case "U32xbe": {
            if (fieldValue.length == 8) {
                bytes = bytes.concat(utils.hexToBytes(fieldValue));
            } else {
                throw ("error: U32xbe size should be 8!");
            }
            return bytes;
        }
    }
}
