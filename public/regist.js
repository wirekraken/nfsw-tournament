const pointsSystem = { 1:12, 2:9, 3:7, 4:5, 5:3, 6:2, 7:1, 8:0 };


const registRacersBlock = document.querySelector('.regist-racer');
const addRacer = document.querySelector('.regist-racer__form input[type=submit]');
const registeredListBlock = document.querySelector('.regist-racer__list');
const pushRegist = document.querySelector('#push-regist-btn');

const startTournament = document.querySelector('#start-tournament-btn');
const tournamentBlock = document.querySelector('.tournament_block');


// registeredListBlock.innerHTML = '';

let registeredRacersTime = {};
let registeredRacers = [];

addRacer.onclick = (e) => {
    e.preventDefault();

    const newRacerNickname = document.querySelector('.regist-racer__form input[type=text]');
    const newRacerTime = document.querySelector('.regist-racer__form input[type=number]');

    if (!newRacerNickname.value) return;

    // registeredRacers.push(newRacerNickname.value);

    // registeredListBlock.innerHTML += `
    // <div class="registered_racer">
    //     <span class="registered_racer-nickname">${ newRacerNickname.value }</span>
    //     <span class="registered_racer-time">${ newRacerTime.value }</span>
    //     <input type="button" value="-" onclick="removeRacer(this)">
    // </div>`;

    // console.log(registeredRacers)
    
    if (localStorage.RegisteredRacersTime) {
        registeredRacersTime = JSON.parse(localStorage.RegisteredRacersTime);
    }

    registeredRacersTime[newRacerNickname.value] = newRacerTime.value;

    registeredRacersTime = sortReverse(registeredRacersTime);

    localStorage.RegisteredRacersTime = JSON.stringify(registeredRacersTime);

    registeredListBlock.innerHTML = '';

    for (const [key, value] of Object.entries(registeredRacersTime)) {
        registeredListBlock.innerHTML += `
            <div class="registered_racer">
                <span class="registered_racer-nickname">${ key }</span>
                <span class="registered_racer-time">${ value }</span>
                <input type="button" value="-" onclick="removeRacer(this)">
            </div>`;
    }

    newRacerNickname.value = '';

    registeredRacers = Object.keys(registeredRacersTime);

    function sortReverse(racers) {
        const sortedObj = {};
        const sorted = Object.entries(racers).sort((a, b) => a[1] - b[1]);
        
        for (let i = 0; i < sorted.length; i++) {
            sortedObj[sorted[i][0]] = sorted[i][1];
        }
        return sortedObj;
    }

}

function removeRacer(thisElem) {
    const nickname = thisElem.parentElement.querySelector('.registered_racer-nickname').innerText;
    thisElem.parentElement.remove();

    // localStorage.RegisteredRacers = Object.keys(registeredRacersTime).filter(e => e !== nickname);

    const newObj = JSON.parse(localStorage.RegisteredRacersTime);
    delete newObj[nickname];

    localStorage.RegisteredRacersTime = JSON.stringify(newObj);

    delete registeredRacersTime[nickname];
}



pushRegist.onclick = () => {
    console.log(localStorage.RegisteredRacersTime);

    fetch('http://localhost:5000/api/regist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: localStorage.RegisteredRacersTime
    })
    .then(res => console.log(res.status));
}

startTournament.onclick = () => {
    if (registeredRacers.length < 2) return;

    tournament(registeredRacers);

    tournamentBlock.style.display = 'block';
    registRacersBlock.style.display = 'none';
}

if (localStorage.RegisteredRacersTime) {
    registeredRacers = Object.keys(JSON.parse(localStorage.RegisteredRacersTime));

    for (const [key, value] of Object.entries(JSON.parse(localStorage.RegisteredRacersTime))) {
        registeredListBlock.innerHTML += `
            <div class="registered_racer">
                <span class="registered_racer-nickname">${ key }</span>
                <span class="registered_racer-time">${ value }</span>
                <input type="button" value="-" onclick="removeRacer(this)">
            </div>`;
    }
}

if (localStorage.RegisteredRacersPoint) {

    tournamentBlock.style.display = 'block';
    registRacersBlock.style.display = 'none';

    tournament(registeredRacers);

    updateLeaderboard(JSON.parse(localStorage.RegisteredRacersPoint));
}

