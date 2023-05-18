import { UI } from './init.js';
import { removePlayer } from './registration.js';
import { updateInputs } from './points.js';

const updateSettingsUI = (response) => {

    if (response.RegisteredPlayersTime) {
        UI.settings.regist.listBlock.innerHTML = '';

        for (const [nickname, time] of Object.entries(response.RegisteredPlayersTime)) {
            UI.settings.regist.listBlock.innerHTML += `
                <div class="registered_players">
                    <span class="registered_players-nickname">${nickname}</span>
                    <span class="registered_players-time">${time}</span>
                    <input type="button" value="-" class="removePlayerBtn">
                </div>`;
        }

        for (const removePlayerBtn of document.querySelectorAll('.removePlayerBtn')) {
            removePlayerBtn.onclick = function() {removePlayer(this)}
        }


        if (Object.keys(response.RegisteredPlayersTime).length < 2) {
            UI.settings.regist.pushBtn.disabled = true;
            UI.startTournamentBtn.disabled = true;
        }
        else {
            UI.settings.regist.pushBtn.disabled = false;
            if (localStorage.Tracks) {
                if (response.Tracks.length > 2) {
                    UI.startTournamentBtn.disabled = false;
                }
            }
        }
    
    }
    else {
        UI.settings.regist.pushBtn.disabled = true;
        UI.startTournamentBtn.disabled = true;
    }


    if (response.Tracks) {
        UI.settings.tracks.textarea.value = '';

        for (const track of response.Tracks) {
            UI.settings.tracks.textarea.value += track + '\n';
        }
    }

    if (response.PointsSystem) {
        updateInputs(response.PointsSystem);
    }

}

export { updateSettingsUI };