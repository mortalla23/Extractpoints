function extractPoints(input)
{
    let result = {};
    let angleIndex=0;
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.angle_x != null) {
        result["angle:"+angleIndex++] = { unitId: "deg", record: input.message.angle_x,nature:"Angle x"};
    }
    if (input.message.angle_y != null) {
        result["angle:"+angleIndex++] = { unitId: "deg", record: input.message.angle_y,nature:"Angle y"};
    }
    if (input.message.angle_z != null) {
        result["angle:"+angleIndex++] = { unitId: "deg", record: input.message.angle_z,nature:"Angle z"};
    }
    return result;
}
exports.extractPoints = extractPoints;