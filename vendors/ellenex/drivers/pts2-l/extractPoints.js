function extractPoints(input) {
    var points = {};
    if (typeof input.message.level !== "undefined") {
        points["level"]= { unitId:"m", record: input.message.level};
    }
    if (typeof input.message.batteryVoltage !== "undefined") {
        points["batteryVoltage"] = { unitId: "V", record: input.message.batteryVoltage };
    }
    if (typeof input.message.pressure !== "undefined") {
        points["pressure"] = { unitId: "Pa", record: input.message.pressure };    }
   
            
   

    return points;
}

exports.extractPoints = extractPoints;