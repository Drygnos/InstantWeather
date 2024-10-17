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
    repDiv.classList.remove('rep')
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

function createImage(src, alt, title) {
    let img = document.createElement('img');
    img.src = src;
    if ( alt != null ) img.alt = alt;
    if ( title != null ) img.title = title;
    return img;
}

function changeBG(div, weather){
    if(weather == 0){
        div.appendChild(createImage("../images/soleil.jpg", "meteo", "meteo"))
    }

    else if (weather >= 1 && weather <= 5){
        div.appendChild(createImage("../images/nuages.jpg", "meteo", "meteo"))
    }

    else if (weather >= 6 && weather <= 7){
        div.appendChild(createImage("../images/brouillard.jpg", "meteo", "meteo"))
    }

    else if ((weather >= 10 && weather <= 16) || (weather >= 30 && weather <= 32) || (weather >= 210 && weather <= 212)){
        div.appendChild(createImage("../images/pluie.jpg", "meteo", "meteo"))
    }

    else if ((weather >= 20 && weather <= 22) || (weather >= 220 && weather <= 235)){
        div.appendChild(createImage("../images/neige.jpeg", "meteo", "meteo"))
    }

    else if (weather >= 100 && weather <= 142){
        div.appendChild(createImage("../images/orage.jpg", "meteo", "meteo"))
    }

    else if ((weather >= 40 && weather <= 78)){
        div.appendChild(createImage("../images/averse.jpeg", "meteo", "meteo"))
    }

    else{
        div.appendChild(createImage("../images/soleil.jpg", "meteo", "meteo"))
    }
}

function displayPrev(previsions){
    
    const repDiv = document.getElementById('rep');
    repDiv.classList.add('rep')
    repDiv.innerHTML = '';
    for(let i = 0; i < slider.value; i++){
        const cardDiv = document.createElement('div')
        cardDiv.classList.add('cards')
        const previsionsNom = document.createElement('div')
        previsionsNom.classList.add('previsionsNom')
        changeBG(cardDiv, previsions.forecast[i].weather);
        const previsionDiv = document.createElement('div');
        previsionDiv.textContent = previsions.city.name;
        previsionDiv.classList.add('nomVille')
        previsionsNom.appendChild(previsionDiv);

        const previsionDate = document.createElement('div');
        previsionDate.classList.add('dateInfo')
        previsionDate.textContent = previsions.forecast[i].datetime.substr(8, 2) + ("/");
        previsionDate.textContent += previsions.forecast[i].datetime.substr(5, 2) + ("/");
        previsionDate.textContent += previsions.forecast[i].datetime.substr(0, 4);
        previsionsNom.appendChild(previsionDate);
        cardDiv.appendChild(previsionsNom);

        const previsionsTotal = document.createElement('div');
        previsionsTotal.classList.add('previsions')
        const previsionTMin = document.createElement('div');
        previsionTMin.textContent = "Min " + previsions.forecast[i].tmin + "°C";
        previsionsTotal.appendChild(previsionTMin);

        const previsionTMax = document.createElement('div');
        previsionTMax.textContent = "Max " + previsions.forecast[i].tmax + "°C";
        previsionsTotal.appendChild(previsionTMax);

        const previsionPPluie = document.createElement('div');
        previsionPPluie.textContent = "Précipitations " + previsions.forecast[i].probarain + "%";
        previsionsTotal.appendChild(previsionPPluie);

        const previsionSH = document.createElement('div');
        previsionSH.textContent = "Ensoleillement " + previsions.forecast[i].sun_hours + "h";
        previsionsTotal.appendChild(previsionSH);
        if(checklat.checked){
            const previsionLat = document.createElement('div');
            previsionLat.textContent = "Latitude " +previsions.city.latitude;
            previsionsTotal.appendChild(previsionLat);
        }
        if(checklong.checked){
            const previsionlong = document.createElement('div');
            previsionlong.textContent = "Longitude " +previsions.city.longitude;
            previsionsTotal.appendChild(previsionlong);
        }
        if(checkpluie.checked){
            const previsionpluie = document.createElement('div');
            previsionpluie.textContent = "Pluie tombée " +previsions.forecast[i].rr10 + " mm";
            previsionsTotal.appendChild(previsionpluie);
        }
        if(checkvent.checked){
            const previsionvent = document.createElement('div');
            previsionvent.textContent = "Moyenne vent " +previsions.forecast[i].wind10m + " km/h";
            previsionsTotal.appendChild(previsionvent);
        }
        if(checkdirvent.checked){
            const previsiondirvent = document.createElement('div');
            previsiondirvent.textContent = "Direction du vent " +previsions.forecast[i].dirwind10m + "°";
            previsionsTotal.appendChild(previsiondirvent);
        }
        cardDiv.appendChild(previsionsTotal)
        repDiv.appendChild(cardDiv)
    }

}

formCP.addEventListener('input', async ()=>{
    fetchCommunesParCodePostal(formCP.value);
})

// check.addEventListener('click', ()=>{
//     fetchCommunesParCodePostal(formCP.value);

// });
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