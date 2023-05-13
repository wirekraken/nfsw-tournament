const selectorForm = document.querySelector('.count__selector_form');
const racerSelectElems = document.querySelectorAll('.count__selector_form select');
const racerInputElems = document.querySelectorAll('.count__selector_form_racer input[type=number]');
const saveLeaderboard = document.querySelector('#save-leaderboard');
const pushLeaderboard = document.querySelector('#push-leaderboard');
const finishTournament = document.querySelector('#finish-tournament');


// localStorage.RaceNumber = 1;

function tournament(registeredRacers) {

    const racers = {};

    for (const item of registeredRacers) {
        racers[item] = 0;
    }

    for (const item of racerSelectElems) {
        const inputElem = item.parentNode.querySelector('input[type=number]');
        let options = `<option>...</option>`;

        for (const racer of registeredRacers) {
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

            console.log(this.value)
            console.log(this.getAttribute('st'));
            // console.log(item.querySelector('input[type=number]').value)
            racers[this.value] = points;
        }

    }


    saveLeaderboard.onclick = (e) => {
        e.preventDefault();

        if (localStorage.RaceNumber) localStorage.RaceNumber = +localStorage.RaceNumber + 1;
        else localStorage.RaceNumber = 1;

        // fill options after saving
        for (const select of racerSelectElems) {

            const inputElem = select.parentNode.querySelector('input[type=number]');
            inputElem.value = pointsSystem[select.getAttribute('st')];

            let options = `<option>...</option>`;

            for (const racer of registeredRacers) {
                options += `<option>${ racer }</option>`;
            }

            select.innerHTML = options;
        }

        const calculatedObj = {};

        if (localStorage.RegisteredRacersPoint) {
            for (const [key, value] of Object.entries(JSON.parse(localStorage.RegisteredRacersPoint))) {
                calculatedObj[key] = value + racers[key];
            }

            localStorage.RegisteredRacersPoint = JSON.stringify(calculatedObj);

            updateLeaderboard(calculatedObj);

            localStorage.EventRacersPoint = JSON.stringify(racers);

            // reset
            for (const key of Object.keys(racers)) {
                racers[key] = 0;
            }
        } 
        else {
            localStorage.RegisteredRacersPoint = JSON.stringify(racers);
            updateLeaderboard(racers);
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
        const sorted = sort(JSON.parse(localStorage.RegisteredRacersPoint));

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

                registeredRacersTime = {};
                registeredRacers = [];

                for (const item of racerSelectElems) item.innerHTML = '';

                registRacersBlock.style.display = 'inline-block';
                tournamentBlock.style.display = 'none';
                
                console.log(res.status, 'finished');
            }
        });

    }
}



pushLeaderboard.onclick = () => {

    const sorted = sort(JSON.parse(localStorage.RegisteredRacersPoint));

    if (localStorage.EventRacersPoint) {
        const eventRacersPoints = JSON.parse(localStorage.EventRacersPoint);

        for (const [key, value] of Object.entries(sorted)) {
            sorted[key] = [value, '+' + eventRacersPoints[key]];
        }
    }
    else {
        for (const [key, value] of Object.entries(sorted)) {
            sorted[key] = [value, ''];
        }
    }

    fetch('http://localhost:5000/api/event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ RaceNumber: localStorage.RaceNumber, Racers: sorted })
    })
    .then(res => console.log(res.status));

    // console.log('pushed')
}

function updateLeaderboard(racers) {

    const raceNumberElem = document.querySelector('.leaderboard__race-number');
    const racersList = document.querySelector('.leaderboard__list');
    racersList.innerHTML = '';
    raceNumberElem.innerText = 'Race №' + localStorage.RaceNumber;

    if (!racers) return;

    const sorted = sort(racers);

    let pos = 1;
    for (const [key, value] of Object.entries(sorted)) {
        racersList.innerHTML += `
            <div class="leaderboard__list_racer">
                <span class="leaderboard__list_racer-position">${ pos++ }</span>
                <span class="leaderboard__list_racer-nickname">${ key }</span>
                <span class="leaderboard__list_racer-points">${ value }</span>
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