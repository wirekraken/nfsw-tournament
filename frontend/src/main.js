import { config, UI, showPopup, sortByPoints } from './init.js';
import { registeredPlayers } from './registration.js';
import startTournament from './counts.js';
import updateLeaderboard from './leaderboard.js';
import { updateSettingsUI } from './updateUI.js';
import './welcome.js';
import './tracks.js';



const loadSettings = async () => {
    const response = await fetch(config.apiURI + '/settings');
    const jsonData = await response.json();

    if (response.ok && response.status === 200) {
        return jsonData;
    }

    throw new Error(`Error, status: ${response.status}`);
}


UI.settings.pullSettingsBtn.onclick = () => {
    loadSettings()
    .then(res => {
        console.log(res);
        for (const [key, value] of Object.entries(res)) {
            localStorage[key] = JSON.stringify(value);
        }
        updateSettingsUI(res);
        showPopup(true, 'Up to dated!');
    })
    .catch(err => {
        showPopup(false, 'Error pull!');
        console.log(err);
    });
}


UI.startTournamentBtn.onclick = () => {
    if (registeredPlayers.length < 2) return;

    const isConfirm = confirm('Registration will be terminated. Continue?');

    if (isConfirm) {
        startTournament(registeredPlayers);

        UI.tournament.block.style.display = 'block';
        UI.settings.block.style.display = 'none';
    }

}

UI.finishTournamentBtn.onclick = () => {
    const isConfirm = confirm('Finish the tournament?');

    if (isConfirm) {
        let sortedPlayers = {};

        if (localStorage.RegisteredPlayersPoints) {
         sortedPlayers = sortByPoints(JSON.parse(localStorage.RegisteredPlayersPoints));
        }

        fetch(config.apiURI + '/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sortedPlayers)
        })
        .then(res => {
            if (res.ok && res.status === 200) {

                localStorage.clear();
                updateLeaderboard(false);

                UI.settings.regist.listBlock.innerHTML = '';
                UI.settings.tracks.textarea.value = '';

                UI.tournament.counts.saveBtn.disabled = false;
                UI.settings.regist.pushBtn.disabled = true;
                UI.startTournamentBtn.disabled = true;

                // registeredPlayersTime = {};
                // registeredRacers = [];

                for (const selectElem of UI.tournament.counts.selectElems) selectElem.innerHTML = '';

                UI.settings.block.style.display = 'flex';
                UI.tournament.block.style.display = 'none';

                showPopup(true , 'Finish pushed!')
                console.log(res.status, 'finished');
            }
            else {
                showPopup(false , 'Error push!');
            }
        })
        .catch(err => {
            console.log(err);
        });

    }
}



if (localStorage.RegisteredPlayersTime) {
    const registeredPlayers = Object.keys(JSON.parse(localStorage.RegisteredPlayersTime));

    if (registeredPlayers.length < 2) {
        UI.settings.regist.pushBtn.disabled = true;
        UI.startTournamentBtn.disabled = true;
    }
    else {
        UI.settings.regist.pushBtn.disabled = false;
        if (localStorage.Tracks) {
            if (JSON.parse(localStorage.Tracks).length > 2) {
                UI.startTournamentBtn.disabled = false;
            }
        }
    }
}
else {
    UI.settings.regist.pushBtn.disabled = true;
    UI.startTournamentBtn.disabled = true;
}

// if tournament's active
if (localStorage.RegisteredPlayersPoints) {
    UI.settings.block.style.display = 'none';
    UI.tournament.block.style.display = 'block';

    startTournament(registeredPlayers);

    updateLeaderboard(JSON.parse(localStorage.RegisteredPlayersPoints));
}