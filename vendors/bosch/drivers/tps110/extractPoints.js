function extractPoints(input) {
    let result = {};

    // Vérifie si les données nécessaires sont présentes
    if (!input.message) {
        throw new Error("Invalid input: no data received");
    }
  
    if(input.message.data && input.message.data.temperature ){
        result.temperature= {unitId:"Cel",record:input.message.data.temperature }
    }
    if(input.message.data && input.message.data.occupied ){
        result.presence= {unitId:"state",record:input.message.data.occupied, nature:input.message.data.type }
    }
    return result;
}

exports.extractPoints = extractPoints;