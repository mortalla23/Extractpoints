function extractPoints(input) {
    let points = {};
    let volumeIndex=0;
    let flowrateIndex=0;
    if(input.message && input.message.ZS != null){
        points["volume:"+volumeIndex++] = { unitId: "m3", record: input.message.ZS,nature:"ZS" };
    }
    if(input.message.STZS != null){
        points["volume:"+volumeIndex++] = { unitId: "m3", record: input.message.STZS ,nature:"STZS"};
    }
    if(input.message.Still_proz_pro_Tag != null){
        points["percentage"] = { unitId: "%", record: input.message.Still_proz_pro_Tag ,nature:"Still proz pro tag"};
    }
    if(input.message.DF_L_h1 != null){
        points["flowRate:"+flowrateIndex++] = { unitId: "l/s", record: input.message.DF_L_h1/3600 ,nature:"débit par h1 (DF_L_h1)"};
    }
    if(input.message.DF_L_h2 != null){
        points["flowRate:"+flowrateIndex++] = { unitId: "l/s", record: input.message.DF_L_h2/3600 ,nature:"débit par h2 (DF_L_h2)"};
    }
    if(input.message.DF_L_h3 != null){
        points["flowRate:"+flowrateIndex++] = { unitId: "l/s", record: input.message.DF_L_h3/3600,nature:"débit par h3 (DF_L_h3)" };
    }
    if(input.message.DF_L_h4 != null){
        points["flowRate:"+flowrateIndex++] = { unitId: "l/s", record: input.message.DF_L_h4/3600 ,nature:"débit par h4 (DF_L_h4)"};
    }
    if(input.message.Max_DF_L_pro_h != null){
        points["flowRate:"+flowrateIndex++] = { unitId: "l/s", record: input.message.Max_DF_L_pro_h/3600 ,nature:"débit maximal (Max_DF_L_pro)"};
    }
    if(input.message.Min_DF_L_pro_h != null){
        points["flowRate:"+flowrateIndex++] = { unitId: "l/s", record: input.message.Min_DF_L_pro_h/3600, nature:"débit minimal (Min_DF_L_pro)" };
    }
   
    if(input.message && input.message.STATUS && input.message.STATUS.INTERVALL != null && input.message && input.message.STATUS && input.message.STATUS.INTERVALL != "norm"){
        if(input.message.STATUS.INTERVALL === "2min"){
            points.interval = { unitId: "minute", record: 2 };
        }
        else if(input.message.STATUS.INTERVALL === "14days"){
            points.interval = { unitId: "minute", record: parseInt(24*60*parseInt(input.message.STATUS.INTERVALL)) };
        }
        else{
            points.duration = { unitId: "h", record: parseInt(24*parseInt(input.message.STATUS.INTERVALL)) };
        }
    }
    return points;
};

exports.extractPoints = extractPoints;