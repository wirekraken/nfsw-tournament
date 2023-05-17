const config = {
    apiURI: 'http://localhost:5000/api'
}

const UI = {
    settings: {
        block: document.querySelector('.settings'),

        welcome: {
            textarea: document.querySelector('.settings__welcome textarea'),
            pushBtn: document.querySelector('#push-welcome-btn')
        },
        regist: {
            addPlayerBtn: document.querySelector('.settings__regist_players_form input[type=submit]'),
            listBlock: document.querySelector('.settings__regist_players_list'),
            pushBtn: document.querySelector('#push-regist-btn'),
        },
        tracks: {
            block: document.querySelector('.settings__tracks_block'),
            textarea: document.querySelector('.settings__tracks_block textarea'),
            saveBtn: document.querySelector('#save-tracks-btn'),
        },
        pointsSystem: {
            inputsBlock: document.querySelector('.settings__points-system_inputs'),
            saveBtn: document.querySelector('#save-points-system-btn')
        }
    },
    tournament: {
        block: document.querySelector('.tournament'),
        counts: {
            selectorForm: document.querySelector('.tournament__count_selector_form'),
            selectElems: document.querySelectorAll('.tournament__count_selector_form select'),
            inputElems: document.querySelectorAll('.tournament__count_selector_form_racer input[type=number]'),
            saveBtn: document.querySelector('#save-leaderboard-btn')
        },
        leaderboard: {
            pushBtn: document.querySelector('#push-leaderboard-bth'),
        }
    },
    startTournamentBtn: document.querySelector('#start-tournament-btn'),
    finishTournamentBtn: document.querySelector('#finish-tournament-btn')
}

const showPopup = (status, statusText) => {
    const color = (status) ? 'rgba(50,255,50,.8)' : 'rgba(255,50,50,.8)';
    // const statusText = (status) ? 'Pushed!' : 'Error push!';
    const styles = `
        padding: 10px;
        font-size: 16px;
        background: ${color};
        position: fixed;
        border-radius: 3px;
        right: 10px;
        top: 10px;
    `;
    const div = document.createElement('div');
    div.innerHTML = `<span style="${styles}">${statusText}</span>`;
    document.body.appendChild(div);

    const ms = (status) ? 1000 : 3000;
    setTimeout(() => document.body.removeChild(div), ms);
}

function sort(players) {
    const sorted = {};
    const sortedByPoints = Object.entries(players).sort((a, b) => b[1] - a[1]);
    
    for (let i = 0; i < sortedByPoints.length; i++) {
        sorted[sortedByPoints[i][0]] = sortedByPoints[i][1];
    }
    return sorted;
}

export { config, UI, showPopup, sort };