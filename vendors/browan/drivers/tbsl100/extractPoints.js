function extractPoints(input){
    let result={}
if (!input.message || !input.message.data){
    throw new("payload not available");
}
if (input.message.data.temperatureBoard){
result["temperature"]={unitId:"Cel",record:"input.message.data.temperatureBoard"}
}
if (input.message.data.battery){
    result["batteryVoltage"]={unitId:"V",record:"input.message.data.battery"}
}
if (input.message.data.lux){
    result["illuminanace"]={unitId:"lx",record:"input.message.data.lux"}
}
if (input.message.data.count){
    result["counter"]={unitId:"count",record:"input.message.data.count"}
}
if (input.message.data.time){
    result["time"]={unitId:"s",record:"input.message.data.time"}
}
if (input.message.data.decibel){
    result["intensity"]={unitId:"dB",record:"input.message.data.decibel"}
}
    return result;
}
exports.extractPoints=extractPoints;