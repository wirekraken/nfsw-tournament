import { config, UI, showPopup } from './init.js';

let registeredPlayersTime = {};
let registeredPlayers = [];

UI.settings.regist.addPlayerBtn.onclick = (e) => {
    e.preventDefault();

    const newPlayerNickname = document.querySelector('.settings__regist_players_form input[name=nickname]');
    const newPlayerTime = document.querySelector('.settings__regist_players_form input[name=time]');

    if (!newPlayerNickname.value) return;
    
    if (localStorage.RegisteredPlayersTime) {
        registeredPlayersTime = JSON.parse(localStorage.RegisteredPlayersTime);
    }

    registeredPlayersTime[newPlayerNickname.value] = newPlayerTime.value;

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


    newPlayerNickname.value = '';
    showPopup(true, 'Registration saved!');

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

    showPopup(true, 'Registration saved!');

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
        console.log(res.status)
        if (res.status === 200) {
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

    const sortedByTime = Object.entries(players).sort((a, b) => {
        return a[1].toString().localeCompare(b[1]);
    });

    for (let i = 0; i < sortedByTime.length; i++) {
        sorted[sortedByTime[i][0]] = sortedByTime[i][1];
    }
    return sorted;
}

if (localStorage.RegisteredPlayersTime) {
    registeredPlayers = Object.keys(JSON.parse(localStorage.RegisteredPlayersTime));

    for (const [key, value] of Object.entries(JSON.parse(localStorage.RegisteredPlayersTime))) {
        UI.settings.regist.listBlock.innerHTML += `
            <div class="registered_players">
                <span class="registered_players-nickname">${ key }</span>
                <span class="registered_players-time">${ value }</span>
                <input type="button" value="-" class="removePlayerBtn">
            </div>`;
    }

    for (const removePlayerBtn of document.querySelectorAll('.removePlayerBtn')) {
        removePlayerBtn.onclick = function() { removePlayer(this)}
    }
    
}

export { registeredPlayers };