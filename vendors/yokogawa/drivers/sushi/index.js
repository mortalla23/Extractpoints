// #####################################################################################################
// #####################################################################################################
// ## _____                     _            __     ______  _  ______   _____     __          __      ##
// ##|  __ \                   | |           \ \   / / __ \| |/ / __ \ / ____|   /\ \        / /\     ##
// ##| |  | | ___  ___ ___   __| | ___ _ __   \ \_/ / |  | | ' / |  | | |  __   /  \ \  /\  / /  \    ##
// ##| |  | |/ _ \/ __/ _ \ / _` |/ _ \ '__|   \   /| |  | |  <| |  | | | |_ | / /\ \ \/  \/ / /\ \   ##
// ##| |__| |  __/ (_| (_) | (_| |  __/ |       | | | |__| | . \ |__| | |__| |/ ____ \  /\  / ____ \  ##
// ##|_____/ \___|\___\___/ \__,_|\___|_|       |_|  \____/|_|\_\____/ \_____/_/    \_\/  \/_/    \_\ ##
// #####################################################################################################
// #####################################################################################################

/* ***********************************************************************************************

YOKOGAWA        SushiToMQTT

Description:
This javascript converts a Yokogawa Sushi sensor message to induvidual messages that can be
send with MQTT.
Before publishing messages to MQTT it requires a "Initialization information (INI)"-message to get
the sensor name. This name will be use in the topic of published MQTT messages.
The MQTT messages will exist of "SushiSensor/<sensorname>/<topic>"
The topics are:
    Z-Acceleration
    Z-Velocity
    Temperature
    XYZ-Acceleration
    XYZ-Velocity
    X-Acceleration
    X-Velocity
    Y-Acceleration
    Y-Velocity
    Uptime
    BatteryLeft
    RSSI
    PER
    SNR
    Longitude
    Latitude

The payload is an ascii string that represents the value.

Example:
Topic: SushiSensor/VTI1725/Temperature          Payload: 21.3

Version
0.1     Dec-2018    Inital version
0.2     Jun-2019    Changed input payload from UTF-8 to Bytes
0.4     Nov-2020    Added extra sushi sensors


*********************************************************************************************** */

var MqttMsgs = [];
var SUSHI_SENSOR = "SUSHI_SENSOR";          // This is teh first part of the mqtt topic

var SUSHI_PR_SENSOR = "SUSHI_PR_SENSOR";
var SUSHI_T_SENSOR = "SUSHI_T_SENSOR";
var SUSHI_V_SENSOR = "SUSHI_V_SENSOR";

var ZACC_TOPIC = "Z_ACCELERATION";
var ZVEL_TOPIC = "Z_VELOCITY";
var TEMP_TOPIC = "TEMPERATURE";
var ZSTAT_TOPIC = "Z_STATUS";
var XYZACC_TOPIC = "XYZ_ACCELERATION";
var XYZVEL_TOPIC = "XYZ_VELOCITY";
var XYZSTAT_TOPIC = "XYZ_STATUS";
var XACC_TOPIC = "X_ACCELERATION";
var XVEL_TOPIC = "X_VELOCITY";
var XSTAT_TOPIC = "X_STATUS";
var YACC_TOPIC = "Y_ACCELERATION";
var YVEL_TOPIC = "Y_VELOCITY";
var YSTAT_TOPIC = "Y_STATUS";
var UPT_TOPIC = "UPTIME";
var BAT_TOPIC = "BATTERYLEFT";
var RSSI_TOPIC = "RSSI";
var PER_TOPIC = "PER";
var SNR_TOPIC = "SNR";
var LONG_TOPIC = "LONGITUDE";
var LAT_TOPIC = "LATITUDE";
var DIAG_TOPIC = "DIAG";
var DIAGDETAIL_TOPIC = "DIAG_DETAIL";


var ALT_TOPIC = "ALTITUDE";
var VENDORID_TOPIC = "VENDOR_ID";
var DEV_TYPE_TOPIC = "DEV_TYPE";
var DEV_REV_TOPIC = "DEV_REV";
var PRESS_TOPIC = "PRESSURE";
var PRESS_STAT_TOPIC = "PRESSURE_STATUS";
var TEMP_STAT_TOPIC = "TEMP_STATUS";

var TEMP1_TOPIC = "TEMPERATURE1";
var TEMP2_TOPIC = "TEMPERATURE2";
var TEMP1STAT_TOPIC = "TEMP1_STATUS";
var TEMP2STAT_TOPIC = "TEMP2_STATUS";

var dataType, sensorName, sensorID;
var action = "";
var PVAcceleration, PVVelocity, PVTemperature;
var uptime, batteryLeft, RSSI, PER, SNR;
var diagStatus, diagStatusDetail;
var debug = false;
var number;

var PVPressure;

/* ***********************************************************************************************
CheckStatus (act, sensor, byte1, byte2)
act     - string that contains the current sushi sensor action, used for error message purposes
sensor  - string that contains the sensor name, used for error message purposes
byte1   - first byte of the status.
byte2   - second byte of the status.

Function that checks the status bytes.
The status bytes are part of the following sushi sensor messages:
    case 0x10: //Sushi Sensor vibration (Z-axis)
    case 0x11: //Sushi Sensor vibration (XYZ composite axes)
    case 0x12: //Sushi Sensor vibration (X-axis)
*********************************************************************************************** */

function CheckStatus(act, sensor, byte1, byte2) {
    if (byte1 === 0 && byte2 === 0) return true;
    if (byte2 & 0x80) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Accelaretion Error, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x40) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Velocity Error, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x20) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Temperature Error, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x10) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Accelaretion overrange, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x08) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Velocity overrange, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x04) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Temperature overrange, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x02) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Reserved, message: " + act + ", for sensor: " + sensor
    });
    if (byte2 & 0x01) MqttMsgs.push({
        topic: SUSHI_SENSOR + "/" + sensor + "/DataStatusFault",
        payload: "Simulation mode, message: " + act + ", for sensor: " + sensor
    });

    return true;
}

/* ***********************************************************************************************
GetFloat16(byte1, byte2)

Function that compiles a float value out of a 2 byte float16.
*********************************************************************************************** */

function GetFloat16(byte1, byte2) {
    if (byte1 < 0) {
        byte1 = (byte1 & 0xFF) | 0x80;
    } else {
        byte1 = byte1 & 0xFF;
    }
    if (byte2 < 0) {
        byte2 = (byte2 & 0xFF) | 0x80;
    } else {
        byte2 = byte2 & 0xFF;
    }
    // byte2 = byte2 & 0xFF;
    const fraction = ((byte1 & 0x03) * 256) + byte2;
    const exponent = (byte1 & 0x7C) >> 2;
    const sign = byte1 >> 7;
    let value;
    if (exponent !== 0) {
        value = Math.pow(2, exponent - 15) * (1 + fraction / 1024);
    } else value = Math.pow(2, -14) * fraction / 1024;

    if (sign) value = -value;

    //  if(debug) node.error ("GetFloat16: value=" + value + ", byte1=" + byte1 + ", byte2=" + byte2 + ", fraction=" + fraction + ", exponent=" + exponent + ", sign=" + sign);
    if (debug) node.error("GetFloat16: value=" + value + ", byte1=" + byte1 + ", byte2=" + byte2 + ", fraction=" + fraction + ", exponent=" + exponent + ", sign=" + sign);
    return value;
}


/* ***********************************************************************************************
GetFloat32(byte1, byte2, byte3, byte4)

Function that compiles a float value out of a 4 byte float32.
*********************************************************************************************** */

function GetFloat32(byte1, byte2, byte3, byte4) {
    const fraction = ((byte2 & 0x7F) * 256 * 256) + byte3 * 256 + byte4;
    const exponent = ((byte1 & 0x7F) << 1) + (byte2 >> 7);
    const sign = byte1 >> 7;
    let value;
    if (exponent !== 0) {
        value = Math.pow(2, exponent - 127) * (1 + fraction / 0x7FFFFF);
    } else value = Math.pow(2, -126) * fraction / 0x7FFFFF;

    if (sign) value = -value;

    if (debug) node.error("GetFloat32: value=" + value + ", byte1=" + byte1 + ", byte2=" + byte2 + ", fraction=" + fraction + ", exponent=" + exponent + ", sign=" + sign);
    return value;
}

/* ***********************************************************************************************
GetFloat64(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8)

Function that compiles a float value out of a 8 byte float64.
*********************************************************************************************** */
function GetFloat64(byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8) {
    const fraction = ((byte2 & 0x0F) * 256 * 256 * 256 * 256 * 256 * 256) + (byte3 * 256 * 256 * 256 * 256 * 256) +
        (byte4 * 256 * 256 * 256 * 256) + (byte5 * 256 * 256 * 256) +
        (byte6 * 256 * 256) + (byte7 * 256) + (byte8);
    const exponent = ((byte1 & 0x7F) << 4) + (byte2 >> 4);
    const sign = byte1 >> 7;
    let value;
    if (exponent !== 0) {
        value = Math.pow(2, exponent - 1023) * (1 + fraction / 0xFFFFFFFFFFFFF);
    } else value = Math.pow(2, -1022) * fraction / 0xFFFFFFFFFFFFF;

    if (sign) value = -value;

    if (debug) node.error("GetFloat64: value=" + value + ", byte1=" + byte1 + ", byte2=" + byte2 + ", fraction=" + fraction + ", exponent=" + exponent + ", sign=" + sign);
    return value;
}

//node.error("Message Received: " + msg.payload[0]] + " " + msg.payload[1] + " " + msg.payload[2] + " " + msg.payload[3] + " " +
//                                  msg.payload[4] + " " + msg.payload[5] + " " + msg.payload[6] + " " + msg.payload[7] + " " +
//                                 msg.payload[8] + " " + msg.payload[9] + " " + msg.payload[10] + " " + msg.payload[11]);

function decodeMessage(msg, global) {
    // TEST SENSOR ID MSG EUI
    sensorID = msg.eui;
    sensorName = global.get(sensorID);
    if (debug) node.error("Sushi Sensor - ID: " + sensorID + ", Name: " + sensorName);

    dataType = msg.payload[0];
    if (debug) node.error("Sushi Sensor - ID: " + sensorID + ", Name: " + sensorName + ", DataType: " + dataType);
    action = "";

    if (sensorName !== undefined || dataType === 0x42) {
        let PVStatus;
        switch (dataType) {
            case 0x10: //Sushi Sensor vibration (Z-axis)
                action = "Sushi Sensor vibration (Z-axis)";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    PVAcceleration = GetFloat16(msg.payload[3], msg.payload[4]);
                    PVVelocity = GetFloat16(msg.payload[5], msg.payload[6]);
                    PVTemperature = GetFloat16(msg.payload[7], msg.payload[8]);
                    PVStatus = (msg.payload[1] * 256 + msg.payload[2]);
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + ZACC_TOPIC, payload: PVAcceleration});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + ZVEL_TOPIC, payload: PVVelocity});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP_TOPIC, payload: PVTemperature});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + ZSTAT_TOPIC, payload: PVStatus});
                    if (debug) node.error("Sushi Sensor vibration (Z-axis): PVAcceleration=" + PVAcceleration + ", PVVelocity=" + PVVelocity + ", PVTemperature=" + PVTemperature);
                }
                break;

            case 0x11: //Sushi Sensor vibration (XYZ composite axes)
                action = "Sushi Sensor vibration (XYZ composite axes)";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    PVAcceleration = GetFloat16(msg.payload[3], msg.payload[4]);
                    PVVelocity = GetFloat16(msg.payload[5], msg.payload[6]);
                    PVTemperature = GetFloat16(msg.payload[7], msg.payload[8]);
                    PVStatus = (msg.payload[1] * 256 + msg.payload[2]);
                    MqttMsgs.push({
                        topic: SUSHI_SENSOR + "/" + sensorName + "/" + XYZACC_TOPIC,
                        payload: PVAcceleration
                    });
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + XYZVEL_TOPIC, payload: PVVelocity});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP_TOPIC, payload: PVTemperature});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + XYZSTAT_TOPIC, payload: PVStatus});
                    if (debug) node.error("Sushi Sensor vibration (XYZ composite axes): PVAcceleration=" + PVAcceleration + ", PVVelocity=" + PVVelocity + ", PVTemperature=" + PVTemperature);
                }
                break;

            case 0x12: //Sushi Sensor vibration (X-axis)
                action = "Sushi Sensor vibration (X-axis)";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    PVAcceleration = GetFloat16(msg.payload[3], msg.payload[4]);
                    PVVelocity = GetFloat16(msg.payload[5], msg.payload[6]);
                    PVStatus = (msg.payload[1] * 256 + msg.payload[2]);
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + XACC_TOPIC, payload: PVAcceleration});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + XVEL_TOPIC, payload: PVVelocity});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + XSTAT_TOPIC, payload: PVStatus});
                    if (debug) node.error("Sushi Sensor vibration (X-axis): PVAcceleration=" + PVAcceleration + ", PVVelocity=" + PVVelocity);
                }
                break;

            case 0x13: //Sushi Sensor vibration (Y-axis)
                action = "Sushi Sensor vibration (Y-axis)";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    PVAcceleration = GetFloat16(msg.payload[3], msg.payload[4]);
                    PVVelocity = GetFloat16(msg.payload[5], msg.payload[6]);
                    PVStatus = (msg.payload[1] * 256 + msg.payload[2]);
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + YACC_TOPIC, payload: PVAcceleration});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + YVEL_TOPIC, payload: PVVelocity});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + YSTAT_TOPIC, payload: PVStatus});
                    if (debug) node.error("Sushi Sensor vibration (Y-axis): PVAcceleration=" + PVAcceleration + ", PVVelocity=" + PVVelocity);
                }
                break;
            case 0x20: //Sushi Sensor Temperature1
                action = "Sushi Sensor Temperature";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    const PVTemp1Status = (msg.payload[1] * 256 + msg.payload[2]);
                    const PVTemperature1 = GetFloat32(msg.payload[3], msg.payload[4], msg.payload[5], msg.payload[6]);
                    MqttMsgs.push({
                        topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP1STAT_TOPIC,
                        payload: PVTemp1Status
                    });
                    MqttMsgs.push({
                        topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP1_TOPIC,
                        payload: PVTemperature1
                    });
                    if (debug) node.error("Sushi Sensor Temperature1: PVTemperature = " + PVTemperature1);
                }
                break;
            case 0x21: //Sushi Sensor Temperature2
                action = "Sushi Sensor Temperature";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    const PVTemp2Status = (msg.payload[1] * 256 + msg.payload[2]);
                    const PVTemperature2 = GetFloat32(msg.payload[3], msg.payload[4], msg.payload[5], msg.payload[6]);
                    MqttMsgs.push({
                        topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP2STAT_TOPIC,
                        payload: PVTemp2Status
                    });
                    MqttMsgs.push({
                        topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP2_TOPIC,
                        payload: PVTemperature2
                    });
                    if (debug) node.error("Sushi Sensor Temperature: PVTemperature = " + PVTemperature2);
                }
                break;
            case 0x30: //Sushi Sensor Pressure
                action = "Sushi Sensor Pressure";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    PVStatus = (msg.payload[1] * 256 + msg.payload[2]);
                    PVPressure = GetFloat32(msg.payload[3], msg.payload[4], msg.payload[5], msg.payload[6]);
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + PRESS_STAT_TOPIC, payload: PVStatus});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + PRESS_TOPIC, payload: PVPressure});
                    if (debug) node.error("Sushi Sensor Pressure: PVPressure = " + PVPressure);
                }
                break;

            case 0x31: //Sushi Sensor Temperature
                action = "Sushi Sensor Temperature";
                if (CheckStatus(action, sensorName, msg.payload[1], msg.payload[2])) {
                    PVStatus = (msg.payload[1] * 256 + msg.payload[2]);
                    PVTemperature = GetFloat32(msg.payload[3], msg.payload[4], msg.payload[5], msg.payload[6]);
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP_STAT_TOPIC, payload: PVStatus});
                    MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + TEMP_TOPIC, payload: PVTemperature});
                    if (debug) node.error("Sushi Sensor Temperature: PVTemperature = " + PVTemperature);
                }
                break;

            case 0x40: // Soundness information (HRI)
                action = "Soundness information (HRI)";
                uptime = (msg.payload[1] * 256 * 256 + msg.payload[2] * 256 + msg.payload[3]) / 1440;
                batteryLeft = msg.payload[4] / 2;
                RSSI = msg.payload[5] * -1;
                PER = msg.payload[6];
                SNR = (msg.payload[7] & 0x7F) / 4;
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + UPT_TOPIC, payload: uptime});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + BAT_TOPIC, payload: batteryLeft});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + RSSI_TOPIC, payload: RSSI});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + PER_TOPIC, payload: PER});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + SNR_TOPIC, payload: SNR});
                if (debug) node.error("Soundness information (HRI): Uptime=" + uptime + " minutes, BatteryLeft=" + batteryLeft + " %, RSSI=" + RSSI + " dBm, PER=" + PER + " %, SNR=" + SNR + " dB");
                break;

            case 0x41: // Self-diagnosis information (DIAG)
                action = "Self-diagnosis information (DIAG)";
                diagStatus = msg.payload[1] * 256 * 256 * 256 + msg.payload[2] * 256 * 256 + msg.payload[3] * 256 + msg.payload[4];
                diagStatusDetail = msg.payload[5] * 256 * 256 * 256 + msg.payload[6] * 256 * 256 + msg.payload[7] * 256 + msg.payload[8];

                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + DIAG_TOPIC, payload: diagStatus});
                MqttMsgs.push({
                    topic: SUSHI_SENSOR + "/" + sensorName + "/" + DIAGDETAIL_TOPIC,
                    payload: diagStatusDetail
                });
                if (debug) node.error("Self-diagnosis information (DIAG): Diag_Status=" + diagStatus + ", Diag_Status_detail=" + diagStatusDetail);
                break;

            case 0x42: // Initialization information (INI)
                action = "Initialization information (INI)";
                for (i = 1; i < msg.payload.length; i++) {
                    if (msg.payload[i] === 0) break;
                }
                sensorName = msg.payload.slice(1, i); // should start at payload (1)
                global.set(sensorID, sensorName);
                MqttMsgs.push({topic: "SushiConfig", payload: sensorID + ";" + sensorName});
                if (debug) node.error("Initialization information (INI): sensorname=" + sensorName + ", length=" + i - 1);
                break;

            case 0x43: // GPS informaption (GPS)
                action = "GPS informaption (GPS)";
                const longitude = GetFloat32(msg.payload[1], msg.payload[2], msg.payload[3], msg.payload[4]);
                const latitude = GetFloat32(msg.payload[5], msg.payload[6], msg.payload[7], msg.payload[8]);
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + LONG_TOPIC, payload: longitude});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + LAT_TOPIC, payload: latitude});
                if (debug) node.error("GPS informaption (GPS): Longitude=" + longitude + ", Latitude=" + latitude);
                break;

            case 0x44: // High Precision GPS Longitude (HPGPS-LO)
                action = "High Precision GPS Longitude (HPGPS-LO)";
                const HPLongitude = GetFloat64(msg.payload[1], msg.payload[2], msg.payload[3], msg.payload[4],
                    msg.payload[5], msg.payload[6], msg.payload[7], msg.payload[8]);
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + LONG_TOPIC, payload: HPLongitude});

                if (debug) node.error("High Precision GPS informaption (HPGPS-LO): Longitude=" + HPLongitude);
                break;

            case 0x45: // High Precision GPS Latitude (HPGPS-LA)
                action = "High Precision GPS Latitude (HPGPS-LA)";
                const HPLatitude = GetFloat64(msg.payload[1], msg.payload[2], msg.payload[3], msg.payload[4],
                    msg.payload[5], msg.payload[6], msg.payload[7], msg.payload[8]);
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + LAT_TOPIC, payload: HPLatitude});

                if (debug) node.error("High Precision GPS informaption (HPGPS-LA): Latitude=" + HPLatitude);
                break;

            case 0x46: // High Precision GPS Altitude (HPGPS-AL)
                action = "High Precision GPS Altitude (HPGPS-AL)";
                const HPAltitude = GetFloat64(msg.payload[1], msg.payload[2], msg.payload[3], msg.payload[4],
                    msg.payload[5], msg.payload[6], msg.payload[7], msg.payload[8]);

                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + ALT_TOPIC, payload: HPAltitude});

                if (debug) node.error("High Precision GPS informaption (HPGPS-LA): Altitude=" + HPAltitude);
                break;

            case 0x47: // Equipment Information

                const vendorID = msg.payload[1] * 256 * 256 * 256 + msg.payload[2] * 256 * 256 + msg.payload[3] * 256 + msg.payload[4];
                const deviceType = msg.payload[5] * 256 + msg.payload[6];
                const deviceRev = msg.payload[7] * 256 + msg.payload[8];

                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + VENDORID_TOPIC, payload: vendorID});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + DEV_TYPE_TOPIC, payload: deviceType});
                MqttMsgs.push({topic: SUSHI_SENSOR + "/" + sensorName + "/" + DEV_REV_TOPIC, payload: deviceRev});

                if (debug) node.error("Equipment information (HRI): VendorID = " + vendorID + " , Device Type =" + deviceType + " ,deviceRev=" + deviceRev);

                break;

            default:
                if (debug) node.error("Unknown message");

        }
    }
    return [MqttMsgs];
}

// ##################################################################
// ##################################################################
// ##           _____ _______ _____ _      _____ _________     __  ##
// ##     /\   / ____|__   __|_   _| |    |_   _|__   __\ \   / /  ##
// ##    /  \ | |       | |    | | | |      | |    | |   \ \_/ /   ##
// ##   / /\ \| |       | |    | | | |      | |    | |    \   /    ##
// ##  / ____ \ |____   | |   _| |_| |____ _| |_   | |     | |     ##
// ## /_/    \_\_____|  |_|  |_____|______|_____|  |_|     |_|     ##
// ##################################################################
// ##################################################################

/**
 * Decode uplink
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.bytes - Array of numbers as it will be sent to the device
 * @param {number} [input.fPort] - The fPort on which the downlink must be sent
 * @returns {Object} The decoded object
 */
class Global {
    constructor() {
    };

    get(property) {
        return "";
    };
    set(property) {
        return "";
    };
}

function formatPayload(msg) {
    let decodedPayload = {};
    msg.forEach(array => {
        array.forEach(topic => {
            // Get the data
            const separator = topic.topic.split('/');
            const labelDecoded = separator[2];
            // Add the data to the final output
            decodedPayload[labelDecoded] = topic.payload;
        })
    });
    return decodedPayload;
}

/*
............................................................................................................................
This part contains the main functions for a thingpark-x-js driver
............................................................................................................................
*/

function decodeUplink(input) {
    MqttMsgs = [];
    let result = {};
    let msg = {
        payload: [],
        eui: "",
        global: new Global()
    };

    msg.payload = input.bytes;
    // Call the YOKOGAWA function
    let decodedPayloadNotFormatted = decodeMessage(msg, msg.global);
    // Format the output given by the YOKOGAWA function so it matchs the format needed by Actility
    result = formatPayload(decodedPayloadNotFormatted);
    result.ACTION = action;

    return result;
}

/*
............................................................................................................................
This part is needed to export the functions that we test and the variables used
............................................................................................................................
*/

exports.decodeUplink = decodeUplink;
