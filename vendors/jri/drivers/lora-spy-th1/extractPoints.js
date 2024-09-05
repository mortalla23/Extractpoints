function extractPoints(input) {
    var points = {};
    let tempIndex = 0;
    let humIndex = 0;

    // Conversion du timestamp Unix (en millisecondes) en JavaScript Date object
    let timestamp = input.message.timestamp || input.message.currentSensorTimestamp;

    let eventTime = new Date(timestamp);
    let formattedDate = eventTime.getFullYear() + '-' +
                        (eventTime.getMonth() + 1).toString().padStart(2, '0') + '-' +
                        eventTime.getDate().toString().padStart(2, '0') + ' ' +
                        eventTime.getHours().toString().padStart(2, '0') + ':' +
                        eventTime.getMinutes().toString().padStart(2, '0') + ':' +
                        eventTime.getSeconds().toString().padStart(2, '0');

    if (input.message.transmissionPeriod != null) {
        points["duration"] = {
            unitId: "minute",
            record: parseInt(input.message.transmissionPeriod),
            nature: "Transmission period"
        };
    }
    
    if (input.message.batteryVoltage != null) {
        points.batteryVoltage = {
            unitId: "V",
            records:[{
            value:input.message.batteryVoltage,
            eventTime: formattedDate
        }]
        };
    }

    // Gérer les entrées de température avec ajout du temps formaté
    if (input.message.value1N != null) {
        points["temperature:"+tempIndex++] = {
            unitId: "Cel",
            records:[{
                value: input.message.value1N,
            eventTime: formattedDate,nature:"Temperature Reading 1"
            }]
        };
    }
    if (input.message.value1N_1 != null) {
        points["temperature:"+tempIndex++] = {
            unitId: "Cel",
            records:[{
                value: input.message.value1N_1,
            eventTime: formattedDate,nature:"Temperature reading 2"}]
        };
    }
    if (input.message.value1N_2 != null) {
        points["temperature:"+tempIndex++] = {
            unitId: "Cel",
            records:[{
                value: input.message.value1N_2,
            eventTime: formattedDate,nature:"Temperature reading 3"}]
        };
    }

    // Gérer les entrées d'humidité avec ajout du temps formaté
    if (input.message.value2N != null) {
        points["humidity:"+humIndex++] = {
            unitId: "%RH",
            records:[{
                value: input.message.value2N,
            eventTime: formattedDate,nature:"Humidity Reading 1"}]
        };
    }
    if (input.message.value2N_1 != null) {
        points["humidity:"+humIndex++] = {
            unitId: "%RH",
            records:[{
                value: input.message.value2N_1,
            eventTime: formattedDate,nature:"Humidity Reading 2"}]
        };
    }
    if (input.message.value2N_2 != null) {
        points["humidity:"+humIndex++] = {
            unitId: "%RH",
            records:[{
                value: input.message.value2N_2,
            eventTime: formattedDate,nature:"Humidity Reading 3"}]
        };
    }

    return points;
}

exports.extractPoints = extractPoints;
