function extractPoints(input) {
    var points = {};

    if (typeof input.message.level !== "undefined") {
        points["range"] = { unitId:"m", record: input.message.level};
    }
    if (typeof input.message.battery !== "undefined") {
        points["batteryVoltage"] = { unitId: "V", record: input.message.battery };
    }
    
    

    return points;
}

exports.extractPoints = extractPoints;