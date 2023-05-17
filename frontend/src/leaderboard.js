import { config, UI, showPopup, sort } from './init.js';

if (localStorage.lastLeaderboardPushed) {
    if (localStorage.lastLeaderboardPushed === '1') {
        UI.tournament.leaderboard.pushBtn.disabled = true;
        UI.tournament.counts.saveBtn.disabled = false;
    }
    else {
        UI.tournament.leaderboard.pushBtn.disabled = false;
        UI.tournament.counts.saveBtn.disabled = true;
    }
}
else {
    UI.tournament.leaderboard.pushBtn.disabled = true;
}


UI.tournament.leaderboard.pushBtn.onclick = () => {

    const sorted = sort(JSON.parse(localStorage.RegisteredPlayersPoints));

    if (localStorage.EventPlayersPoint) {
        const eventPlayersPoints = JSON.parse(localStorage.EventPlayersPoint);

        for (const [nickname, points] of Object.entries(sorted)) {
            sorted[nickname] = [points, '+' + eventPlayersPoints[nickname]];
        }
    }
    else {
        for (const [nickname, points] of Object.entries(sorted)) {
            sorted[nickname] = [points, ''];
        }
    }

    const tracks = localStorage.Tracks.split(',');
    const trackNumber = +localStorage.TrackNumber;

    fetch(config.apiURI + '/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            trackNumber: trackNumber,
            trackName: tracks[trackNumber -1], 
            players: sorted 
        })
    })
    .then(res => {
        console.log(res.status);
        if (res.status === 200) {
            showPopup(true, 'Event pushed!');
            UI.tournament.leaderboard.pushBtn.disabled = true;

            localStorage.lastLeaderboardPushed = '1';

            if (trackNumber >= tracks.length) {
                UI.tournament.counts.saveBtn.disabled = true;
            }
            else {
                UI.tournament.counts.saveBtn.disabled = false;
            }
        }
        else {
            showPopup(false, 'Error push!');
            UI.tournament.leaderboard.pushBtn.disabled = false;
            UI.tournament.counts.saveBtn.disabled = true;
        }
        
    })
    .catch(err => {
        console.log(err);
    });

}

function updateLeaderboard(players) {

    const trackInfoElem = document.querySelector('.tournament__leaderboard_track-info');
    const playersList = document.querySelector('.tournament__leaderboard_list');
    playersList.innerHTML = '';
    trackInfoElem.innerHTML = '';

    if (!players) return;

    let isLast = '';
    if (localStorage.TrackNumber) {
        if (+localStorage.TrackNumber === localStorage.Tracks.split(',').length) {
            isLast = '<span style="color:rgba(255,50,50,.8)">Last</span>';
            UI.tournament.counts.saveBtn.disabled = true;
        }
    } 
    else {
        localStorage.TrackNumber = 0;        
    }

    const tracks = localStorage.Tracks.split(',');
    const trackNumber = +localStorage.TrackNumber;
    trackInfoElem.innerHTML = `Track #${trackNumber} ${isLast}<br>${tracks[trackNumber -1]}`;

    const sorted = sort(players);

    let position = 1;
    for (const [nickname, points] of Object.entries(sorted)) {
        playersList.innerHTML += `
            <div class="tournament__leaderboard_list_player">
                <span class="tournament__leaderboard_list_player-position">${position++}</span>
                <span class="tournament__leaderboard_list_player-nickname">${nickname}</span>
                <span class="tournament__leaderboard_list_player-points">${points}</span>
            </div>
            `;
    }
}


export { updateLeaderboard };