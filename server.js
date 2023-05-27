import express from 'express';
import { welcome, tracks, regist, start, event, finish } from './route-handlers.js';
import { readFile, updateSettings } from './helpers.js';

const PORT = 5000;

const app = express();

app.use(express.static('public'));
app.use(express.json());


app.post('/api/welcome', welcome);
app.post('/api/tracks', tracks);
app.post('/api/regist', regist);
app.get('/api/start', start);
app.post('/api/event', event);
app.post('/api/finish', finish);

app.get('/api/settings', async (req, res) => {
    const settingsJSON = await readFile('./settings.json');
    res.status(200).send(settingsJSON);
})

app.post('/api/settings', (req, res) => {
    updateSettings(req.body.key, req.body.value);
    res.status(200).send('settings saved!');
})


app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Listening ${PORT}`);
})