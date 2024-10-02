async function fetchCommunesParCodePostal(codePostal) {
    try{
        let reponse = await fetch(
            'https://geo.api.gouv.fr/communes?codePostal=' + codePostal
        );
        let communes = await reponse.json();
        return communes;
    }
    catch (erreur) {
        console.error("Erreur lors de la requête API", erreur);
        throw erreur;
    }
}

async function fetchMeteoParCommuneParJour(codeInsee) {
    try{
        let reponse = await fetch(
            'https://api.meteo-concept.com/api/forecast/daily/0?token=e5087496addc1cf806f9fb5ca548324a8ec1fe8a3ba5edb4db213ca0f69e8fcd&insee=' + codeInsee
        );
        let previsions = await reponse.json();
        console.table(previsions);
        return previsions;
    }
    catch(erreur){
        console.error("Erreur lors de la requête API", erreur);
        throw erreur;
    }
}
