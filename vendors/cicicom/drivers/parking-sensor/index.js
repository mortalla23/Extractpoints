/**
 * Payload Decoder for The ChirpStack v4 // Actility
 *
 * Copyright 2024 Cicicom IoT
 * 
 * @product S-LG-I3
 * Refer to Payload Description for more Details
 */


function decodeUplink(input) {
    let result = {
        data: {},
        errors: [],
        warnings: []
    };
    const rawPayload = Buffer.from(input.bytes);

    if (rawPayload.byteLength > 24) {
        result.errors.push("Invalid uplink payload: length exceeds 24 bytes");
        delete result.data;
        return result;
    }

    var payloadType;
    // Check the first byte from an incoming payload
    if (rawPayload[0] === 67 && rawPayload.byteLength < 17) {
        payloadType = 1;
    }
    else if (rawPayload[0] === 75 && rawPayload.byteLength < 24) {
        payloadType = 2;
    }
    else if (rawPayload[0] === 82 && rawPayload.byteLength < 18) {
        payloadType = 3;
    }
    else if (rawPayload[0] === 69 && rawPayload.byteLength < 9) {
        payloadType = 4;
    }

    for (let i = 0; i < rawPayload.byteLength; i++) {
        switch (payloadType) {

            case 1: // Occupation Status Change

                result.data.messageType = "Status Change";
                const carStatusrawStatusChangePayload = rawPayload.slice(1, 2).toString();
                if (carStatusrawStatusChangePayload.includes('1')) {
                    result.data.carStatus = 'Occupied';
                }
                else {
                    result.data.carStatus = 'Free';
                }
                const uidtagrawStatusChangePayload = rawPayload.slice(2, 14).toString();
                result.data.uidtag = uidtagrawStatusChangePayload;
                break;

            case 2: // Status Report

                result.data.messageType = "Keep Alive";
                const carStatusrawStatusPayload = rawPayload.slice(1, 2).toString();
                if (carStatusrawStatusPayload.includes('1')) {
                    result.data.carStatus = 'Occupied';
                }
                else {
                    result.data.carStatus = 'Free';
                }
                const batteryrawStatusPayload = rawPayload.slice(2, 6).toString();
                result.data.batteryVoltage = batteryrawStatusPayload + 'V';
                const temperaturerawStatusPayload = rawPayload.slice(6, 11).toString();
                result.data.temperature = temperaturerawStatusPayload + '°C';
                const uidtagrawStatusPayload = rawPayload.slice(11, 22).toString();
                result.data.uidtag = uidtagrawStatusPayload;
                break;

            case 3:  // Payload after reset (Boot payload)

                result.data.messageType = "Reset";
                const carStatusrawBootPayload = rawPayload.slice(1, 2).toString();
                if (carStatusrawBootPayload.includes('1')) {
                    result.data.carStatus = 'Occupied';
                }
                else {
                    result.data.carStatus = 'Free';
                }
                const batteryrawBootPayload = rawPayload.slice(2, 6).toString();
                result.data.batteryVoltage = batteryrawBootPayload + 'V';
                const temperaturerawBootPayload = rawPayload.slice(6, 11).toString();
                result.data.temperature = temperaturerawBootPayload + '°C';
                const firmwareversionrawBootPayload = rawPayload.slice(11, 17).toString();
                result.data.firmwareVersion = firmwareversionrawBootPayload;
                break;

            case 4: // Device Malfunction Payload  

                result.data.messageType = "Malfunction";
                const batteryrawMalfunctionPayload = rawPayload.slice(1, 5).toString();
                result.data.batteryVoltage = batteryrawMalfunctionPayload + 'V';
                const statusReportrawMalfunctionPayload = rawPayload.slice(5, 9).toString();
                result.data.statusReport = statusReportrawMalfunctionPayload
                break;

            default:

                result.errors.push("Invalid uplink payload: unknown id '" + rawPayload + "'");
                delete result.data;
                return result;
        }
    }

    return result;
}

// ADDED BY ACTILITY
exports.decodeUplink = decodeUplink;