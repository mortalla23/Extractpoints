function extractPoints(input) {
    let points = {};

    if(input.message === undefined) {
        return points;
    }

    if(input.message.actualityDuration_minutes) {
        points["duration"] = { unitId: "minute", record: input.message.actualityDuration_minutes , nature:"Actuality duration"};
    }
    if(input.message.volume_metersCubed) {
        points["volume"] = { unitId: "m3", record: input.message.volume_metersCubed,nature:input.message.meterMedium };
    }
    if(input.message.batteryLifeTime_semesters) {
        points ["period"]= { unitId: "year", record: input.message.batteryLifeTime_semesters/2 , nature:"Battery life time"};
    }

    return points;
}

exports.extractPoints = extractPoints;