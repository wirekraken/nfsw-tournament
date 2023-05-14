let pointsSystem = { 1:12, 2:9, 3:7, 4:5, 5:3, 6:2, 7:1, 8:0 };


const settingsBlock = document.querySelector('.settings');
const tournamentBlock = document.querySelector('.tournament');

const wellcomeArea = document.querySelector('.settings__wellcome textarea');
const pushWellcome = document.querySelector('#push-wellcome-btn');

const addPlayer = document.querySelector('.settings__regist_players_form input[type=submit]');
const registeredListBlock = document.querySelector('.settings__regist_players_list');
const pushRegist = document.querySelector('#push-regist-btn');

const tracksBlock = document.querySelector('.settings__tracks_block');
const tracksArea = document.querySelector('.settings__tracks_block textarea');
const saveTracks = document.querySelector('#save-tracks-btn');

const pointsSystemBlockInputs = document.querySelector('.settings__points-system_inputs');
const savePointsSystem = document.querySelector('#save-points-system-btn');

const startTournament = document.querySelector('#start-tournament-btn');

// localStorage.Tracks = tracksArea.value.split('\n');

(function wellcomeHandler() {
    // if (wellcomeArea.value.length < 10) pushWellcome.disabled = true;
    // else pushWellcome.disabled = false;

    wellcomeArea.value = `:trophy: **Стартует новый турнир!**\n:trophy: **A new tournament is starting!**`

    wellcomeArea.oninput = function() {
        // at least 10 characters
        if (this.value.length < 10) pushWellcome.disabled = true;
        else pushWellcome.disabled = false;
    }

    pushWellcome.onclick = () => {
        // pupopStatus(true, 'Wellcome pushed');

        if (!wellcomeArea.value) return;

        fetch('http://localhost:5000/api/wellcome', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Header: 'hello', Body: wellcomeArea.value })
        })
        .then(res => {
            console.log(res.status);
            if (res.status === 200){
                pupopStatus(true, 'Wellcome pushed!')
            } 
            else {
                pupopStatus(false, 'Error push!');
            }
        });
    }
})();

(function tracksHandler() {
    tracksArea.value = 'Kempton Docks\nIronhorse & Coast\nValley & State\nSouth Fortuna Circuit\nSeaside Interchange';

    if (localStorage.Tracks) {
        const arr = localStorage.Tracks.split(',');
        tracksArea.value = '';
        for (let i = 0; i < arr.length; i++) {
            // if (arr[i] === '') continue;
            tracksArea.value += arr[i]+'\n';
        }
    }

    saveTracks.onclick = () => {
        const arr = tracksArea.value.split('\n').filter(e => e !== '');
        localStorage.Tracks = arr;
        if (arr.length >= 2) {
            startTournament.disabled = false;
        }
        else {
            startTournament.disabled = true;
        }
        pupopStatus(true, 'Tracks saved!');
        tracksBlock.style.background = 'rgba(0,0,0,.155)';
        setTimeout(() => {
            tracksBlock.style.background = 'rgba(0,0,0,.1)';
        }, 200)
    }
})();


(function pointsSystemHandler() {

    for (const [key, value] of Object.entries(pointsSystem)) {
        pointsSystemBlockInputs.innerHTML += `
        <div>
            <span>${key}:</span>
            <input type="text" name=${key} value=${value} oninput="pointsSystem[this.name] = +this.value">
        </div>`
    }

    if (localStorage.PointsSystem) {
        pointsSystem = JSON.parse(localStorage.PointsSystem);

        pointsSystemBlockInputs.innerHTML = '';
        for (const [key, value] of Object.entries(pointsSystem)) {
            pointsSystemBlockInputs.innerHTML += `
            <div>
                <span>${key}:</span>
                <input type="text" name=${key} value=${value} oninput="pointsSystem[this.name] = +this.value">
            </div>`
        }
    }

    savePointsSystem.onclick = () => {
        localStorage.PointsSystem = JSON.stringify(pointsSystem);
        pupopStatus(true, 'Points system saved!');
        pointsSystemBlockInputs.parentElement.style.background = 'rgba(0,0,0,.155)';
        setTimeout(() => {
            pointsSystemBlockInputs.parentElement.style.background = 'rgba(0,0,0,.1)';
        }, 200)
    }
})();


let registeredPlayersTime = {};
let registeredPlayers = [];

addPlayer.onclick = (e) => {
    e.preventDefault();

    const newRacerNickname = document.querySelector('.settings__regist_players_form input[name=nickname]');
    const newRacerTime = document.querySelector('.settings__regist_players_form input[name=time]');

    if (!newRacerNickname.value) return;

    // registeredPlayers.push(newRacerNickname.value);

    // registeredListBlock.innerHTML += `
    // <div class="registered_players">
    //     <span class="registered_players-nickname">${ newRacerNickname.value }</span>
    //     <span class="registered_players-time">${ newRacerTime.value }</span>
    //     <input type="button" value="-" onclick="removeRacer(this)">
    // </div>`;

    // console.log(registeredPlayers)
    
    if (localStorage.RegisteredPlayersTime) {
        registeredPlayersTime = JSON.parse(localStorage.RegisteredPlayersTime);
    }

    registeredPlayersTime[newRacerNickname.value] = newRacerTime.value;

    registeredPlayersTime = sortReverse(registeredPlayersTime);

    localStorage.RegisteredPlayersTime = JSON.stringify(registeredPlayersTime);

    registeredListBlock.innerHTML = '';

    for (const [key, value] of Object.entries(registeredPlayersTime)) {
        registeredListBlock.innerHTML += `
            <div class="registered_players">
                <span class="registered_players-nickname">${ key }</span>
                <span class="registered_players-time">${ value }</span>
                <input type="button" value="-" onclick="removeRacer(this)">
            </div>`;
    }

    newRacerNickname.value = '';
    pupopStatus(true, 'Registration saved!');

    registeredPlayers = Object.keys(registeredPlayersTime);

    if (registeredPlayers.length >= 2) {
        pushRegist.disabled = false;

        if (localStorage.Tracks) {
            if (localStorage.Tracks.split(',').length >= 2) {
                startTournament.disabled = false;
            }
        }
    }

    function sortReverse(racers) {
        const sortedObj = {};

        const sorted = Object.entries(racers).sort((a, b) => {
            return a[1].toString().localeCompare(b[1]);
        });

        for (let i = 0; i < sorted.length; i++) {
            sortedObj[sorted[i][0]] = sorted[i][1];
        }
        return sortedObj;
    }

}

function removeRacer(thisElem) {
    const nickname = thisElem.parentElement.querySelector('.registered_players-nickname').innerText;
    thisElem.parentElement.remove();

    // localStorage.RegisteredPlayers = Object.keys(registeredPlayersTime).filter(e => e !== nickname);

    const newObj = JSON.parse(localStorage.RegisteredPlayersTime);
    delete newObj[nickname];
    registeredPlayers = Object.keys(newObj);
    localStorage.RegisteredPlayersTime = JSON.stringify(newObj);
    delete registeredPlayersTime[nickname];

    pupopStatus(true, 'Registration saved!');

    if (registeredPlayers.length < 2) {
        pushRegist.disabled = true;
        startTournament.disabled = true;
    }
}

startTournament.disabled = true;

if (localStorage.RegisteredPlayersTime) {
    if (Object.keys(JSON.parse(localStorage.RegisteredPlayersTime)).length < 2) {
        pushRegist.disabled = true;
        startTournament.disabled = true;
    }
    else {
        pushRegist.disabled = false;
        if (localStorage.Tracks) {
            if (localStorage.Tracks.split(',').length > 2) {
                startTournament.disabled = false;
            }
        }
    }
}
else {
    pushRegist.disabled = true;
    startTournament.disabled = true;
}

pushRegist.onclick = () => {
    if (registeredPlayers.length < 2) return;

    fetch('http://localhost:5000/api/regist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: localStorage.RegisteredPlayersTime
    })
    .then(res => {
        console.log(res.status)
        if (res.status === 200) {
            pupopStatus(true, 'Registration pushed!');
        } else {
            pupopStatus(false, 'Error push!');
        }
    });

}

startTournament.onclick = () => {
    if (registeredPlayers.length < 2) return;

    const confirm = window.confirm('Registration will be terminated. Continue?');

    if (confirm) {
        tournament(registeredPlayers);

        tournamentBlock.style.display = 'block';
        settingsBlock.style.display = 'none';
    }

}

if (localStorage.RegisteredPlayersTime) {
    registeredPlayers = Object.keys(JSON.parse(localStorage.RegisteredPlayersTime));

    for (const [key, value] of Object.entries(JSON.parse(localStorage.RegisteredPlayersTime))) {
        registeredListBlock.innerHTML += `
            <div class="registered_players">
                <span class="registered_players-nickname">${ key }</span>
                <span class="registered_players-time">${ value }</span>
                <input type="button" value="-" onclick="removeRacer(this)">
            </div>`;
    }
}

if (localStorage.RegisteredPlayersPoint) {

    tournamentBlock.style.display = 'block';
    settingsBlock.style.display = 'none';

    tournament(registeredPlayers);

    updateLeaderboard(JSON.parse(localStorage.RegisteredPlayersPoint));
}


function pupopStatus(status, statusText) {
    const color = (status) ? 'rgba(50,255,50,.8)' : 'rgba(255,50,50,.8)';
    // const statusText = (status) ? 'Pushed!' : 'Error push!';
    const styles = `
        padding: 10px;
        font-size: 16px;
        background: ${color};
        position: fixed;
        border-radius: 3px;
        right: 10px;
        top: 10px;
    `;
    const div = document.createElement('div');
    div.innerHTML = `<span style="${styles}">${statusText}</span>`;
    document.body.appendChild(div);
    setTimeout(() => {
        document.body.removeChild(div);
    }, 1000)
}
