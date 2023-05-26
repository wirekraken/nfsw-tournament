import { UI } from './init.js';
import updateLeaderboard from './leaderboard.js';
import { pointsSystem } from './points.js';


let registeredPlayers = [];


function startTournament(players) {

    localStorage.TournamentActive = true;

    registeredPlayers = players;

    const currentEventPlayers = {};
    const eventPlayersPosition = {};

    for (const nickname of registeredPlayers) currentEventPlayers[nickname] = 0;

    updateLeaderboard(currentEventPlayers);

    for (const selectElem of UI.tournament.counts.selectElems) {
        const inputElem = selectElem.parentNode.querySelector('input[type=number]');
        let options = `<option>...</option>`;

        for (const nickname of registeredPlayers) {
            options += `<option>${ nickname }</option>`;
        }

        selectElem.innerHTML = options;

        // let points = pointsSystem[selectElem.getAttribute('st')];
        let points = JSON.parse(localStorage.PointsSystem)[selectElem.getAttribute('st')];

        inputElem.value = points;

        inputElem.oninput = function() {
            points = +this.value;
            currentEventPlayers[selectElem.value] = points;
        }


        selectElem.onchange = function () {
            for (const select of UI.tournament.counts.selectElems) {
                for (const option of select.children) {
                    if (option.innerText === this.value) {
                        option.style.display = 'none';
                    }
                }
            }

            currentEventPlayers[this.value] = points;
            eventPlayersPosition[this.value] = this.getAttribute('st');
        }

    }


    UI.tournament.counts.saveBtn.onclick = function (e) {
        e.preventDefault();

        localStorage.EventPlayersPosition = JSON.stringify(eventPlayersPosition);

        this.disabled = true;
        UI.tournament.leaderboard.pushBtn.disabled = false;

        localStorage.lastLeaderboardPushed = '0';

        if (localStorage.TrackNumber) {
            localStorage.TrackNumber = +localStorage.TrackNumber + 1;

        }
        else {
            localStorage.TrackNumber = '';
        }
        // fill options after saving
        for (const selectElem of UI.tournament.counts.selectElems) {

            const inputElem = selectElem.parentNode.querySelector('input[type=number]');
            inputElem.value = pointsSystem[selectElem.getAttribute('st')];

            let options = `<option>...</option>`;

            for (const nickname of registeredPlayers) {
                options += `<option>${ nickname }</option>`;
            }

            selectElem.innerHTML = options;
        }

        const calculatedPoints = {};

        if (localStorage.RegisteredPlayersPoints) {
            const players = JSON.parse(localStorage.RegisteredPlayersPoints);

            for (const [nickname, points] of Object.entries(players)) {
                calculatedPoints[nickname] = points + currentEventPlayers[nickname];
            }

            localStorage.RegisteredPlayersPoints = JSON.stringify(calculatedPoints);
            localStorage.EventPlayersPoint = JSON.stringify(currentEventPlayers);
            updateLeaderboard(calculatedPoints);
            // reset
            for (const nickname of Object.keys(currentEventPlayers)) {
                currentEventPlayers[nickname] = 0;
            }
        } 
        else {
            localStorage.RegisteredPlayersPoints = JSON.stringify(currentEventPlayers);
            updateLeaderboard(currentEventPlayers);
        }

        if (localStorage.TrackNumber) {
            if (+localStorage.TrackNumber >= JSON.parse(localStorage.Tracks).length) {
                this.disabled = true;
            }
        }
    }

}


export default startTournament;