function extractPoints(input) {
    let points = {};

    // S'assurer que power et uploadData existent et que uploadData n'est pas vide
    if (input.message.power != null && input.message.uploadData != null && input.message.uploadData.length > 0) {
        // Utiliser le premier timestamp pour définir eventTime pour la charge
        let firstData = input.message.uploadData[0];
        let date = new Date(firstData.timestamp * 1000);
        let formattedDate = date.getFullYear() + '-' +
                            (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
                            date.getDate().toString().padStart(2, '0') + ' ' +
                            date.getHours().toString().padStart(2, '0') + ':' +
                            date.getMinutes().toString().padStart(2, '0');

        // Créer un seul objet pour charge avec eventTime et value
        points.charge = {
            unitId: "mAh",
            records:[{
                value: input.message.power,
            eventTime: formattedDate}]
        };
    }

    // if (input.message.errData != null && input.message.errData.length > 0) {
    //     points["counter"] = { unitId: "count", records: [] }; // Initialisation avec un tableau vide pour les erreurs
    //     input.message.errData.forEach(data => {
    //         let date = new Date(data.timestamp * 1000);
    //         let formattedDate = date.getFullYear() + '-' +
    //                             (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
    //                             date.getDate().toString().padStart(2, '0') + ' ' +
    //                             date.getHours().toString().padStart(2, '0') + ':' +
    //                             date.getMinutes().toString().padStart(2, '0');
    //         points["counter"].records.push({
    //             value: data.errSum,
    //             eventTime: formattedDate,
    //             nature:data.errList[0]
    //         });
    //     });
    // }
    
    return points;
}
exports.extractPoints = extractPoints;
