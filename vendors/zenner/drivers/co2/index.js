function calcCRC(bytes) {
    const polynomial=0x8005
    const initialVal=0xFFFF
    const finalXorVal=0
    const castMask=0xFFFF
    const msbMask=0x01 << 15

    let crcTable = new Array(256)
    for (var divident = 0; divident < 256; divident++) {
        var currByte = (divident << 8) & castMask
        for (var bit = 0; bit < 8; bit++) {
            if ((currByte & msbMask) != 0) {
                currByte <<= 1
                currByte ^= polynomial
            }
            else {
                currByte <<= 1
            }
        }
        crcTable[divident] = (currByte & castMask)
    }
    let crc = initialVal
    for (var i = 0; i < bytes.length; i++) {
        var curByte = bytes[i] & 0xFF
        /* update the MSB of crc value with next input byte */
        crc = (crc ^ (curByte << 8)) & castMask
        /* this MSB byte value is the index into the lookup table */
        var pos = (crc >> 8) & 0xFF
        /* shift out this index */
        crc = (crc << 8) & castMask
        /* XOR-in remainder from lookup table using the calculated index */
        crc = (crc ^ crcTable[pos]) & castMask
    }
    return ((crc ^ finalXorVal) & castMask)
}
function decodeDT(bytes) {
    //EN13757-3:2013, Annex A, data type F
    //Date and Time
    //Min: UI6 [1 to 6] (starting point 1, not 0)
    let min=bytes[0]&0x3F
    min=("0"+min.toString()).slice(-2)
    //Hour: UI5 [9 to 13]
    let hour=bytes[1]&0x1F
    hour=("0"+hour.toString()).slice(-2)
    //Day: UI5 [17 to 21]
    let day=bytes[2]&0x1F
    day=("0"+day.toString()).slice(-2)
    //Month: UI4 [25 to 28]
    let month=bytes[3]&0x0F
    month=("0"+month.toString()).slice(-2)
    //Year: UI7 [22 to 24; 29 to 32]
    let year=((bytes[2]&0x70)>>5) + ((bytes[3]&0x78)>>1)
    let hundredYear=((bytes[1]&0x60)>>5)
    year=2000+year
    //IV B1[8]
    let iv=(bytes[0]&0x80)>>7
    iv=(iv==0)?'valid':'invalid'
    //SU B1[16]
    let su=(bytes[1]&0x80)>>7
    su=(su==0)?'standard time':'summer time'
    let sec="00"
    let ret=`${year}-${month}-${day} ${hour}:${min}:${sec}`
    return ret
}
/* no used for that device
function decodeD(bytes) {
   if (bytes.length !== 2)
        throw new Error("Invalid D payload: length must be 2 bytes");
   //EN13757-3:2013, Annex A, data type G
   //Date
   //Day: UI5 [1 to 5]
   let day=bytes[0]&0x1F
   day=("0"+day.toString()).slice(-2)
   //Month: UI4 [9 to 12]
   let month=bytes[1]&0x0F
   month=("0"+month.toString()).slice(-2)
   //Year: UI7 [6 to 8; 13 to 16]
   let year=((bytes[0]&0x70)>>5) + ((bytes[1]&0x78)>>1)
   year=2000+year
   let ret=`${year}-${month}-${day}`
   return ret
}
*/
function decodeFW(bytes) {
    let identity=(bytes[0]<<4)+(bytes[1]&0x0F)
    return {
        majorVersion: bytes[3],
        minorVersion: bytes[2],
        revision    : (bytes[1]&0xF0)>>4,
        identityCode: identity,
        identity    : (identity==0x400?"CO2 sensor":"unknown")
    }
}

function decodeLoRaWanVersion(bytes) {
    return {
        major   : bytes[2],
        minor   : bytes[1],
        revision: bytes[0],
    }
}
function extractU16(bytes1,bytes2) {
    return bytes1 + (bytes2 << 8)
}
function extractU24(bytes1,bytes2,bytes3) {
    return bytes1 + (bytes2 << 8) + (bytes3 << 16)
}
function extractU32(bytes1,bytes2,bytes3,bytes4) {
    return bytes1 + (bytes2 << 8) + (bytes3 << 16) + (bytes4 << 24)
}

/**
 * Decode uplink
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.bytes - Array of numbers as it will be sent to the device
 * @param {number} [input.fPort] - The fPort on which the downlink must be sent
 * @returns {Object} The decoded object
 */
function decodeUplink(input) {
    var result={}
    var bytes = input.bytes
    switch (bytes[0]) {
        //--------------------------------------------------------
        //4.1.6 NACK / Unknown set commands
        //--------------------------------------------------------
        //FF 36 02 03 NACK on setAlarmThreshold: parameter error
        //FF 36 02 00 unknown EFC function of a knwon FC
        //FF 36 00    unknown function FC command
        case 0xFF:
            if (bytes.length > 4)
                throw new Error("Invalid uplink payload: index out of bound when reading NACK: length must be <= 4 bytes")
            if ((bytes[1] == 0x36) && (bytes[2] == 0x02)) {
                if (bytes[3] == 0x03)
                    result={ response: "setAlarmThresholdNack", error: "parameter error" }
                else if (bytes[3] == 0x00)
                    result={ response: "unknownCommand", error: "unknown EFC function of a knwon FC" }
                else
                    throw new Error("Invalid uplink payload: NACK not recognised ("+bytes[3]+")")
            } else if ((bytes[1] == 0x36) && (bytes[2] == 0x00)) {
                result={ response: "unknownCommand", error: "unknown function FC command"}
            } else {
                throw new Error("Invalid uplink payload: NACK not recognised ("+bytes[1]+","+bytes[2]+")")
            }
            break
        //--------------------------------------------------------
        // 4.1.1 4.1.3 4.1.5 ACK Answers on set commands
        //--------------------------------------------------------
        //FE 36 02 ACK on setAlarmThreshold command
        //FE 87    ACK on setSystemTime command
        //FE 8E    ACK on timeShift command
        case 0xFE:
            if (bytes.length > 3)
                throw new Error("Invalid uplink payload: index out of bound when reading ACK: length must be <= 3 bytes")
            switch (bytes[1]) {
                case 0x36:
                    switch (bytes[2]) {
                        case 0x02:
                            result={ response: "setAlarmThresholdAck" }
                            break
                        default:
                            throw new Error("Invalid uplink payload: reading ACK (unknown command ("+bytes[2]+")")
                    }
                    break;
                case 0x87:
                    result={ response: "setSystemTimeAck" }
                    break
                case 0x8E:
                    result={ response: "timeShiftAck" }
                    break
                default:
                    throw new Error("Invalid uplink payload: reading ACK (unknown command ("+bytes[1]+")")
            }
            break
        //--------------------------------------------------------
        //4.1.2 Answer on getAlarmThreshold
        //--------------------------------------------------------
        case 0x36:
            if (bytes.length != 14)
                throw new Error("Invalid uplink payload: index out of bound when reading getAlarmThreshold answer: length must be 14 bytes")
            result={ response: "getAlarmThreshold", lower: extractU16(bytes[4],bytes[5]), upper: extractU16(bytes[6],bytes[7]) }
            break
        //--------------------------------------------------------
        //4.1.3 Answer on getSystemTime
        //--------------------------------------------------------
        case 0x87:
            if (bytes.length != 8)
                throw new Error("Invalid uplink payload: index out of bound when reading getSystemTime answer: length must be 8 bytes")
            let year=2000+bytes[1]
            let month=bytes[2]
            month=("0"+month.toString()).slice(-2)
            let day=bytes[3]
            day=("0"+day.toString()).slice(-2)
            let hour=bytes[4]
            hour=("0"+hour.toString()).slice(-2)
            let min=bytes[5]
            min=("0"+min.toString()).slice(-2)
            let sec=bytes[6]
            sec=("0"+sec.toString()).slice(-2)
            let tz=bytes[7]
            let fullHourTz=Math.trunc(tz/4)
            let keeptQuarter=tz-(fullHourTz * 4)
            let fullMinTz=Math.abs(keeptQuarter)*15
            fullHourTz=("0"+fullHourTz.toString()).slice(-2)
            fullHourTz=Math.trunc(tz/4)
            keeptQuarter=tz-(fullHourTz * 4)
            fullMinTz=keeptQuarter*15
            fullMinTz=("0"+fullMinTz.toString()).slice(-2)
            let utc
            if (fullMinTz == "00")
                utc=fullHourTz
            else
                utc=fullHourTz+":"+fullMinTz
            let time=`${year}-${month}-${day} ${hour}:${min}:${sec} UTC ${utc}`
            result={ response: "getSystemTime", time: time }
            break
        //--------------------------------------------------------
        //3.3.1 SP 9.1 TimeStamp message
        //--------------------------------------------------------
        case 0x91:
            if (bytes.length != 11)
                throw new Error("Invalid uplink payload: index out of bound when reading SP9 subtype 0x01 payload: length must be 11 bytes")
            result={ timestamp: decodeDT(bytes.slice(1,5)) }
            break
        //--------------------------------------------------------
        //3.3.1 SP 9.2 Versions message
        //--------------------------------------------------------
        case 0x92:
            if (bytes.length != 17)
                throw new Error("Invalid uplink payload: index out of bound when reading SP9 subtype 0x02 payload: length must be 17 bytes")
            result={ info: { fw: decodeFW(bytes.slice(1,5)), lw: decodeLoRaWanVersion(bytes.slice(5,8)), loraCommandVersion: extractU16(bytes[8],bytes[9]), minolDeviceType: bytes[10] }}
            break
        //--------------------------------------------------------
        //3.3.1 SP 13 Data message
        //--------------------------------------------------------
        case 0xD1:
            if (bytes.length != 17)
                throw new Error("Invalid uplink payload: index out of bound when reading SP13 subtype 0x01 payload: length must be 17 bytes")
            let channel=bytes[1]
            let orderingType=bytes[2]
            let firstQuarter=extractU16(bytes[3],bytes[4])
            let secondQuarter=extractU16(bytes[7],bytes[8])
            let thirdQuarter=extractU16(bytes[11],bytes[12])
            let currentValue=extractU16(bytes[15],bytes[16])
            result={ data: {
                    firstQuarter: (firstQuarter==0xFFFF)?"unknown":firstQuarter,
                    secondQuarter:(secondQuarter==0xFFFF)?"unknown":secondQuarter,
                    thirdQuarter: (thirdQuarter==0xFFFF)?"unknown":thirdQuarter,
                    currentValue: (currentValue==0xFFFF)?"unknown":currentValue
                }}
            break
        //--------------------------------------------------------
        //3.3.3,3.3.4,3.3.5,3.3.6 AP1 Event message
        //--------------------------------------------------------
        case 0xA0:
            if (bytes.length != 5)
                throw new Error("Invalid uplink payload: index out of bound when reading AP1 payload: length must be 5 bytes")
            let statusCode=bytes[1]
            let statusMessage=""
            let statusData=extractU24(bytes[2],bytes[3],bytes[4])
            switch (statusCode) {
                case 0x05:
                    statusMessage="Battery critical low"
                    break
                case 0x20:
                    statusMessage="Upper threshold reached"
                    break
                case 0x21:
                    statusMessage="Lower threshold reached"
                    break
                case 0x22:
                    statusMessage="Hardware failure detected"
                    break
                default:
                    throw new Error(`Error in uplink payload: AP1 payload code (${statusCode}) not recognised`)
            }
            result={ event: { code:statusCode, message:statusMessage, data:statusData }}
            break
        //--------------------------------------------------------
        //OTHERS
        //--------------------------------------------------------
        default:
            throw new Error("Invalid uplink payload: unknown id '" + bytes[0] + "'")


    }
    return result
}

/**
 * Downlink encode
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {Object} input.message - The higher-level object representing your downlink
 * @returns {EncodedDownlink} The encoded object
 */
function encodeDownlink(input) {
    var result = {};
    var bytes = [];
    if (typeof input.setAlarmThreshold !== "undefined") {
        //--------------------------------------------------------
        //4.1.1 SetAlarmThreshold Command
        //--------------------------------------------------------
        //FC
        bytes.push(0x36)
        //EFC
        bytes.push(0x02)
        //Device identity
        bytes.push(0x040 & 0xFF)
        bytes.push((0x040 & 0xFF00)>>8)
        //lower alarm threshold
        if (typeof input.setAlarmThreshold.lower !== "undefined") {
            if (input.setAlarmThreshold.lower > 0xFFFF)
                throw new Error("Invalid downlink: setAlarmThreshold.lower cannot exceed 65535")
            if (input.setAlarmThreshold.lower < 0)
                throw new Error("Invalid downlink: setAlarmThreshold.lower cannot be < 0")
            bytes.push(input.setAlarmThreshold.lower&0xFF)
            bytes.push((input.setAlarmThreshold.lower&0xFF00)>>8)
        }
        else {
            bytes.push(0xFF)
            bytes.push(0xFF)
        }
        //upper alarm threshold
        if (typeof input.setAlarmThreshold.upper !== "undefined") {
            if (input.setAlarmThreshold.upper > 65535)
                throw new Error("Invalid downlink: setAlarmThreshold.upper cannot exceed 65535")
            if (input.setAlarmThreshold.upper < 0)
                throw new Error("Invalid downlink: setAlarmThreshold.upper cannot be < 0")
            bytes.push(input.setAlarmThreshold.upper&0xFF)
            bytes.push((input.setAlarmThreshold.upper&0xFF00)>>8)
        }
        else {
            bytes.push(0xFF)
            bytes.push(0xFF)
        }
        //reserved
        for (let i=0; i< 6; i++) bytes.push(0xFF)
    } else if (typeof input.getAlarmThreshold !== "undefined") {
        //--------------------------------------------------------
        //4.1.2 GetAlarmThreshold Command
        //--------------------------------------------------------
        bytes.push(0x36)
        bytes.push(0x02)
    } else if (typeof input.setSystemTime != "undefined") {
        //--------------------------------------------------------
        //4.1.3 SetSystemTime Command
        //--------------------------------------------------------
        bytes.push(0x87)
        if (typeof input.setSystemTime.year === "undefined")
            throw new Error("Invalid downlink: setSystemTime.year must be defined")
        if ((input.setSystemTime.year < 2021) || (input.setSystemTime.year > 2153))
            throw new Error("Invalid downlink: 2021 <= setSystemTime.year <= 2153")
        if (typeof input.setSystemTime.month === "undefined")
            throw new Error("Invalid downlink: setSystemTime.month must be defined")
        if ((input.setSystemTime.month <0x01) || (input.setSystemTime.month > 0x0C))
            throw new Error("Invalid downlink: 1 <= setSystemTime.month <= 12")
        if (typeof input.setSystemTime.day === "undefined")
            throw new Error("Invalid downlink: setSystemTime.day must be defined")
        if ((input.setSystemTime.day <0x01) || (input.setSystemTime.day > 0x1F))
            throw new Error("Invalid downlink: 1 <= setSystemTime.day <= 31")
        if (typeof input.setSystemTime.hour === "undefined")
            throw new Error("Invalid downlink: setSystemTime.hour must be defined")
        if ((input.setSystemTime.hour <0x01) || (input.setSystemTime.hour > 0x17))
            throw new Error("Invalid downlink: 1 <= setSystemTime.hour <= 23")
        if (typeof input.setSystemTime.min === "undefined")
            throw new Error("Invalid downlink: setSystemTime.min must be defined")
        if ((input.setSystemTime.min <0x00) || (input.setSystemTime.min > 0x3B))
            throw new Error("Invalid downlink: 1 <= setSystemTime.min <= 59")
        if (typeof input.setSystemTime.sec === "undefined")
            throw new Error("Invalid downlink: setSystemTime.sec must be defined")
        if ((input.setSystemTime.sec <0x00) || (input.setSystemTime.sec > 0x3B))
            throw new Error("Invalid downlink: 1 <= setSystemTime.sec <= 59")
        if (typeof input.setSystemTime.tz === "undefined")
            throw new Error("Invalid downlink: setSystemTime.tz must be defined")
        if ((input.setSystemTime.tz <0x00) || (input.setSystemTime.tz > 0x60))
            throw new Error("Invalid downlink: 0 <= setSystemTime.tz <= 96")
        bytes.push(input.setSystemTime.year-2000)
        bytes.push(input.setSystemTime.month)
        bytes.push(input.setSystemTime.day)
        bytes.push(input.setSystemTime.hour)
        bytes.push(input.setSystemTime.min)
        bytes.push(input.setSystemTime.sec)
        bytes.push(input.setSystemTime.tz)
    } else if (typeof input.getSystemTime  != "undefined") {
        //--------------------------------------------------------
        //4.1.4 GetSystemTime Command
        //--------------------------------------------------------
        bytes.push(0x87)
    } else if (typeof input.timeShift != "undefined") {
        //--------------------------------------------------------
        //4.1.5 TimeShift Command
        //--------------------------------------------------------
        bytes.push(0x8E)
        let timeShift=Math.abs(input.timeShift)
        let directionBit=0x00
        if (timeShift > 36000)
            throw new Error("Error in downlink command payload: abs(timeShift) in time cannot be upper 36000 ("+input.timeShift+" given)")
        //direction bit
        if (input.timeShift < 0)
            directionBit=0x80
        bytes.push(timeShift&0xFF)
        bytes.push(((timeShift&0x7F00)>>8)+directionBit)
    } else {
        throw new Error("Invalid downlink command payload message not recognised")
    }
    let crcMODBUS=calcCRC(bytes)
    bytes.push(crcMODBUS & 0xFF)
    bytes.push((crcMODBUS & 0xFF00)>>8)
    result.bytes = bytes
    result.fPort = 1
    return result
}

/**
 * Downlink decode
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.bytes - Array of numbers as it will be sent to the device
 * @param {number} [input.fPort] - The fPort on which the downlink must be sent
 * @returns {Object} The decoded object
 */
function decodeDownlink(input) {
    var result = {}
    var bytes = input.bytes
    switch (bytes[0]) {
        //--------------------------------------------------------
        //setAlarmThreshold / getAlarmThreshold
        //--------------------------------------------------------
        case 0x36:
            if (bytes.length == 4) {
                result={ getAlarmThreshold: 1 }
            } else if (bytes.length == 16) {
                result={ setAlarmThreshold: { } }
                const lower=bytes[4]+(bytes[5]<<8)
                if (lower!=0xFFFF)
                    result.setAlarmThreshold.lower=lower
                const upper=bytes[6]+(bytes[7]<<8)
                if (upper!=0xFFFF)
                    result.setAlarmThreshold.upper=upper
            }
            else
                throw new Error("Invalid downlink payload: index out of bound when reading Get/Set AlarmThreshold payload: length must be 4 (Get) or 16 (Set) bytes")
            break
        //--------------------------------------------------------
        //SetSystemTime / GetSystemTime
        //--------------------------------------------------------
        case 0x87:
            if (bytes.length == 3) {
                result={ getSystemTime: 1 }
            } else if (bytes.length == 10) {
                result={ setSystemTime: { year: bytes[1]+2000, month:bytes[2], day:bytes[3], hour:bytes[4], min:bytes[5], sec:bytes[6], tz:bytes[7]} }
            }
            else
                throw new Error("Invalid downlink payload: index out of bound when reading Get/Set SystemTime payload: length must be 3 (Get) or 10 (Set) bytes")
            break
        //--------------------------------------------------------
        //timeShift
        //--------------------------------------------------------
        case 0x8E:
            if (bytes.length != 5)
                throw new Error("Invalid downlink payload: index out of bound when reading TimeShift payload: length must be 5 bytes")
            let direction=(bytes[2]&0x80)>>7
            let timeShift=bytes[1]+((bytes[2]&0x7F)<<8)
            if (direction == 1) timeShift=-timeShift
            result={ "timeShift": timeShift }
            break
        //--------------------------------------------------------
        //OTHERS
        //--------------------------------------------------------
        default:
            throw new Error("Invalid downlink payload: unknown id '" + bytes[0] + "'")
    }
    return result
}

exports.decodeUplink = decodeUplink
exports.encodeDownlink = encodeDownlink
exports.decodeDownlink = decodeDownlink
