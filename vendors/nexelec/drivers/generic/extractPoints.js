
function extractPoints(input){
    var result = {};
let conIndex=0;
let quantityIndex=0;
let intervalIndex=0;
let intensityIndex=0;
let amountIndex=0;
    if(input.message["Concentration_PM_1"] != null){
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message["Concentration_PM_1"],nature:"Concentration PM 1" };
    }
    if(input.message["Concentration_PM_2.5"] != null){
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message["Concentration_PM_2.5"],nature:"Concentration PM 2.5" };
    }
    if(input.message["Concentration_PM_10"] != null){
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message["Concentration_PM_10"],nature:"Concentration PM 10" };
    }
    if(input.message["Temperature(°C)"] != null){
        result.temperature = { unitId: "Cel", record: input.message["Temperature(°C)"] };
    }
    if(input.message["Relative_Humidity_(%RH)"] != null){
        result.humidity = { unitId: "%RH", record: input.message["Relative_Humidity_(%RH)"] };
    }
    if(input.message["Total_CO2(ppm)"] != null){
        result["co2Level"] = { unitId: "ppm", record: input.message["Total_CO2(ppm)"] };
    }
    if(input.message["Total_COV(ppm)"] != null){
        result["concentration"] = { unitId: "ppm", record: input.message["Total_COV(ppm)"] ,nature:"Total COV"};
    }
    if(input.message["Formaldehydes(ppb)"] != null){
        result["concentration"] = { unitId: "ppb", record: input.message["Formaldehydes(ppb)"] };
    }
   
    if(input.message["Luminosity(lux)"] != null){
        result.illuminance = { unitId: "lx", record: input.message["Luminosity(lux)"] };
    }
    if(input.message["Average_Noise(dB)"] != null){
        result["sound:"+intensityIndex++] = { unitId: "dB", record: input.message["Average_Noise(dB)"],nature:"Average noise" };
    }
    if(input.message["Peak_Noise(dB)"] != null){
        result["sound:"+intensityIndex++] = { unitId: "dB", record: input.message["Peak_Noise(dB)"],nature:"Peak noise" };
    }
    if(input.message["Presence_counter"] != null){
        result.counter = { unitId: "count", record: input.message["Presence_counter"] };
    }
    if(input.message["Pressure"] != null){
        result.pressure = { unitId: "hPa", record: input.message["Pressure"] };
    }
    


    return result;
}


exports.extractPoints = extractPoints;