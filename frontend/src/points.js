import { UI, showPopup, pushSettings } from './init.js';

let pointsSystem = { 1:12, 2:9, 3:7, 4:5, 5:3, 6:2, 7:1, 8:0 };

if (localStorage.PointsSystem) {
    pointsSystem = JSON.parse(localStorage.PointsSystem);
    updateInputs(pointsSystem);
} 
else {
    updateInputs(pointsSystem);
    localStorage.PointsSystem = JSON.stringify(pointsSystem);
}

function updateInputs(data) {
    UI.settings.pointsSystem.inputsBlock.innerHTML = '';
    for (const [position, points] of Object.entries(data)) {
        UI.settings.pointsSystem.inputsBlock.innerHTML += `
            <div>
                <span>${position}:</span>
                <input type="text" name=${position} value=${points} class="pointsSystemInput">
            </div>
            `;

        for (const input of document.querySelectorAll('.pointsSystemInput')) {
            input.oninput = function() {
                pointsSystem[this.name] = +this.value;
            }
        }
    }
}

UI.settings.pointsSystem.saveBtn.onclick = () => {
    localStorage.PointsSystem = JSON.stringify(pointsSystem);
    showPopup(true, 'Points saved!');
    pushSettings('PointsSystem', pointsSystem);

    UI.settings.pointsSystem.inputsBlock.parentElement.style.background = 'rgba(0,0,0,.155)';
    
    setTimeout(() => {
        UI.settings.pointsSystem.inputsBlock.parentElement.style.background = 'rgba(0,0,0,.1)';
    }, 200);
}

export { pointsSystem, updateInputs };