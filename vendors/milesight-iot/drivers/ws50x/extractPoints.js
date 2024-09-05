function extractPoints(input)
{
    let result = {};
   let statusIndex=0;
    if (input.message.switch_1 != null) {
        if(input.message.switch_1 ==='open'){
            result["status:"+statusIndex++] = { unitId: "state", record: true,nature: "Switch 1 open"};
        }else {
            result["status:"+statusIndex++] = { unitId: "state", record: false,nature: "Switch 1 close"};
        }
    }
    if (input.message.switch_2 != null) {
        if(input.message.switch_2 ==='open'){
            result["status:"+statusIndex++] = { unitId: "state", record: true,nature: "Switch 2 open"};
        }else {
            result["status:"+statusIndex++]= { unitId: "state", record: false,nature: "Switch 2 close"};
        }
    }
    if (input.message.switch_3 != null) {
        if(input.message.switch_3 ==='open'){
            result["status:"+statusIndex++]= { unitId: "state", record: true,nature: "Switch 3 open"};
        }else {
            result["status:"+statusIndex++] = { unitId: "state", record: false,nature: "Switch 3 close"};
        }
    }
    if (input.message.switch_1_change != null) {
        if(input.message.switch_1_change ==='yes'){
            result["status:"+statusIndex++] = { unitId: "state", record: true,nature: "switch 1 change"};
        }else {
            result["status:"+statusIndex++] = { unitId: "state", record: false,nature: "Switch 1 not change"};
        }
    }
    if (input.message.switch_2_change != null) {
        if(input.message.switch_2_change ==='yes'){
            result["status:"+statusIndex++] = { unitId: "state", record: true,nature: "switch 2 change"};
        }else {
            result["status:"+statusIndex++] = { unitId: "state", record: false,nature: "Switch 2 not change"};
        }
    }
    if (input.message.switch_3_change != null) {
        if(input.message.switch_3_change ==='yes'){
            result["status:"+statusIndex++] = { unitId: "state", record: true,nature: "switch 3 change"};
        }else {
            result["status:"+statusIndex++] = { unitId: "state", record: false,nature: "Switch 3 not change"};
        }
    }
    return result;
}
exports.extractPoints = extractPoints;