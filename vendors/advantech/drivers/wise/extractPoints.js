function extractPoints(input) {
    let result = {};

    if (input.message == null) {
        throw new Error("invalid extractPoints input: no data received");
    }

    if (input.message.TempHumi != null) {
        if (input.message.TempHumi.Range != null && input.message.TempHumi.SenVal) {
            switch (input.message.TempHumi.Range) {
                case 0:
                    result.temperature = { unitId: "Cel", record: input.message.TempHumi.SenVal / 1000 };
                    break;
                case 1:
                    result.temperature = { unitId: "Cel", record: (input.message.TempHumi.SenVal - 32) * (5/9) / 1000 };
                    break;
                case 2:
                    result.temperature = { unitId: "Cel", record: (input.message.TempHumi.SenVal - 273.15) / 1000 };
                    break;
            }
        }
    }

    if (input.message.Device != null && input.message.Device.BatteryVolt !== undefined) {
        const eventTime = input.message.Device.Time != null ? new Date(input.message.Device.Time * 1000).toISOString() : "No time provided";
        result.batteryVoltage = {
            unitId: "V",  
            records: {
                value:input.message.Device.BatteryVolt,
            eventTime: eventTime  }
        };
    }

    if (input.message.Device != null && input.message.Device.BatteryLevel != null) {
        const eventTime = input.message.Device.Time != null ? new Date(input.message.Device.Time * 1000).toISOString() : "No time provided";
        result.batteryLevel = {
            unitId: "%",
            records: {
                value:input.message.Device.BatteryLevel,
            eventTime: eventTime
            }
        };
    }

    if (input.message.Device != null && input.message.Device.GNSS != null) {
        const longitude = parseFloat(input.message.Device.GNSS.Longitude.slice(0, -2));
        const latitude = parseFloat(input.message.Device.GNSS.Latitude.slice(0, -2));
        result.location = { unitId: "GPS", records: [longitude, latitude] };
    }
    if (input.message.Accelerometer) {w
        result.velocity = { unitId: "mm/s", records: [] };
        result.acceleration = { unitId: "gravity", records: [] };

        const axes = ['X-Axis', 'Y-Axis', 'Z-Axis'];
        axes.forEach(axis => {
            if (input.message.Accelerometer[axis]) {
                // Add velocity data
                result.velocity.records.push({
                    axis: axis.replace('-Axis', ''), // Simplify the axis name
                    value: input.message.Accelerometer[axis].OAVelocity
                });

                // Add acceleration data for Peak mg and RMS mg
                result.acceleration.records.push({
                    axis: axis.replace('-Axis', ''), // Simplify the axis name
                    value: input.message.Accelerometer[axis].Peakmg
                });
                result.acceleration.records.push({
                    axis: axis.replace('-Axis', ''), // Simplify the axis name
                    value: input.message.Accelerometer[axis].RMSmg
                });
            }
        });
    }


    return result;
}

exports.extractPoints = extractPoints;
