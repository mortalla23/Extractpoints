function extractPoints(input)
{
    let result = {};

    if (input.message.currentTotal != null) {
        result["current"] = { unitId: "A", record: input.message.currentTotal};
    }
    if (input.message.kWhTotal != null) {
        result["energy"] = { unitId: "kWh", record: input.message.kWhTotal};
    }
    let pfactorIndex=0;
    let actPowerIndex=0;
    if (input.message.powerFactorL1 != null) {
        result["powerFactor:"+pfactorIndex++] = { unitId: "/", record: input.message.powerFactorL1,nature:"L1"};
    }
    if (input.message.powerFactorL2 != null) {
        result["powerFactor:"+pfactorIndex++] = { unitId: "/", record: input.message.powerFactorL2,nature:"L2"};
    }
    if (input.message.powerFactorL3 != null) {
        result["powerFactor:"+pfactorIndex++] = { unitId: "/", record: input.message.powerFactorL3,nature:"L3"};
    }
    if (input.message.powerFactorTotal != null) {
        result["powerFactor"] = { unitId: "/", record: input.message.powerFactorTotal,nature:" Total "};
    }
    if (input.message.activePowerL1 != null) {
        result["activePower:"+actPowerIndex++] = { unitId: "W", record: input.message.activePowerL1,nature:"L1"};
    }
    if (input.message.activePowerL2 != null) {
        result["activePower:"+actPowerIndex++] = { unitId: "W", record: input.message.activePowerL2,nature:"L2"};
    }
    if (input.message.activePowerL3 != null) {
        result["activePower:"+actPowerIndex++] = { unitId: "W", record: input.message.activePowerL3,nature:"L3"};
    }
    if (input.message.activePowerTotal != null) {
        result["activePower:"+actPowerIndex++] = { unitId: "W", record: input.message.activePowerTotal,nature:"Total "};
    }
    /*if(input.message.kWhTotal){
        result.kWhTotal = { unitId: "var", record: input.message.reactivePowerTotal };
    }*/
    return result;
}
exports.extractPoints = extractPoints;