//  this method which will implement the points "contract"
function extractPoints(input) {
    let result = {};

    if (input.message == null) {
        throw new Error("invalid uplink payload: no data received");
    }
    
    
    if (input.message.windSpeed != null) {
        result.speed = { unitId: "m/s", record: input.message.windSpeed };
    }
    let conIndex=0;
    let tempIndex=0;
    if (typeof input.message.contactState !== 'undefined') {
        result["status"] = { 
            unitId: "state", 
            record: input.message.contactState === 1, 
            nature: "Contact state"
        };
    }
    if (typeof input.message.dataX !== 'undefined' && typeof input.message.dataY !== 'undefined' && typeof input.message.dataZ !== 'undefined') {
        
        result["acceleration"] = {
            unitId: "gravity",
            record: {
                x: input.message.dataX,
                y: input.message.dataY,
                z: input.message.dataZ
            }
        };
    }
    if (input.message.occupacity ) {
        result["status"] = { unitId: "state", record: true ,nature: "Device occupy"};
    } 
    if (input.message.tankLevel ) {
        result["distance"] = { unitId: "mm", record: input.message.tankLevel ,nature: "Tank level"};
    } 
    if (typeof input.message.alarm !== 'undefined') {
        result["status"] = {
            unitId: "state",
            record: input.message.alarm === 1,
            nature: "Alarm"
        };
    }
    if (typeof input.message.coAlarm !== 'undefined') {
        result["status"] = {
            unitId: "state",
            record: input.message.coAlarm === 1,
            nature: "Alarm"
        };
    }
    
    if (input.message.waterLevel ) {
        result["distance"] = { unitId: "mm", record: input.message.waterLevel, nature:"Water level"};
    }
    if (input.message.windDirection ) {
        result["angle"] = { unitId: "deg", record: input.message.windDirection, nature:"Wind direction"};
    }
    if (input.message.NTU ) {
        result["turbidity"] = { unitId: "ntu", record: input.message.NTU };
    }
    if (input.message.pm03p != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm03p ,nature:"Pm 03p"};
    }
    if (input.message.pm05p != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm05p ,nature:"Pm 05p"};
    }
    if (input.message.pm010p != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm010p ,nature:"Pm 010p"};
    }
    if (input.message.pm25p != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm25p,nature:"Pm 25p" };
    }
    if (input.message.pm5p != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm5p ,nature:"Pm5p"};
    }
    if (input.message.pm10p != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm10p,nature:"Pm 10p" };
    }
    if (input.message.pm1 != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm1,nature:"Pm 1" };
    }
    if (input.message.pm10 != null) {
        result["concentration:"+conIndex++]= { unitId: "ug/m3", record: input.message.pm10,nature:"Pm 10" };
    }
    if (input.message.pm25 != null) {
        result["concentration:"+conIndex++] = { unitId: "ug/m3", record: input.message.pm25,nature:"Pm 25" };
    }
    if (input.message.temperature != null ) {
        if ( input.message.temperature2 ||  input.message.temperatureWithNTU){
            result["temperature:" + tempIndex++] = { unitId: "Cel", record: input.message.temperature,nature:"Temperature 2" };
        }
        else {
            result["temperature" ] = { unitId: "Cel", record: input.message.temperature };
        }
    }
    if (input.message.temperature2 != null) {
        result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.temperature2 };
    }
    if (input.message.temperatureWithNTU != null) {
        if( input.message.temperature2 || input.message.temperature  ) {
            result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.temperatureWithNTU ,nature:"Temperature with NTU"};
        }else {
            result["temperature"] = { unitId: "Cel", record: input.message.temperatureWithNTU ,nature:"Temperature with NTU"};
        }
        
    }
    if (input.message.temperatureWithPH != null) {
        if( input.message.temperature2 || input.message.temperature  ) {
            result["temperature:"+tempIndex++] = { unitId: "Cel", record: input.message.temperatureWithPH ,nature:"Temperature with PH"};
        }else {
            result["temperature"] = { unitId: "Cel", record: input.message.temperatureWithPH ,nature:"Temperature with PH"};
        }
        
    }

    // if (input.message.highTempAlarm != null) {
    //     result["temperature"] = { unitId: "Cel", record: input.message.highTempAlarm ,nature:"High temperature alarm"};
    // }
    if (input.message.humidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.humidity };
    }
    if (input.message.TE5SoildHumidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.TE5SoildHumidity ,nature:"TE5Soil humidity" };
    }
    if (input.message.EC5SoildHumidity != null) {
        result.humidity = { unitId: "%RH", record: input.message.EC5SoildHumidity,nature:"EC5Soil humidity" };
    }
    if (input.message.TE5SoildTemp != null) {
        result.temperature = { unitId: "Cel", record: input.message.TE5SoildTemp,nature:"TE5Soil temperature" };
    }
    if (input.message.temperatureWithLDO != null) {
        result.temperature = { unitId: "Cel", record: input.message.temperatureWithLDO,nature:"Temperature with LDO" };
    }
    let leakIndex=0;
    let alarmIndex=0;
    if (input.message.waterLeak1 != null) {
        result["leak:"+leakIndex++] = { unitId: "state", record: input.message.waterLeak1===1,nature:"Water leak 1"};
    }
    if (input.message.waterLeak2 != null) {
        result["leak:"+leakIndex++] = { unitId: "state", record: input.message.waterLeak2===1,nature:"Water leak 2"};
    }
    if (input.message.fireAlarm != null) {
        result["status:"+alarmIndex++] = { unitId: "state", record: input.message.fireAlarm===1,nature:"Fire alarm"};
    } 
    if (input.message.highTempAlarm != null) {
        result["status:"+alarmIndex++] = { unitId: "state", record: input.message.highTempAlarm===1,nature:"High temperature alarm"};
    }
    if (input.message.waterLeakLocation != null) {
        if(input.message.waterLeakLocation===0){
            result["status"] = { unitId: "state", record: true,nature:"Water leak location "+input.message.waterLeakStatus};
        }else {
            result["status"] = { unitId: "state", record: false, nature: "Sensor not connected" };}
    }
    if (input.message.batteryVoltage != null) {
        result.batteryVoltage = { unitId: "V", record: input.message.batteryVoltage };
        // result.batteryLevel = { unitId: "%", record: getBatteryLevel(input.message.batteryVoltage) };
    }
    if (input.message.illuminance != null) {
        result.illuminance = { unitId: "lx", record: input.message.illuminance };
    }
    if (input.message.energy != null) {
        result.energy = { unitId: "kWh", record: input.message.energy };
    }
    if (input.message.current != null) {
        result.current = { unitId: "mA", record: input.message.current };
    }
    if (input.message.power != null) {
        result.power = { unitId: "kW", record: input.message.power };
    }
    if (input.message.resistive != null) {
        result.resistance = { unitId: "Ohm", record: input.message.resistive };
    }
    if (input.message.PH != null) {
        result.acidity = { unitId: "pH", record: input.message.PH };
    }
    // if (input.message.CO2 != null) {
    //     result.co2Level = { unitId: "ppm", record: input.message.CO2 };
    // }
    if (input.message.O3 != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.O3,nature:"O3" };
    }
    if (input.message.CO != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.CO ,nature:"CO"};
    }
    if (input.message.NO != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.NO ,nature:"NO"};
    }
    if (input.message.NO2 != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.NO2 ,nature:"NO2"};
    }
    if (input.message.SO2 != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.SO2,nature:"SO2" };
    }
    if (input.message.H2S != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.H2S ,nature:"H2S"};
    }
    if (input.message.CO2 != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.CO2,nature:"CO2" };
    }
    if (input.message.NH3 != null) {
        result["concentration:"+conIndex++] = { unitId: "ppm", record: input.message.NH3,nature:"NH3" };
    }
    if (input.message.latitude != null && input.message.longitude != null) {
        result.location = { unitId: "GPS", record: [input.message.longitude, input.message.latitude] };
    }
    if(input.message.RSSI != null){
        result.rssi = { unitId: "dBm", record: input.message.RSSI };
    }
    if(input.message.SNR != null){
        result.snr = { unitId: "dB", record: input.message.SNR };
    }
    if(input.message.HeartInterval != null){
        result.interval = { unitId: "s", record: input.message.HeartInterval };
    }
    if(input.message.noise != null){
        result.sound = { unitId: "hertz", record: input.message.noise };
    }

    let currentIndex=0;
    if(input.message.current1 != null){
        result["current:"+currentIndex++] = { unitId: "mA", record: input.message.current1 };
    }
    if(input.message.current2 != null){
        result["current:"+currentIndex++] = { unitId: "mA", record: input.message.current2 };
    }
    if(input.message.current3 != null){
        result["current:"+currentIndex++] = { unitId: "mA", record: input.message.current3 };
    }
    
    if (input.message.batteryVoltage != null) {
        if(input.message.multiplier3){
            result.batteryVoltage = { unitId: "V", record: input.message.batteryVoltage*10 };
        }else {
            result.batteryVoltage = { unitId: "V", record: input.message.batteryVoltage };
        }
        
      
    }
    return result;
}
exports.extractPoints = extractPoints;