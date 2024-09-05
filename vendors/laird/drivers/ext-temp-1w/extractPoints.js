function extractPoints(input) {
    const result = {};
    const data = input.message.data;
    let humIndex = 0;
    let tempIndex = 0;

    // Add general battery capacity if available
    if (data.batteryCapacity !== undefined) {
        result.batteryLevel = { unitId: "%", record:parseInt(data.batteryCapacity.replace('%', ''))};
    }
    if (data.voltage !== undefined) {
        result.batteryVoltage = { unitId: "V", record: data.voltage };
    }

    if (data.tempAlarmLimitLow !== undefined) {
        result["temperature:" + tempIndex++] = { unitId: "Cel", record: data.tempAlarmLimitLow, nature: "Temperature alarm limit low" };
    }
    if (data.tempAlarmLimitHigh !== undefined) {
        result["temperature:" + tempIndex++] = { unitId: "Cel", record: data.tempAlarmLimitHigh, nature: "Temperature alarm limit high" };
    }
    if (data.humidityAlarmLimitLow !== undefined) {
        result["humidity:" + humIndex++] = { unitId: "%RH", record: data.humidityAlarmLimitLow, nature: "Humidity alarm limit low" };
    }
    if (data.humidityAlarmLimitHigh !== undefined) {
        result["humidity:" + humIndex++] = { unitId: "%RH", record: data.humidityAlarmLimitHigh, nature: "Humidity alarm limit high" };
    }

    // Handle temperature and humidity readings, either aggregated or individual
    if (data.readings) {
        data.readings.forEach((reading, index) => {
            const baseKeyTemp = `temperature:${index}`;
            const baseKeyHumid = `humidity:${index}`;
            let readingTimestamp = "";

            // If there's a timestamp per reading, format it
            if (reading.timestamp) {
                readingTimestamp = formatTimestamp(reading.timestamp);
                result[baseKeyTemp] = {
                    unitId: "Cel",
                    records: [{
                        value: reading.temperature,
                        eventTime: readingTimestamp
                    }]
                };
                result[baseKeyHumid] = {
                    unitId: "%RH",
                    records: [{
                        value: reading.humidity,
                        eventTime: readingTimestamp
                    }]
                };
            } else {
                // Without timestamp per reading
                result[baseKeyTemp] = {
                    unitId: "Cel",
                    record: reading.temperature
                };
                result[baseKeyHumid] = {
                    unitId: "%RH",
                    record:  reading.humidity
                };
            }
        });
    } else {
        // Single temperature and humidity readings
        if (data.temperature !== undefined) {
            if (data.timestamp) {
                result.temperature = {
                    unitId: "Cel",
                    records: [{
                        value: data.temperature,
                        eventTime: formatTimestamp(data.timestamp)
                    }]
                };
            } else {
                result.temperature = {
                    unitId: "Cel",
                    record: data.temperature
                };
            }
        }
        if (data.humidity !== undefined) {
            if (data.timestamp) {
                result.humidity = {
                    unitId: "%RH",
                    records: [{
                        value: data.humidity,
                        eventTime: formatTimestamp(data.timestamp)
                    }]
                };
            } else {
                result.humidity = {
                    unitId: "%RH",
                    record: data.humidity
                };
            }
        }
    }

    return result;
}

function formatTimestamp(timestamp) {
    const year = String(timestamp.year).padStart(4, '0');
    const month = String(timestamp.month).padStart(2, '0');
    const day = String(timestamp.day).padStart(2, '0');
    const hours = String(timestamp.hours).padStart(2, '0');
    const minutes = String(timestamp.minutes).padStart(2, '0');
    const seconds = String(timestamp.seconds).padStart(2, '0');
    const timezone = timestamp.timezone || 'Z';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
}

exports.extractPoints = extractPoints;
