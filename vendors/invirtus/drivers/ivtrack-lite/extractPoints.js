function extractPoints(input){

    var points = {};

    if (input.message.latitude != null && input.message.longitude != null) {
        let latitude = input.message.latitude;
        let longitude = input.message.longitude;
        if (longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90) {
            points["location"] = { unitId: "GPS", record: [longitude, latitude] };
        }
    }
    if(input.message.batteryLevel != null){
        points["batteryLevel"] = { unitId: "V", record: input.message.batteryLevel/1000 };
    }
    if(input.message.EPE != null){
        points["accuracy"]= { unitId: "m", record: input.message.EPE,nature:"Estimate of Position Error(EPE)" };
    }
    
    if(input.message.TTFF != null){
        points["duration"] = { unitId: "s", record: input.message.TTFF ,nature:"Time to First Fix(TTFF)"};
    }
    if(input.message.HDOP != null){
        points["navigation"] = { unitId: "dop", record: input.message.HDOP,nature:"Horizontal Dilution Of Precision(HDOP)" };
    }

    return points;
}

exports.extractPoints = extractPoints;