function extractPoints(input)
{
    let result = {};
    let snrIndex=0;
    if (input.message.battery != null) {
        result.batteryLevel = { unitId: "%", record: input.message.battery};
    }
    if (input.message.la!= null) {
        result["snr:"+snrIndex++] = { unitId: "dB", record: input.message.la,nature:"A-weighted sound level (la)"};
    }
    if (input.message.laeq!= null) {
        result["snr:"+snrIndex++] = { unitId: "dB", record: input.message.laeq,nature:"Equivalent continuous sound level (laeq)"};
    }
    if (input.message.lamax!= null) {
        result["snr:"+snrIndex++] = { unitId: "dB", record: input.message.lamax,nature:"Maximum sound pressure level (lamax)"};
    }
    return result;
}
exports.extractPoints = extractPoints;