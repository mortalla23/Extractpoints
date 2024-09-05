function extractPoints(input){
    let points = {};

    if(input.message == null || input.message.messages == null ){
        return points;
    }

    let messages = input.message.messages;
    for(let message of messages){
        switch (message.measurement){
            case "Air Temperature":
                points.temperature = {unitId: message.unit, record: message.measurementValue, nature: "air"};
                break;
            case "Air Humidity":
                points.humidity = {unitId: message.unit, record: message.measurementValue, nature: "air"};
                break;
            case "Light Intensity":
                points.illuminance = {unitId: message.unit, record: message.measurementValue};
                break;
            case "CO2":
                points.co2Level = {unitId: message.unit, record: message.measurementValue};
                break;
            case "Barometric Pressure":
                points.pressure = {unitId: message.unit, record: message.measurementValue, nature: "barometric"};
                break;
            case "Soil Temperature":
                points.temperature = {unitId: message.unit, record: message.measurementValue, nature: "soil"};
                break;
            case "Soil Moisture":
                points.moisture = {unitId: message.unit, record: message.measurementValue, nature: "soil"};
                break;
            case "Wind speed":
                points.speed = {unitId: message.unit, record: message.measurementValue, nature: "wind"};
                break;
            case "pH":
                points.pH = {unitId: message.unit, record: message.measurementValue};
                break;
            case "Light Quantum":
                points.fluxDensity = {unitId: message.unit, record: message.measurementValue, nature: "wind"};
                break;
            case "Electrical Conductivity":
                points.conductivity = {unitId: "uS/cm", record: message.measurementValue * 1000, type: "electrical"};
                break;
            case "Distance":
                points.distance = {unitId: message.unit, record: message.measurementValue};
                break;
            case "Flow Rate":
                points.flowRate = {unitId: message.unit, record: message.measurementValue};
                break;
            case "Total Flow":
                points.volume = {unitId: message.unit, record: message.measurementValue, nature: "flow"};
                break;
            case "Water Electrical Conductivity":
                points.conductivity = {unitId: message.unit, record: message.measurementValue, nature: "water", type: "electrical"};
                break;
            case "Water Temperature":
                points.temperature = {unitId: message.unit, record: message.measurementValue, nature: "water"};
                break;
            case "Soil Heat Flux":
                points.irradiance = {unitId: message.unit, record: message.measurementValue, nature: "soil"};
                break;
            case "Sunshine Duration":
                points.duration = {unitId: message.unit, record: message.measurementValue, nature: "sunshine"};
                break;
            case "Total Solar Radiation":
                points.solarRadiation = {unitId: message.unit, record: message.measurementValue};
                break;
            case "Accelerometer":
                points.acceleration = {unitId: message.unit, record: message.measurementValue};
                break;
            case "Leaf Temperature":
                points.temperature = {unitId: message.unit, record: message.measurementValue, nature: "leaf"};
                break;
            case "Noise":
                points.intensity = {unitId: message.unit, record: message.measurementValue, nature: "noise"};
                break;
            case "Sound Intensity":
                points.intensity = {unitId: message.unit, record: message.measurementValue, nature: "sound"};
                break;
            case "Dew point temperature":
                points.temperature = {unitId: message.unit, record: message.measurementValue, nature: "dew point"};
                break;
        }
    }
}