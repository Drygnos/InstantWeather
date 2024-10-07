let formCP = document.getElementById("code_postal");
let check = document.getElementById("check");

let checklist = []

let checklat = document.getElementById('lat')
let checklong = document.getElementById('long')
let checkpluie = document.getElementById('pluie')
let checkvent = document.getElementById('vent')
let checkdirvent = document.getElementById('dirvent')


let lastPrev = null;

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
        lastPrev = previsions;
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

const slider = document.getElementById('slider');

function displayPrev(previsions){
    
    const repDiv = document.getElementById('rep');
    repDiv.innerHTML = '';
    for(let i = 0; i < slider.value; i++){

        const previsionDiv = document.createElement('div');
        previsionDiv.textContent = previsions.city.name;
        repDiv.appendChild(previsionDiv);

        const previsionDate = document.createElement('div');
        previsionDate.textContent = previsions.forecast[i].datetime.substr(8, 2) + ("/");
        previsionDate.textContent += previsions.forecast[i].datetime.substr(5, 2) + ("/");
        previsionDate.textContent += previsions.forecast[i].datetime.substr(0, 4);
        repDiv.appendChild(previsionDate);

        const previsionTMin = document.createElement('div');
        previsionTMin.textContent = "Température minimale : " + previsions.forecast[i].tmin + "°C";
        repDiv.appendChild(previsionTMin);

        const previsionTMax = document.createElement('div');
        previsionTMax.textContent = "Température maximale : " + previsions.forecast[i].tmax + "°C";
        repDiv.appendChild(previsionTMax);

        const previsionPPluie = document.createElement('div');
        previsionPPluie.textContent = "Probabilité de pluie : " + previsions.forecast[i].probarain + "%";
        repDiv.appendChild(previsionPPluie);

        const previsionSH = document.createElement('div');
        previsionSH.textContent = "Temps d'ensoleillement : " + previsions.forecast[i].sun_hours + "h";
        repDiv.appendChild(previsionSH);
        if(checklat.checked){
            const previsionLat = document.createElement('div');
            previsionLat.textContent = "Latitude : " +previsions.city.latitude;
            repDiv.appendChild(previsionLat);
        }
        if(checklong.checked){
            const previsionlong = document.createElement('div');
            previsionlong.textContent = "Longitude : " +previsions.city.longitude;
            repDiv.appendChild(previsionlong);
        }
        if(checkpluie.checked){
            const previsionpluie = document.createElement('div');
            previsionpluie.textContent = "Pluie tombée : " +previsions.forecast[i].rr10 + " mm";
            repDiv.appendChild(previsionpluie);
        }
        if(checkvent.checked){
            const previsionvent = document.createElement('div');
            previsionvent.textContent = "Moyenne de vent : " +previsions.forecast[i].wind10m + " km/h";
            repDiv.appendChild(previsionvent);
        }
        if(checkdirvent.checked){
            const previsiondirvent = document.createElement('div');
            previsiondirvent.textContent = "Direction du vent : " +previsions.forecast[i].dirwind10m + "°";
            repDiv.appendChild(previsiondirvent);
        }
        
    }

}



check.addEventListener('click', ()=>{
    fetchCommunesParCodePostal(formCP.value);

});
const checks = document.getElementById('checks')

checks.addEventListener('click', ()=>{
    if(lastPrev != null){
        displayPrev(lastPrev);
    }
})



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