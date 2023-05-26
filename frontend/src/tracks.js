import { config, UI, showPopup, pushSettings } from './init.js';
import { registeredPlayers } from './registration.js'

UI.settings.tracks.textarea.value = 'Kempton Docks\nIronhorse & Coast\nValley & State\nSouth Fortuna Circuit\nSeaside Interchange';

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


UI.settings.tracks.pushBtn.onclick = async () => {
    const tracks = UI.settings.tracks.textarea.value.split('\n').filter(e => e !== '');
    localStorage.Tracks = JSON.stringify(tracks);

    await fetch(config.apiURI + '/tracks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tracks)
    })
    .then(res => {
        console.log(res.status);
        if (res.ok && res.status === 200){
            showPopup(true, 'Tracks pushed!');
        }
        else {
            showPopup(false, 'Error push!');
        }
    })
    .catch(err => {
        console.log(err);
    });


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
}
