import { config, UI, showPopup } from './init.js';

const defaultText = `:trophy: **Стартует новый турнир!**\nНиже будет табло турнирных трасс и табло игроков допущенных к турниру.\n:warning: Следите за их состоянием: они будут обновляться до начала турнира!\n:trophy: **A new tournament is starting!**\nThe board of the tournament tracks and the board of the players admitted to the tournament will be shown below.\n:warning: Keep an eye on their status: they will be updated before the start of the tournament! `;

UI.settings.welcome.textarea.value = defaultText;

UI.settings.welcome.textarea.oninput = function() {
    // at least 10 characters
    UI.settings.welcome.pushBtn.disabled = (this.value.length < 10) ? true : false;
}

UI.settings.welcome.pushBtn.onclick = () => {
    if (!UI.settings.welcome.textarea.value) return;

    fetch(config.apiURI + '/welcome', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: UI.settings.welcome.textarea.value})
    })
    .then(res => {
        console.log(res.status);
        if (res.ok && res.status === 200){
            showPopup(true, 'Welcome pushed!');
        }
        else {
            showPopup(false, 'Error push!');
        }
    })
    .catch(err => {
        console.log(err);
    });
}
