const selectorForm = document.querySelector('.tournament__count_selector_form');
const racerSelectElems = document.querySelectorAll('.tournament__count_selector_form select');
const racerInputElems = document.querySelectorAll('.tournament__count_selector_form_racer input[type=number]');
const saveLeaderboard = document.querySelector('#save-leaderboard-btn');
const pushLeaderboard = document.querySelector('#push-leaderboard-bth');
const finishTournament = document.querySelector('#finish-tournament-btn');

// localStorage.TrackNumber = 1;

function tournament(registeredPlayers) {

    const racers = {};

    for (const item of registeredPlayers) {
        racers[item] = 0;
    }
    updateLeaderboard(racers);

    for (const item of racerSelectElems) {
        const inputElem = item.parentNode.querySelector('input[type=number]');
        let options = `<option>...</option>`;

        for (const racer of registeredPlayers) {
            options += `<option>${ racer }</option>`;
        }

        item.innerHTML = options;

        let points = pointsSystem[item.getAttribute('st')];
        inputElem.value = points;

        inputElem.oninput = function() {
            points = +this.value;
            racers[item.value] = points;
        }


        item.onchange = function () {
            for (const select of racerSelectElems) {
                for (const option of select.children) {
                    if (option.innerText === this.value) {
                        option.style.display = 'none';
                    }
                }
            }

            // console.log(this.value)
            // console.log(this.getAttribute('st'));
            // console.log(item.querySelector('input[type=number]').value)
            racers[this.value] = points;
        }

    }


    saveLeaderboard.onclick = (e) => {
        e.preventDefault();

        saveLeaderboard.disabled = true;
        pushLeaderboard.disabled = false;

        localStorage.lastLeaderboardPushed = '0';

        if (localStorage.TrackNumber) {
            localStorage.TrackNumber = +localStorage.TrackNumber + 1;

        }
        else {
            localStorage.TrackNumber = '';
        }
        // fill options after saving
        for (const select of racerSelectElems) {

            const inputElem = select.parentNode.querySelector('input[type=number]');
            inputElem.value = pointsSystem[select.getAttribute('st')];

            let options = `<option>...</option>`;

            for (const racer of registeredPlayers) {
                options += `<option>${ racer }</option>`;
            }

            select.innerHTML = options;
        }

        const calculatedObj = {};

        if (localStorage.RegisteredPlayersPoint) {
            for (const [key, value] of Object.entries(JSON.parse(localStorage.RegisteredPlayersPoint))) {
                calculatedObj[key] = value + racers[key];
            }

            localStorage.RegisteredPlayersPoint = JSON.stringify(calculatedObj);

            updateLeaderboard(calculatedObj);

            localStorage.EventPlayersPoint = JSON.stringify(racers);

            // reset
            for (const key of Object.keys(racers)) {
                racers[key] = 0;
            }
        } 
        else {
            localStorage.RegisteredPlayersPoint = JSON.stringify(racers);
            updateLeaderboard(racers);
        }

        if (+localStorage.TrackNumber >= localStorage.Tracks.split(',').length) {
            saveLeaderboard.disabled = true;
        }

    }

    // clear.onclick = e => {
    //  e.preventDefault();
    //  for (const select of racerSelectElems) {
    //      let options = `<option>...</option>`;
    //      for (const racer of registeredRacers) {
    //          options += `<option>${ racer }</option>`;
    //      }
    //      select.innerHTML = options;
    //  }
    // }
}


finishTournament.onclick = () => {
    const confirm = window.confirm('Finish the tournament?');

    if (confirm) {
        const sorted = sort(JSON.parse(localStorage.RegisteredPlayersPoint));

        fetch('http://localhost:5000/api/finish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sorted)
        })
        .then(res => {
            if (res.status === 200) {

                localStorage.clear();
                updateLeaderboard();
                registeredListBlock.innerHTML = '';
                tracksArea.value = '';

                saveLeaderboard.disabled = false;
                pushRegist.disabled = true;
                startTournament.disabled = true;

                registeredPlayersTime = {};
                registeredRacers = [];

                for (const item of racerSelectElems) item.innerHTML = '';

                settingsBlock.style.display = 'flex';
                tournamentBlock.style.display = 'none';
                pupopStatus(true , 'Finish pushed!')
                console.log(res.status, 'finished');
            }
            else {
                pupopStatus(true , 'Error push!')
            }
        });

    }
}

if (localStorage.lastLeaderboardPushed) {
    if (localStorage.lastLeaderboardPushed === '1') {
        pushLeaderboard.disabled = true;
        saveLeaderboard.disabled = false;
    }
    else {
        pushLeaderboard.disabled = false;
        saveLeaderboard.disabled = true;
    }
}
else {
    pushLeaderboard.disabled = true;
}


pushLeaderboard.onclick = () => {

    const sorted = sort(JSON.parse(localStorage.RegisteredPlayersPoint));

    if (localStorage.EventPlayersPoint) {
        const eventPlayersPoints = JSON.parse(localStorage.EventPlayersPoint);

        for (const [key, value] of Object.entries(sorted)) {
            sorted[key] = [value, '+' + eventPlayersPoints[key]];
        }
    }
    else {
        for (const [key, value] of Object.entries(sorted)) {
            sorted[key] = [value, ''];
        }
    }

    const tracks = localStorage.Tracks.split(',');

    fetch('http://localhost:5000/api/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ TrackNumber: localStorage.TrackNumber, Track: tracks[localStorage.TrackNumber-1], Racers: sorted })
    })
    .then(res => {
        console.log(res.status);
        if (res.status === 200) {
            pupopStatus(true, 'Leaderboard pushed!');
            pushLeaderboard.disabled = true;

            localStorage.lastLeaderboardPushed = '1';

            if (+localStorage.TrackNumber >= localStorage.Tracks.split(',').length) {
                saveLeaderboard.disabled = true;
            }
            else {
                saveLeaderboard.disabled = false;
            }
        } else {
            pupopStatus(false, 'Error push!');
            pushLeaderboard.disabled = false;
            saveLeaderboard.disabled = true;
        }
        
    });

    // console.log('pushed')
}

function updateLeaderboard(racers) {

    const trackInfoElem = document.querySelector('.tournament__leaderboard_track-info');
    const racersList = document.querySelector('.tournament__leaderboard_list');
    racersList.innerHTML = '';
    trackInfoElem.innerHTML = '';

    if (!racers) return;

    let isLast = '';
    if (localStorage.TrackNumber) {
        if (+localStorage.TrackNumber === localStorage.Tracks.split(',').length) {
            isLast = '<span style="color:rgba(255,50,50,.8)">Last</span>';
            saveLeaderboard.disabled = true;
        }
    } 
    else {
        localStorage.TrackNumber = 0;        
    }

    const tracks = localStorage.Tracks.split(',');
    trackInfoElem.innerHTML = `Track # ${localStorage.TrackNumber} ${isLast}<br>${tracks[localStorage.TrackNumber-1]}`;

    const sorted = sort(racers);

    let pos = 1;
    for (const [key, value] of Object.entries(sorted)) {
        racersList.innerHTML += `
            <div class="tournament__leaderboard_list_player">
                <span class="tournament__leaderboard_list_player-position">${ pos++ }</span>
                <span class="tournament__leaderboard_list_player-nickname">${ key }</span>
                <span class="tournament__leaderboard_list_player-points">${ value }</span>
            </div>`;
    }
}

function sort(racers) {
    const sortedObj = {};
    const sorted = Object.entries(racers).sort((a, b) => b[1] - a[1]);
    
    for (let i = 0; i < sorted.length; i++) {
        sortedObj[sorted[i][0]] = sorted[i][1];
    }
    return sortedObj;
}