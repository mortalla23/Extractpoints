function extractPoints(input) {
    let points = {};

    // Vérifier si l'objet message existe avec des messages valides
    if (!input || !input.message || !input.message.messages) {
        throw new Error("Invalid uplink payload: no data received");
    }

    // Itérer sur chaque message dans le tableau des messages
    input.message.messages.forEach(message => {
        // Extraire la température de l'air (Air Temperature)
        if (message.type === "Air Temperature" && message.unit === "Cel") {
            points["temperature"] = {
                unitId: "Cel",
                record: message.measurementValue,
                nature: message.type
            };
        }
        if (message.type=== "Air Humidity" && message.unit === "%RH") {
            points["humidity"] = {
                unitId: message.unit,
                record: message.measurementValue,
                nature: message.type
            };
        }

        // Extraire l'intensité lumineuse (Light Intensity)
        if (message.type === "Light Intensity" && message.unit === "lx") {
            points["illuminance"] = {
                unitId: "lx",
                record: message.measurementValue,
                nature: message.type
            };
        }
        if (message.measurement === "Wind speed" && message.unit === "m/s") {
            points["speed"] = {
                unitId: message.unit,
                record: message.measurementValue,
                nature: message.type
            };
        }
        if (message.type === "UV Index") {
            points["uv"] = {
                unitId: "index",
                record: message.measurementValue,
                nature: message.type
            };
        }


        // Ajouter plus de capteurs ici en fonction des besoins
    });

    return points;
}

exports.extractPoints = extractPoints;
