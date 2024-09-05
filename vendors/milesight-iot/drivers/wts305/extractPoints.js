function extractPoints(input)
{
    let result = {};

    if(input.message == null){
        return result;
    }

    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if(input.message.humidity != null){
        result.humidity = { unitId: "%RH", record: input.message.humidity };
    }
    if(input.message.pressure != null){
        result.pressure = { unitId: "hPa", record: input.message.pressure };
    }
    if(input.message.temperature != null){
        result.temperature = { unitId: "Cel", record: input.message.temperature };
    }
    if(input.message["wind_direction"] != null){
        result.angle = { unitId: "deg", record: input.message["wind_direction"] ,nature:"wind direction"};
    }
    if(input.message["wind_speed"] != null){
        result.speed = { unitId: "km/h", record: input.message["wind_speed"] ,nature:"wind"};
    }
    return result;
}

exports.extractPoints = extractPoints;