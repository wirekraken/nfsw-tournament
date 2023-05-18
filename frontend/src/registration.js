import { config, UI, showPopup, pushSettings } from './init.js';

let registeredPlayersTime = {};
let registeredPlayers = [];

UI.settings.regist.addPlayerBtn.onclick = (e) => {
    e.preventDefault();

    if (!UI.settings.regist.playerNickname.value) return;
    
    if (localStorage.RegisteredPlayersTime) {
        registeredPlayersTime = JSON.parse(localStorage.RegisteredPlayersTime);
    }

    registeredPlayersTime[UI.settings.regist.playerNickname.value] = UI.settings.regist.playerTime.value;

    registeredPlayersTime = sortByTime(registeredPlayersTime);

    localStorage.RegisteredPlayersTime = JSON.stringify(registeredPlayersTime);

    UI.settings.regist.listBlock.innerHTML = '';

    for (const [nickname, time] of Object.entries(registeredPlayersTime)) {
        UI.settings.regist.listBlock.innerHTML += `
            <div class="registered_players">
                <span class="registered_players-nickname">${ nickname }</span>
                <span class="registered_players-time">${ time }</span>
                <input type="button" value="-" class="removePlayerBtn">
            </div>`;
    }

    for (const removePlayerBtn of document.querySelectorAll('.removePlayerBtn')) {
        removePlayerBtn.onclick = function() { removePlayer(this)}
    }

    UI.settings.regist.playerNickname.value = '';
    // showPopup(true, 'Registration saved!');

    registeredPlayers = Object.keys(registeredPlayersTime);

    if (registeredPlayers.length >= 2) {
        UI.settings.regist.pushBtn.disabled = false;

        if (localStorage.Tracks) {
            if (localStorage.Tracks.split(',').length >= 2) {
                UI.startTournamentBtn.disabled = false;
            }
        }
    }

}


function removePlayer(thisElem) {
    const nickname = thisElem.parentElement.querySelector('.registered_players-nickname').innerText;
    thisElem.parentElement.remove();

    // localStorage.RegisteredPlayers = Object.keys(registeredPlayersTime).filter(e => e !== nickname);

    const newObj = JSON.parse(localStorage.RegisteredPlayersTime);
    delete newObj[nickname];
    registeredPlayers = Object.keys(newObj);
    localStorage.RegisteredPlayersTime = JSON.stringify(newObj);
    delete registeredPlayersTime[nickname];

    // showPopup(true, 'Registration saved!');

    if (registeredPlayers.length < 2) {
        UI.settings.regist.pushBtn.disabled = true;
        UI.startTournamentBtn.disabled = true;
    }
}


UI.settings.regist.pushBtn.onclick = () => {
    if (registeredPlayers.length < 2) return;

    fetch(config.apiURI + '/regist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: localStorage.RegisteredPlayersTime
    })
    .then(res => {
        console.log(res.status);
        if (res.ok && res.status === 200) {
            showPopup(true, 'Registration pushed!');
        }
        else {
            showPopup(false, 'Error push!');
        }
    })
    .catch(err => {
        console.log(err);
    })
}

function sortByTime(players) {
    const sorted = {};

    const sortedArray = Object.entries(players).sort((a, b) => {
        return a[1].toString().localeCompare(b[1]);
    });

    for (let i = 0; i < sortedArray.length; i++) {
        sorted[sortedArray[i][0]] = sortedArray[i][1];
    }
    return sorted;
}

if (localStorage.RegisteredPlayersTime) {
    registeredPlayers = Object.keys(JSON.parse(localStorage.RegisteredPlayersTime));

    UI.settings.regist.listBlock.innerHTML = '';
    for (const [nickname, time] of Object.entries(JSON.parse(localStorage.RegisteredPlayersTime))) {
        UI.settings.regist.listBlock.innerHTML += `
            <div class="registered_players">
                <span class="registered_players-nickname">${ nickname }</span>
                <span class="registered_players-time">${ time }</span>
                <input type="button" value="-" class="removePlayerBtn">
            </div>`;
    }

    for (const removePlayerBtn of document.querySelectorAll('.removePlayerBtn')) {
        removePlayerBtn.onclick = function() {removePlayer(this)}
    }
    
}

export { registeredPlayers, removePlayer };