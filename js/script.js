async function fetchCommunesParCodePostal(codePostal) {
    try{
        let reponse = await fetch(
            'https://geo.api.gouv.fr/communes?codePostal=' + codePostal
        );
        let communes = await reponse.json();
        console.table(communes);
    }
    catch (erreur) {
        console.error("Erreur lors de la requête API", erreur);
        throw erreur;
    }
}