import { UI, showPopup } from './init.js';
import { registeredPlayers } from './registration.js'

UI.settings.tracks.textarea.value = 'Kempton Docks\nIronhorse & Coast\nValley & State\nSouth Fortuna CircUIt\nSeaside Interchange';

if (localStorage.Tracks) {
    const storageTracks = localStorage.Tracks.split(',');
    UI.settings.tracks.textarea.value = '';

    for (let i = 0; i < storageTracks.length; i++) {
        UI.settings.tracks.textarea.value += storageTracks[i]+'\n';
    }
}

UI.settings.tracks.saveBtn.onclick = () => {
    const tracks = UI.settings.tracks.textarea.value.split('\n').filter(e => e !== '');
    localStorage.Tracks = tracks;

    if (tracks.length >= 2 && registeredPlayers.length >= 2) {
        UI.startTournamentBtn.disabled = false;
    }
    else {
        UI.startTournamentBtn.disabled = true;
    }

    UI.settings.tracks.block.style.background = 'rgba(0,0,0,.155)';
    setTimeout(() => {
        UI.settings.tracks.block.style.background = 'rgba(0,0,0,.1)';
    }, 200);

    showPopup(true, 'Saved!');
}
