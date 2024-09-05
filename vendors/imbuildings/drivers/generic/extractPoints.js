function extractPoints(input){
    const result = {};
    let countIndex=0;
    if (input.message.battery_voltage != null) {
        result["batteryVoltage"] = { unitId: "V", record: input.message.battery_voltage };
    }
    if (input.message.counter_a !== undefined) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter_a , nature:"Counter A" };
    }
    if (input.message.counter_b !== undefined) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter_b, nature:"Counter B"};
    }
    if (input.message.total_counter_a ) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.total_counter_a, nature:"Total counter A"};
    }
    if (input.message.total_counter_b ) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.total_counter_b, nature:"Total counter B"};
    }
    if (input.message.payload_counter ) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.payload_counter, nature:"Payload counter"};
    }


    return result;
}
exports.extractPoints = extractPoints;