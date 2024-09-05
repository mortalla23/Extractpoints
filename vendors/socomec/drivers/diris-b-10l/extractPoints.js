function extractPoints(input){
    var points = {};
    
    if(input.message.socomec == null){
        return points;
    }
    if(input.message.socomec.data == null && input.message.socomec.timestamp != null){
        return {
            time: new Date(input.message.socomec.timestamp).getTime(),
        };
    }
    else if (input.message.socomec.data == null && input.message.socomec.timestamp == null){
        return points;
    }

    //Only of profile 1
    let enerTemp=0;
    let renerTemp=0;
    if(input.message.socomec.data && input.message.socomec.data.IEaPInst ){
       
            points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaPInst };
        }
        if(input.message.socomec.data && input.message.socomec.data.IEaNInst){
       
            points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaNInst};
        }
        if(input.message.socomec.data && input.message.socomec.data.IErNInst ){
       
            points["reactiveEnergy:"+renerTemp++] = { unitId: "varh", record: input.message.socomec.data.IErNInst*1000 };
        }
        if(input.message.socomec.data && input.message.socomec.data.IErPInst ){
       
            points["reactiveEnergy:"+renerTemp++] = { unitId: "varh", record: input.message.socomec.data.IErPInst*1000 };
        }
      

    

    //Only for profile 2
    
    
    if(input.message.socomec.data && input.message.socomec.data.IErPInst1 ){
   
        points["reactiveEnergy:"+renerTemp++] = { unitId: "varh", record: input.message.socomec.data.IErPInst1*1000 };
    }
    if(input.message.socomec.data && input.message.socomec.data.IErPInst2 ){
   
        points["reactiveEnergy:"+renerTemp++] = { unitId: "varh", record: input.message.socomec.data.IErPInst2*1000 };
    }
    if(input.message.socomec.data && input.message.socomec.data.IErPInst3 ){
   
        points["reactiveEnergy:"+renerTemp++] = { unitId: "varh", record: input.message.socomec.data.IErPInst3*1000 };
    }

    if(input.message.socomec.data && input.message.socomec.data.IErPInst4 ){
   
        points["reactiveEnergy:"+renerTemp++] = { unitId: "varh", record: input.message.socomec.data.IErPInst4*1000 };
    }


    //Only for profile 3

    if(input.message.socomec.data && input.message.socomec.data.IEaNInst1 ){  
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaNInst1};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaNInst2 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaNInst2};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaNInst3 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaNInst3};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaNInst4 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaNInst4};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaPInst1 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaPInst1};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaPInst2 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaPInst2};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaPInst3 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaPInst3};
    }
    if(input.message.socomec.data && input.message.socomec.data.IEaPInst4 ){
        points["energy:"+enerTemp++] = { unitId: "kWh", record: input.message.socomec.data.IEaPInst4};
    }
    
    
    //Only for profile 4
   let fTemp=0;
   let cTemp=0;
   let tempTemp=0;
    if(input.message.socomec.data && input.message.socomec.data.IFreqAvgInst ){
        points["frequency:"+fTemp++] = { unitId: "hertz", record: input.message.socomec.data.IFreqAvgInst};
    }
    if(input.message.socomec.data && input.message.socomec.data.II1AvgInst ){
        points["current:"+cTemp++] = { unitId: "A", record: input.message.socomec.data.II1AvgInst};
    }
    if(input.message.socomec.data && input.message.socomec.data.II2AvgInst ){
        points["current:"+cTemp++] = { unitId: "A", record: input.message.socomec.data.II2AvgInst};
    }
    if(input.message.socomec.data && input.message.socomec.data.II3AvgInst ){
        points["current:"+cTemp++] = { unitId: "A", record: input.message.socomec.data.II3AvgInst};
    }
    if(input.message.socomec.data && input.message.socomec.data.IInstTemperature1 ){
        points["temperature:"+tempTemp++] = { unitId: "Cel", record: input.message.socomec.data.IInstTemperature1};
    }
    if(input.message.socomec.data && input.message.socomec.data.IInstTemperature2 ){
        points["temperature:"+tempTemp++] = { unitId: "Cel", record: input.message.socomec.data.IInstTemperature2};
    }
    if(input.message.socomec.data && input.message.socomec.data.IInstTemperature3 ){
        points["temperature:"+tempTemp++] = { unitId: "Cel", record: input.message.socomec.data.IInstTemperature3};
    }
   let poTemp=0;
   let reacTemp=0;
   let appTemp=0;
   let powerFTemp=0;
   let actTemp=0;
   
    if(input.message.socomec.data && input.message.socomec.data.IPSumAvgInst ){
        points["power:"+poTemp++] = { unitId: "kW", record: input.message.socomec.data.IPSumAvgInst};
    }
    if(input.message.socomec.data && input.message.socomec.data.IQSumAvgInst ){
            points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.IQSumAvgInst*1000 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ISSumAvgInst){
    points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.ISSumAvgInst*1000 };
    }
    
    if( input.message.socomec.data && input.message.socomec.data.IpFSumAvgInst){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IpFSumAvgInst };
    }
  
   
    if( input.message.socomec.data && input.message.socomec.data.IInputFct01!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct01 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct02!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct02 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct03!==null ){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct03 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct04!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct04 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct05!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct05 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct06!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct06 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct07!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct07};
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct08!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct08 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct09!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct09 };
    }
    if( input.message.socomec.data && input.message.socomec.data.IInputFct10!==null){
        points["powerFactor:"+powerFTemp++] = { unitId: "/", record: input.message.socomec.data.IInputFct10 };
    }


   


    if(input.message.socomec.data && input.message.socomec.data.IPSumAvgInst1 ){
        points["power:"+poTemp++] = { unitId: "kW", record: input.message.socomec.data.IPSumAvgInst1};
    }
    if(input.message.socomec.data && input.message.socomec.data.IPSumAvgInst2 ){
        points["power:"+poTemp++] = { unitId: "kW", record: input.message.socomec.data.IPSumAvgInst2};
    }
    if(input.message.socomec.data && input.message.socomec.data.IPSumAvgInst3 ){
        points["power:"+poTemp++] = { unitId: "kW", record: input.message.socomec.data.IPSumAvgInst3};
    }
    if(input.message.socomec.data && input.message.socomec.data.IPSumAvgInst4 ){
        points["power:"+poTemp++] = { unitId: "kW", record: input.message.socomec.data.IPSumAvgInst4};
    }
    if(input.message.socomec.data && input.message.socomec.data.IQSumAvgInst1 ){
        points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.IQSumAvgInst1*1000 };
    }  
    if(input.message.socomec.data && input.message.socomec.data.IQSumAvgInst2 ){
         points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.IQSumAvgInst2*1000 };
    }
    if(input.message.socomec.data && input.message.socomec.data.IQSumAvgInst3 ){
        points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.IQSumAvgInst3*1000 };
   }
   if(input.message.socomec.data && input.message.socomec.data.IQSumAvgInst4 ){
    points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.IQSumAvgInst4*1000 };
}


   
    
    if(input.message.socomec.data && input.message.socomec.data.ILastP10ActivePower ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP10ActivePower };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP10ActivePowerNeg ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP10ActivePowerNeg };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP10ReactivePower ){
        points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.ILastP10ReactivePower*1000 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP10ReactivePowerNeg ){
        points["reactivePower:"+reacTemp++] = { unitId: "var", record: input.message.socomec.data.ILastP10ReactivePowerNeg*1000 };
    }
    
    if(input.message.socomec.timestamp_t1 != null){
        points["time:2"] = { unitId: "s", record: input.message.socomec.data.timestamp_t1.getTime() };
    }
    
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ActivePower ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP11ActivePower };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ActivePowerNeg ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP11ActivePowerNeg };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ReactivePower ){
        points["reactivePower:"+actTemp++] = { unitId: "var", record: input.message.socomec.data.ILastP11ReactivePower*1000 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ReactivePowerNeg ){
        points["reactivePower:"+actTemp++] = { unitId: "var", record: input.message.socomec.data.ILastP11ReactivePowerNeg*1000 };
    }
    

    //Only for profile 7
    if(input.message.socomec.timestamp_t0 != null){
        points["time:1"] = { unitId: "s", record: input.message.socomec.data.timestamp_t0.getTime() };
    }
    
    if(input.message.socomec.data && input.message.socomec.data.ILastP10ActivePower_Load1 ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP10ActivePower_Load1 };
    }
    if(input.message.socomec.data &&input.message.socomec.data.ILastP10ActivePower_Load2  ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP10ActivePower_Load2 };
    }
    if(input.message.socomec.data &&input.message.socomec.data.ILastP10ActivePower_Load3  ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP10ActivePower_Load3 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP10ActivePower_Load4  ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP10ActivePower_Load4 };
    }

    if(input.message.socomec.timestamp_t1 != null){
        points["time:2"] = { unitId: "s", record: input.message.socomec.data.timestamp_t1.getTime() };
    }
    
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ActivePower_Load1 ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP11ActivePower_Load1 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ActivePower_Load2 ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP11ActivePower_Load2 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ActivePower_Load3 ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP11ActivePower_Load3 };
    }
    if(input.message.socomec.data && input.message.socomec.data.ILastP11ActivePower_Load4 ){
        points["activePower:"+actTemp++] = { unitId: "kW", record: input.message.socomec.data.ILastP11ActivePower_Load4 };
    }
    
    
   
    
    /*TO BE ADDED: NEED NEW ONTOLOGY
        IInputFct01: (DIaVM & 0x0001) ? 1 : 0,
        IInputFct02: (DIaVM & 0x0002) ? 1 : 0,
        IInputFct03: (DIaVM & 0x0004) ? 1 : 0,
        IInputFct04: (DIaVM & 0x0008) ? 1 : 0,
        IInputFct05: (DIaVM & 0x0010) ? 1 : 0,
        IInputFct06: (DIaVM & 0x0020) ? 1 : 0,
        IInputFct07: (DIaVM & 0x0040) ? 1 : 0,
        IInputFct08: (DIaVM & 0x0080) ? 1 : 0,
        IInputFct09: (DIaVM & 0x0100) ? 1 : 0,
        IInputFct10: (DIaVM & 0x0200) ? 1 : 0,

        CT1: (DIaVM & 0x0400) ? 1 : 0,
        CT2: (DIaVM & 0x0800) ? 1 : 0,
        CT3: (DIaVM & 0x1000) ? 1 : 0,
        CT4: (DIaVM & 0x2000) ? 1 : 0

        Input1Cpt: (CounterStatus & 0x000F),
        Input2Cpt: ((CounterStatus & 0x00F0) >> 4),
        Input3Cpt: ((CounterStatus & 0x0F00) >> 8),
        Input4Cpt: ((CounterStatus & 0xF000) >> 12)
    */
    

    return points;
};

exports.extractPoints = extractPoints;