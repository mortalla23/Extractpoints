function extractPoints(input) {
    let points = {};

    if (!input.message) {
        return points;
    }

    let volumeIndex = 0; // Initialisation en dehors des conditions pour être utilisée globalement
    function formatTimestamp(timestamp) {
        const year = timestamp.year;
        const month = String(timestamp.month).padStart(2, '0');
        const day = String(timestamp.day).padStart(2, '0');
        const hours = String(timestamp.hours).padStart(2, '0');
        const minutes = String(timestamp.minutes).padStart(2, '0');
        const formattedTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
        return formattedTimestamp;
    }
    const eventTime = input.message.timestamp ? formatTimestamp(input.message.timestamp) : null;

    if (input.message.instantMeasurementReading_liters) {
        points["volume"] = { 
            unitId: "l", 
            record: input.message.instantMeasurementReading_liters,
                nature: "Instant reading"
        };
    } 
    if (input.message.readings) {
        points["volume:"+volumeIndex++] = { 
            unitId: "l", 
            records: [{
                value: input.message.readings, 
                eventTime: eventTime,
                nature: "Historical reading"
            }]
        };
    }
    // if (input.message.readings) {
    //     input.message.readings.forEach((reading, index) => {
    //         points["volume:" + (volumeIndex + index)] = { 
    //             unitId: "l", 
    //             records: {
    //                 value: reading, 
    //                 eventTime: eventTime,
    //                 nature: "Historical reading"
    //             }
    //         };
    //     });
    //     // volumeIndex += input.message.readings.length;
    // }
    if (input.message.firstInstantReading_liters) {
        points["volume:" + volumeIndex++] = {
            unitId: "l", 
            records: [{
                value: input.message.firstInstantReading_liters, 
                eventTime: eventTime, 
                nature: "First instant reading liters"
            }]
        };
    }

    return points;
}

exports.extractPoints = extractPoints;
