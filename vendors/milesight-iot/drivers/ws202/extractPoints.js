function extractPoints(input)
{
    let result = {};
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.pir != null) {
        if(input.message.pir ==='trigger'){
            result.status = { unitId: "state", record: false, nature:"Pir trigger"};
        }else {
            result.status = { unitId: "state", record: true, nature:"Pir normal"};
        }
        
    }
    if (input.message.daylight != null) {
        if(input.message.daylight ==='dark'){
            result.status = { unitId: "state", record: false,nature:"Daylight dark"}
        }else if (input.message.daylight ==='illumination') {
            result.status = { unitId: "state", record: true,nature:"Daylight illumination"}
        }
    }
    return result;
}
exports.extractPoints = extractPoints;