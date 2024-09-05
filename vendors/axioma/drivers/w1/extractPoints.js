/**
 * Extract points
 * @param {Object} input - An object provided by the IoT Flow framework
 * @param {number[]} input.message - The decoded payload
 * @param {number} [input.time] - The time of the message
 * @returns {Object} The extracted points
 */
function extractPoints(input) {
    let result = {};
    
    if (input.message == null) {
        throw new Error("invalid uplink payload: no data received");
    }
// Handle multiple volume readings
    if (input.message.volumes) {
        result["volume"]= [];
        for (const key in input.message.volumes) {
            if (input.message.volumes.hasOwnProperty(key)) {
                const volume = input.message.volumes[key];
                // Convert the volume record to a string if it's an object for clear output
                let recordValue = (typeof volume === 'object' && volume !== null) ? JSON.stringify(volume) : volume;
                result["volume"].push({
                    unitId: "m3",
                    record: recordValue
                });
            }
        }
    }

    let spacing = input.message.spacingUnit;
    if(spacing && spacing.recordSize && spacing.unit) {
        let spacingRecord = spacing.recordSize;
        let spacingUnit = spacing.unit;

        if(spacingUnit === "days") {
            spacingRecord *= 24*60;
        }
        if(spacingUnit === "hours") {
            spacingRecord *= 60;
        }
        if(spacingUnit === "seconds") {
            spacingRecord /= 60;
        }

        spacingUnit = "minute";

        result["interval"] = { unit: spacingUnit, record: spacingRecord };
    }
    return result;
}
exports.extractPoints = extractPoints;