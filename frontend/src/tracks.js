import { UI, showPopup, pushSettings } from './init.js';
import { registeredPlayers } from './registration.js'

UI.settings.tracks.textarea.value = 'Kempton Docks\nIronhorse & Coast\nValley & State\nSouth Fortuna CircUIt\nSeaside Interchange';

if (localStorage.Tracks) {
    const storageTracks = JSON.parse(localStorage.Tracks);
    UI.settings.tracks.textarea.value = '';

    for (const track of storageTracks) {
        UI.settings.tracks.textarea.value += track + '\n';
    }
}
else {
    const tracks = UI.settings.tracks.textarea.value.split('\n');
    localStorage.Tracks = JSON.stringify(tracks);
}

UI.settings.tracks.saveBtn.onclick = () => {
    const tracks = UI.settings.tracks.textarea.value.split('\n').filter(e => e !== '');
    localStorage.Tracks = JSON.stringify(tracks);

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

    pushSettings('Tracks', tracks);
    showPopup(true, 'Saved!');
}
