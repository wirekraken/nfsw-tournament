const pointsSystem = { 1:12, 2:9, 3:7, 4:5, 5:3, 6:2, 7:1, 8:0 };

const startRegistration = document.querySelector('#start-registration');
const startTournament = document.querySelector('#start-tournament-btn');
const registRacersBlock = document.querySelector('.regist-racer');
const tournamentBlock = document.querySelector('.tournament_block');


startRegistration.style.display = 'none';

startRegistration.onclick = function() {
    registRacersBlock.style.display = 'inline-block';
    tournamentBlock.style.display = 'none';
    startRegistration.style.display = 'none';
}

tournamentBlock.style.display = 'none';

const addRacer = document.querySelector('.regist-racer__form input[type=submit]');
const registeredList = document.querySelector('.regist-racer__list');

registeredList.innerHTML = '';

let registeredRacers = [];

// if (localStorage.RegisteredRacers) {
//     const arr = localStorage.RegisteredRacers.split(',');
//     registeredRacers = arr;
//     for (const item of arr) {
//         registeredList.innerHTML += `
//         <div class="registered-racer">
//             <span>${item}</span>
//             <input type="button" value="-" onclick="removeRacer(this)">
//         </div>`;
//     }
// }

addRacer.onclick = (e) => {
    e.preventDefault();

    const newRacerInput = document.querySelector('.regist-racer__form input[type=text]');

    if (!newRacerInput.value) return;

    registeredRacers.push(newRacerInput.value);

    registeredList.innerHTML += `
    <div class="registered-racer">
        <span>${ newRacerInput.value }</span>
        <input type="button" value="-" onclick="removeRacer(this)">
    </div>`;

    console.log(registeredRacers)
    newRacerInput.value = '';
    localStorage.RegisteredRacers = registeredRacers;
}

function removeRacer(thisElem) {
    const nickname = thisElem.parentElement.querySelector('span').innerText;
    thisElem.parentElement.remove();
    registeredRacers = registeredRacers.filter(e => e !== nickname);
    console.log(registeredRacers)
    localStorage.RegisteredRacers = registeredRacers;
}

startTournament.onclick = () => {
    if (registeredRacers.length < 2) return;
    tournamentBlock.style.display = 'block';
    registRacersBlock.style.display = 'none';
    tournament(registeredRacers);
}

if (localStorage.Racers) {
    console.log('yes')
    tournamentBlock.style.display = 'block';
    registRacersBlock.style.display = 'none';
    tournament(registeredRacers);

    updateLeaderboard(JSON.parse(localStorage.Racers));
}


function tournament() {

    // startRegistration.style.display = 'block';

    const selectorForm = document.querySelector('.count__selector_form');
    const racerSelectElems = document.querySelectorAll('.count__selector_form select');
    const racerInputElems = document.querySelectorAll('.count__selector_form_racer input[type=number]');

    let locregisteredRacers = [];
    if (localStorage.RegisteredRacers) {
        locregisteredRacers = localStorage.RegisteredRacers.split(',');
    }

    const racers = {};

    for (const item of locregisteredRacers) {
        racers[item] = 0;
    }

    for (const item of racerSelectElems) {
        const inputElem = item.parentNode.querySelector('input[type=number]');
        let options = `<option>...</option>`;

        for (const racer of locregisteredRacers) {
            options += `<option>${ racer }</option>`;
        }

        console.log(locregisteredRacers)
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


    save.onclick = function(e) {
        e.preventDefault();

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

        if (localStorage.Racers) {
            for (const [key, value] of Object.entries(JSON.parse(localStorage.Racers))) {
                calculatedObj[key] = value + racers[key];
            }
            localStorage.Racers = JSON.stringify(calculatedObj);
            console.log('calc: ', calculatedObj);

            updateLeaderboard(calculatedObj);

            // reset
            for (const key of Object.keys(racers)) {
                racers[key] = 0;
            }
        } 
        else {
            localStorage.Racers = JSON.stringify(racers);

            updateLeaderboard(racers);
       }


    }

    const removeTournament = document.querySelector('#remove-tournament');

    removeTournament.onclick = function() {
        const aut = confirm('Are you sure ?');
        console.log(aut);
        if (aut) {
            localStorage.clear();
            updateLeaderboard();
            registeredList.innerHTML = '';


            registeredRacers = [];
            console.log(registeredRacers)

            for (const item of racerSelectElems) item.innerHTML = '';

            registRacersBlock.style.display = 'inline-block';
            tournamentBlock.style.display = 'none';
            startRegistration.style.display = 'none';
        }
    }


    const pushLeaderboard = document.querySelector('#push-leaderboard');

    pushLeaderboard.onclick = () => {
        console.log(localStorage.Racers)
        fetch('http://localhost:5000/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: localStorage.Racers
        })
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

function sort(racers) {
    const sortedPbj = {};
    const sorted = Object.entries(racers).sort((a, b) => b[1] - a[1]);
    
    for (let i = 0; i < sorted.length; i++) {
        sortedPbj[sorted[i][0]] = sorted[i][1];
    }
    return sortedPbj;
}



function updateLeaderboard(racers) {

    const racersList = document.querySelector('.leaderboard__list');
    racersList.innerHTML = '';

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


// console.log('hello')

// const players = {
//  'OVERKLOCK' : 0,
//  'VANIK' : 0,
//  'UTO4KA' : 0,
//  'ACHILLES' : 0,
//  'VOODOO' : 0,
//  'CORBEN' : 0,
//  'KORBENDAIIAS' : 0,
//  'CUBA77' : 0
// };

