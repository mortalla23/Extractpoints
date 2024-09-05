function extractPoints(input)
{
    let points = {};

    if(input.message == null){
        return points;
    }

    if (input.message.battery != null) {
        points.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if(input.message.temperature != null) {
        points.temperature = { unitId: "Cel", record: input.message.temperature };
    }
    if(input.message.latitude != null && input.message.longitude != null) {
        points.location = { unitId: "GPS", record: [input.message.longitude, input.message.latitude] };
    }
    if(input.message.wifi != null) {
        input.message.wifi.forEach((wifi, index) => {
            points["rssi:" + index] = { unitId: "dBm", record: wifi.rssi };
            points["mac:" + index] = { unitId: "IEEE-802", record: wifi.mac ,nature:"WIFI"};
        });
    }
   
    return points;
}

exports.extractPoints = extractPoints;