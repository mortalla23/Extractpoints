function extractPoints(input)
{
    let result = {};
let battIndex=0;
let countIndex=0;
    if (input.message.batteryVoltageIDLE != null) {
        result["batteryVoltage:"+battIndex++] = { unitId: "mV", record: input.message.batteryVoltageIDLE,nature:"IDLE"};
    }
    if (input.message.batteryVoltageTx != null) {
        result["batteryVoltage:"+battIndex++] = { unitId: "mV", record: input.message.batteryVoltageTx,nature:"Tx"};
    }
    if (input.message.counter1 != null) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter1};
    }
    if (input.message.counter2 != null) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter2};
    }
    if (input.message.counter3 != null) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter3};
    }
    if (input.message.counter4 != null) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter4};
    }
    if (input.message.counter5 != null) {
        result["counter:"+countIndex++] = { unitId: "count", record: input.message.counter5};
    }
    return result;
}


exports.extractPoints = extractPoints;