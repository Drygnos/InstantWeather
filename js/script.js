let formCP = document.getElementById("code_postal");
let check = document.getElementById("check");

class Commune {
    constructor(nom, codeINSEE) {
        this.nom = nom;
        this.codeINSEE = codeINSEE;
    }
}


async function fetchCommunesParCodePostal(codePostal) {
    try {
        let reponse = await fetch(
            'https://geo.api.gouv.fr/communes?codePostal=' + codePostal
        );

        let communes = await reponse.json();
        displayCommunes(communes)

    } catch (erreur) {
        console.error("Erreur lors de la requête API", erreur);
        throw erreur;
    }
}

async function fetchMeteoParCommuneParJour(codeInsee) {
    console.log("test");
    try{
        let reponse = await fetch(
            'https://api.meteo-concept.com/api/forecast/daily?token=e5087496addc1cf806f9fb5ca548324a8ec1fe8a3ba5edb4db213ca0f69e8fcd&insee=' + codeInsee
        );
        let previsions = await reponse.json();
        console.table(previsions);
        displayPrev(previsions);
        return previsions;
    }
    catch(erreur){
        console.error("Erreur lors de la requête API", erreur);
        throw erreur;
    }
}

function displayCommunes(communes) {
    const repDiv = document.getElementById('rep');
    repDiv.innerHTML = '';
    let count = 0;

    communes.forEach(commune => {
        const instanceComm = new Commune(commune.nom, commune.code);

        const communeDiv = document.createElement('div');

        communeDiv.textContent = commune.nom; 
        communeDiv.classList.add('co');  
        communeDiv.style.setProperty('--i', count);
        communeDiv.onclick = function(){
            fetchMeteoParCommuneParJour(instanceComm.codeINSEE);
        }

        repDiv.appendChild(communeDiv);
        count++;
    });

    setTimeout(() => {
        const allCommuneDivs = repDiv.querySelectorAll('.co');
        allCommuneDivs.forEach(communeDiv => {
            communeDiv.classList.add('visible');
        });
    }, 10);
}

function displayPrev(previsions){
    const repDiv = document.getElementById('rep');
    repDiv.innerHTML = '';

    const previsionDiv = document.createElement('div');
    previsionDiv.textContent = previsions.city.name;
    repDiv.appendChild(previsionDiv);

    const previsionTMax = document.createElement('div');
    previsionTMax.textContent = previsions.forecast[0].tmax;
    repDiv.appendChild(previsionTMax);

    const previsionTMin = document.createElement('div');
    previsionTMin.textContent = previsions.forecast[0].tmin;
    repDiv.appendChild(previsionTMin);

    const previsionPPluie = document.createElement('div');
    previsionPPluie.textContent = previsions.forecast[0].probarain;
    repDiv.appendChild(previsionPPluie);

    const previsionSH = document.createElement('div');
    previsionSH.textContent = previsions.forecast[0].sun_hours;
    repDiv.appendChild(previsionSH);

    

}

check.addEventListener('click', ()=>{
    fetchCommunesParCodePostal(formCP.value);

});



document.addEventListener('DOMContentLoaded', function () {
    const homeP = document.getElementById('homeP');
    const contenu = document.getElementById('contenu');
    homeP.addEventListener('click', function () {
        homeP.classList.add('hide');
        setTimeout(function () {
            contenu.classList.add('show');
        }, 1000);
    });
});