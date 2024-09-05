//  convert a string hex to decimal by defining also the starting and ending positions
function hexToDec(payloadHex, beginPos, endPos) {
  if (payloadHex == null || payloadHex.length === 0) return 0;
  return parseInt(payloadHex.substring(beginPos, endPos), 16);
}

//  if the input is an array of bytes, this method convert it to string hex
function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

//  if the value represent negative number, we need to calculate complement
function complement2Byte2(hexToDec) {
  if (hexToDec < 0x8000) return hexToDec;
  else return -((hexToDec - 1) ^ 0xffff);
}

//  mapping between the sensor's ID and name
function getSensorName(sensorID) {
  switch (sensorID) {
    case 0x01: //0x01——R711
      return "R711";
    case 0x0b: //0x0B——R718A
      return "R718A";
    case 0x02: //0x02——R311A
      return "R311A";
    case 0x03: //0x03——RB11E
      return "RB11E";
    case 0x04: //0x04——R311G
      return "R311G";
    case 0x05: //0x05——RA07
      return "RA07";
    case 0x06: //0x06——R311W
      return "R311W";
    case 0x07: //0x07——RB11E1
      return "RB11E1";
    case 0x08: //0x08——R801A
      return "R801A";
    case 0x09: //0x09——R726
      return "R726";
    case 0x0a: //0x0A——RA02A
      return "RA02A";
    case 0x0c: //0x0C——RA07W
      return "RA07W";
    case 0x0d: //0x0D——R727
      return "R727";
    case 0x0e: //0x0E——R809A
      return "R809A";
    case 0x0f: //0x0F——R211
      return "R211";
    case 0x10: //0x10——RB02I
      return "RB02I";
    case 0x11: //0x11——RA02C
      return "RA02C";
    case 0x12: //0x12——R718WB
      return "R718WB";
    case 0x13: //0x13——R718AB
      return "R718AB";
    case 0x14: //0x14——R718B
      return "R718B";
    case 0x15: //0x15——R718CJ
      return "R718CJ";
    case 0x16: //0x16——R718CK
      return "R718CK";
    case 0x17: //0x17——R718CT
      return "R718CT";
    case 0x18: //0x18——R718CR
      return "R718CR";
    case 0x19: //0x19——R718CE
      return "R718CE";
    case 0x1a: //0x1A——R718DA
      return "R718DA";
    case 0x1b: //0x1B——R718DB
      return "R718DB";
    case 0x1c: //0x1C——R718E
      return "R718E";
    case 0x1d: //0x1D——R718F
      return "R718F";
    case 0x1e: //0x1E——R718G
      return "R718G";
    case 0x1f: //0x1F——R718H
      return "R718H";
    case 0x20: //0x20——R718I
      return "R718I";
    case 0x21: //0x21——R718J
      return "R718J";
    case 0x22: //0x22——R718KA
      return "R718KA";
    case 0x23: //0x23——R718KB
      return "R718KB";
    case 0x24: //0x24——R718LA
      return "R718LA";
    case 0x25: //0x25——R718LB
      return "R718LB";
    case 0x26: //0x26——R718MA
      return "R718MA";
    case 0x27: //0x27——R718MB
      return "R718MB";
    case 0x28: //0x28——R718MC
      return "R718MC";
    case 0x29: //0x29——R718N
      return "R718N";
    case 0x30: //0x30——R718S
      return "R718S";
    case 0x31: //0x31——R718T
      return "R718T";
    case 0x32: //0x32——R718WA
      return "R718WA";
    case 0x33: //0x33——R718WD
      return "R718WD";
    case 0x34: //0x34——R718X
      return "R718X";
    case 0xff: //0xFF——ALL
      return "ALL";
    default:
      return "????";
  }
}

//  some devices shows the contact state as string, this method to match the flag with the strings
function getState(state) {
  if (state === 0) return "Off";
  else return "On";
}

//  some devices shows the occupacity state as string, this method to match the flag with the strings
function getOccupacity(occupacity) {
  if (occupacity === 0) return "UnOccupy";
  else return "Occupy";
}

//  some devices shows the leakage state as string, this method to match the flag with the strings
function getLeakage(leakage) {
  if (leakage === 0) return "noleak";
  else return "leak";
}

//  some devices shows the fire alarm state as string, this method to match the flag with the strings
function getAlarm(alarm) {
  if (alarm === 0) return "noalarm";
  else return "alarm";
}

//  some devices shows the leakage state as string, this method to match the flag with the strings
function getLeakLocation(leakageLocation) {
  if (leakageLocation === 0x0000) return "Normal";
  else if (leakageLocation === 0xffff) return "SensorNotConnected";
  else return "LeakLocation";
}

// Battery Level
function getBatteryLevel(batteryVoltage){
  let batteryLevel = Number((batteryVoltage * 100 / 3.6).toFixed(2));
  if(batteryLevel > 100){
    return 100;
  } else if(batteryLevel < 0){
    return 0
  } else {
    return batteryLevel;
  }
}

//  the function used by the driver to decode the uplink and retrieve an object from the payload
function decodeUplink(input) {
  var result = {};

  let payloadHex;
  if (typeof input.bytes !== "string") {
    payloadHex = bytesToHex(input.bytes);
  } else {
    payloadHex = input.bytes;
  }

  var nbBytes = payloadHex.length / 2;

  if (nbBytes < 2 || nbBytes > 11) {
    result.decoderAvailable = false;
    return result;
  }

  result.decoderAvailable = true;
  result.protocolVersion = hexToDec(payloadHex, 0, 2);
  result.sensorID = hexToDec(payloadHex, 2, 4);
  result.sensorName = getSensorName(result.sensorID);
  result.reportType = hexToDec(payloadHex, 4, 6);

  if (result.reportType === 0x00) {
    // Report type 0 : software version for all devices
    result.softwareVersion = hexToDec(payloadHex, 6, 8) * 0.1;
    result.hardwareVersion = hexToDec(payloadHex, 8, 10) * 0.1;
    result.dateCode = payloadHex.substring(10, 18);
    return result;
  }

  switch (result.sensorID) {
    case 0x01: //0x01——R711
    case 0x0b: //0x0B——R718A
    case 0x13: //0x13——R718AB
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.temperature = complement2Byte2(hexToDec(payloadHex, 8, 12)) * 0.01;
      result.humidity = hexToDec(payloadHex, 12, 16) * 0.01;
      break;
    case 0x02: //0x02——R311A
    case 0x1d: //0x1D——R718F
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.contactState = hexToDec(payloadHex, 8, 10);
      result.contactStateString = getState(result.contactState);
      break;
    case 0x03: //0x03——RB11E
    case 0x07: //0x07——RB11E1
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.temperature = complement2Byte2(hexToDec(payloadHex, 8, 12)) * 0.01;
      result.illuminance = hexToDec(payloadHex, 12, 16);
      result.occupacity = hexToDec(payloadHex, 16, 18);
      result.occupacityString = getOccupacity(result.occupacity);
      break;
    case 0x04: //0x04——R311G
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.illuminance = hexToDec(payloadHex, 8, 12);
      break;
    case 0x05: //0x05——RA07
    case 0x09: //0x09——R726
    case 0x0d: //0x0D——R727 Series
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      // there is different values for the same devices, it differs according to the report type
      switch (result.reportType) {
        case 0x01:
        case 0x02:
          result.pm1 = hexToDec(payloadHex, 8, 12);
          result.pm25 = hexToDec(payloadHex, 12, 16);
          result.pm10 = hexToDec(payloadHex, 16, 20);
          break;
        case 0x03:
          result.pm03p = hexToDec(payloadHex, 8, 12);
          result.pm05p = hexToDec(payloadHex, 12, 16);
          result.pm010p = hexToDec(payloadHex, 16, 20);
          break;
        case 0x04:
          result.pm25p = hexToDec(payloadHex, 8, 12);
          result.pm5p = hexToDec(payloadHex, 12, 16);
          result.pm10p = hexToDec(payloadHex, 16, 20);
          break;
        case 0x05:
          result.O3 = hexToDec(payloadHex, 8, 12) * 0.1;
          result.CO = hexToDec(payloadHex, 12, 16) * 0.1;
          result.NO = hexToDec(payloadHex, 16, 20) * 0.1;
          break;
        case 0x06:
          result.NO2 = hexToDec(payloadHex, 8, 12) * 0.1;
          result.SO2 = hexToDec(payloadHex, 12, 16) * 0.1;
          result.H2S = hexToDec(payloadHex, 16, 20) * 0.1;
          break;
        case 0x07:
          result.CO2 = hexToDec(payloadHex, 8, 12) * 0.1;
          result.NH3 = hexToDec(payloadHex, 12, 16) * 0.1;
          result.noise = hexToDec(payloadHex, 16, 20) * 0.1;
          break;
        case 0x08:
          result.PH = hexToDec(payloadHex, 8, 12) * 0.01;
          result.temperatureWithPH = hexToDec(payloadHex, 12, 16) * 0.01;
          result.orp = complement2Byte2(hexToDec(payloadHex, 16, 20));
          break;
        case 0x09:
          result.NTU = hexToDec(payloadHex, 8, 12) * 0.01;
          result.temperatureWithNTU = hexToDec(payloadHex, 12, 16) * 0.01;
          result.EC5SoildHumidity = hexToDec(payloadHex, 16, 20) * 0.01;
          break;
        case 0x0a:
          result.TE5SoildHumidity = hexToDec(payloadHex, 8, 12) * 0.01;
          result.TE5SoildTemp = hexToDec(payloadHex, 12, 16) * 0.01;
          result.waterLevel = hexToDec(payloadHex, 16, 20);
          break;
        case 0x0b:
          result.temperatureWithLDO = hexToDec(payloadHex, 8, 12) * 0.01;
          result.ldoDo = hexToDec(payloadHex, 12, 16) * 0.01;
          result.ldoSat = hexToDec(payloadHex, 16, 20) * 0.1;
          break;
        case 0x0c:
          result.temperature =
              complement2Byte2(hexToDec(payloadHex, 8, 12)) * 0.01;
          result.humidity = hexToDec(payloadHex, 12, 16) * 0.01;
          result.windSpeed = hexToDec(payloadHex, 16, 20) * 0.1;
          break;
        case 0x0d:
          result.windDirection = hexToDec(payloadHex, 8, 12) * 0.01;
          result.atmosphere = hexToDec(payloadHex, 12, 20) * 0.01;
          break;
        default:
          break;
      }
      break;
    case 0x06: //0x06——R311W
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.waterLeak1 = hexToDec(payloadHex, 8, 10);
      result.waterLeak1String = getLeakage(result.waterLeak1);
      result.waterLeak2 = hexToDec(payloadHex, 10, 12);
      result.waterLeak2String = getLeakage(result.waterLeak2);
      break;
    case 0x08: //0x08——R801A
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.temperature = complement2Byte2(hexToDec(payloadHex, 8, 12)) * 0.01;
      result.temperature2 =
          complement2Byte2(hexToDec(payloadHex, 12, 16)) * 0.01;
      break;
    case 0x0a: //0x0A——RA02A
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.fireAlarm = hexToDec(payloadHex, 8, 10);
      result.fireAlarmString = getAlarm(result.fireAlarm);
      result.highTempAlarm = hexToDec(payloadHex, 10, 12);
      result.highTempAlarmString = getAlarm(result.highTempAlarm);

      break;
    case 0x0c: //0x0C——RA07W
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.waterLeakLocation = hexToDec(payloadHex, 8, 12) * 10;
      result.waterLeakStatus = getLeakLocation(hexToDec(payloadHex, 8, 12));
      break;
    case 0x0e: //0x0E——R809A
      if (result.reportType === 0x01) {
        result.contactState = hexToDec(payloadHex, 6, 8);
        result.contactStateString = getState(result.contactState);
        result.energy = hexToDec(payloadHex, 8, 16);
      } else if (result.reportType === 0x02) {
        result.batteryVoltage = hexToDec(payloadHex, 6, 8);
        result.current = hexToDec(payloadHex, 8, 12);
        result.power = hexToDec(payloadHex, 12, 16);
      }
      break;
    case 0x10: //0x10——RB02I
    case 0x31: //0x31——R718T
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.alarm = hexToDec(payloadHex, 8, 10);
      result.alarmString = getAlarm(result.alarm);
      break;
    case 0x11: //0x11——RA02C
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.coAlarm = hexToDec(payloadHex, 8, 10);
      result.coAlarmString = getAlarm(result.coAlarm);
      result.highTempAlarm = hexToDec(payloadHex, 10, 12);
      result.highTempAlarmString = getAlarm(result.highTempAlarm);
      break;
    case 0x12: //0x12——R718WB
    case 0x32: //0x32——R718WA
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.waterLeak1 = hexToDec(payloadHex, 8, 10);
      result.waterLeak1String = getLeakage(result.waterLeak1);
      break;
    case 0x33: //0x33——R718WD
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.tankRawData = hexToDec(payloadHex, 8, 12);
      result.tankLevel = hexToDec(payloadHex, 12, 14);
      break;
    case 0x14: //0x14——R718B
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.temperature = complement2Byte2(hexToDec(payloadHex, 8, 12)) * 0.01;
      break;
    case 0x15: //0x15——R718CJ
    case 0x16: //0x16——R718CK
    case 0x17: //0x17——R718CT
    case 0x18: //0x18——R718CR
    case 0x19: //0x19——R718CE
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.temperature = complement2Byte2(hexToDec(payloadHex, 8, 12)) * 0.01;
      result.temperature2 =
          complement2Byte2(hexToDec(payloadHex, 12, 16)) * 0.01;
      break;
    case 0x1a: //0x1A——R718DA
    case 0x1b: //0x1B——R718DB
    case 0x21: //0x21——R718J
    case 0x25: //0x25——R718LB
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.contactState = hexToDec(payloadHex, 8, 10);
      result.contactStateString = getState(result.contactState);
      break;
    case 0x1e: //0x1E——R718G
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.illuminance = hexToDec(payloadHex, 8, 16);
      break;
    case 0x1c: //0x1C——R718E
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.dataX = complement2Byte2(hexToDec(payloadHex, 8, 12));
      result.dataY = complement2Byte2(hexToDec(payloadHex, 12, 16));
      result.dataZ = complement2Byte2(hexToDec(payloadHex, 16, 20));
      break;
    case 0x20: //0x20——R718IA
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.adcRawValue = hexToDec(payloadHex, 8, 12);
      break;
    case 0x22: //0x22——R718KA
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.current = hexToDec(payloadHex, 8, 10);
      break;
    case 0x23: //0x23——R718KB
      result.batteryVoltage = hexToDec(payloadHex, 6, 8) * 0.1;
      result.resistive = hexToDec(payloadHex, 8, 16);
      break;
    default:
      result.decoderAvailable = false;
      break;
  }

  return result;
}

exports.decodeUplink = decodeUplink;
