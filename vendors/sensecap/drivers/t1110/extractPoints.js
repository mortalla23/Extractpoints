function extractPoints(input){
    let points = {};

    if(input.message == null || input.message.messages == null ){
        return points;
    }

    let messages = input.message.messages;
    for(let message of messages){
        let measurement;
        if(message.measurement != null){
            measurement = message.measurement;
        } else {
            measurement = message.type;
        }
        switch (measurement){
            case "Air Temperature":
                points.temperature = {unitId: "Cel", record: message.measurementValue, nature: "air"};
                break;
            case "Air Humidity":
                points.humidity = {unitId: "%RH", record: message.measurementValue, nature: "air"};
                break;
            case " AccelerometerX":
                points["acceleration:1"] = {unitId: "m/s2", record: message.measurementValue};
                break;
            case "AccelerometerY":
                points["acceleration:2"] = {unitId: "m/s2", record: message.measurementValue};
                break;
            case "AccelerometerZ":
                points["acceleration:3"] = {unitId: "m/s2", record: message.measurementValue};
                break;
        }
    }
}

exports.extractPoints = extractPoints;