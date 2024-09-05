function extractPoints(input) {
    let result = {};
    if (input.message == null) {
        throw new Error("missing data in the extract points input");
    }

    if (input.message.X_ACCELERATION != null) {
        result.acceleration = { unitId: "m/s2", record: input.message.X_ACCELERATION ,nature:"Acceleration X"};
    }
    if (input.message.Y_ACCELERATION != null) {
        result.acceleration = { unitId: "m/s2", record: input.message.Y_ACCELERATION ,nature:"Acceleration Y"};
    }
    if (input.message.Z_ACCELERATION != null) {
        result.acceleration = { unitId: "m/s2", record: input.message.Z_ACCELERATION ,nature:"Acceleration Z"};
    }
    if (input.message.XYZ_ACCELERATION != null) {
        result.acceleration = { unitId: "m/s2", record: input.message.XYZ_ACCELERATION,nature:"Acceleration XYZ" };
    }
    if (input.message.TEMPERATURE != null) {
        result.temperature = { unitId: "Cel", record: input.message.TEMPERATURE };
    }
    if (input.message.X_VELOCITY != null) {
        result.velocity = { unitId: "mm/s", record: input.message.X_VELOCITY,nature:"Velocity X" };
    }
    if (input.message.Y_VELOCITY != null) {
        result.velocity = { unitId: "mm/s", record: input.message.Y_VELOCITY ,nature:"Velocity Y"};
    }
    if (input.message.Z_VELOCITY != null) {
        result.velocity = { unitId: "mm/s", record: input.message.Z_VELOCITY ,nature:"Velocity Z"};
    }
    if (input.message.XYZ_VELOCITY != null) {
        result.velocity = { unitId: "mm/s", record: input.message.XYZ_VELOCITY,nature:"Velocity XYZ" };
    }
    
    return result;
}
exports.extractPoints = extractPoints;