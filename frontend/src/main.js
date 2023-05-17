import { config, UI, showPopup, sort } from './init.js';
import { registeredPlayers } from './registration.js';
import { startTournament } from './counts.js';
import { updateLeaderboard } from './leaderboard.js';
import './welcome.js';
import './tracks.js';



UI.startTournamentBtn.onclick = () => {
    if (registeredPlayers.length < 2) return;

    const isConfirm = window.confirm('Registration will be terminated. Continue?');

    if (isConfirm) {
        startTournament(registeredPlayers);

        UI.tournament.block.style.display = 'block';
        UI.settings.block.style.display = 'none';
    }

}

UI.finishTournamentBtn.onclick = () => {
    const isConfirm = window.confirm('Finish the tournament?');

    if (isConfirm) {
        const sortedPlayers = sort(JSON.parse(localStorage.RegisteredPlayersPoints));

        fetch(config.apiURI + '/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sortedPlayers)
        })
        .then(res => {
            if (res.status === 200) {

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
	            showPopup(true , 'Error push!');
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
            if (localStorage.Tracks.split(',').length > 2) {
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