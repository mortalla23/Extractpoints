function dateToTimestamp(timestampObj) {
    return Date.UTC(
        timestampObj.year, 0, timestampObj.day,timestampObj.hours,timestampObj.minutes,timestampObj.seconds
    );
}
function extractPoints(input) {
    const result = {};
    if (input.message.data.temperature != null) {
        result.temperature = { unitId: "Cel", record: input.message.data.temperature };
    }
    if (input.message.data.humidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.data.humidity };
    }
    if (input.message.data.readings != null) {
        let elements = input.message.data.readings;
        if (typeof elements !== "undefined") {
            result.temperature = { records: [] };
            result.humidity = { records: [] };

            elements.forEach(element => {
                if (element.timestamp != null) {
                    const timestamp = dateToTimestamp(element.timestamp);
                    if (element.temperature != null) {
                        result.temperature.records.push({
                            eventTime: new Date(timestamp).toISOString(),
                            value: element.temperature
                        })
                    }
                    if (element.humidity != null) {
                        result.humidity.records.push({
                            eventTime: new Date(timestamp).toISOString(),
                            value: element.humidity
                        })
                    }
                } else {
                    if (element.temperature != null) {
                        result.temperature.records.push(element.temperature);
                    }
                    if (element.humidity != null) {
                        result.humidity.records.push(element.humidity);
                    }
                }
            });
        }
    }
    if (input.message.data.voltage != null) {
        result.batteryVoltage = { unitId: "V", record: input.message.data.voltage };
    }
    return result;
}

exports.extractPoints = extractPoints;