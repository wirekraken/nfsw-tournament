import express from 'express';
import fs from 'fs';
import bot from './bot.js';

const PORT = 5000;
const channelID = '1106138987694919802';

const app = express();

app.use(express.static('public'));
app.use(express.json());


// to save the registration message
let regMessageID = '';

fs.readFile('./message-id', 'utf8', (err, data) => {
    (!err) ? regMessageID = data : console.log(err);
    // console.log('readed', regMessageID)
})


app.post('/api/regist', (req, res) => {
    console.log(req.body);

    let formated = ':stopwatch: **REGISTERED**\n';
    let pos = 1;

    for (const [key, value] of Object.entries(req.body)) {
        formated += `  **${pos++})** ${key} **${value}**\n`;
    }

    const tournamentChannel = bot.channels.cache.get(channelID);

    if (!regMessageID) {
        getMsgId().then(res => {
            regMessageID = res
            fs.writeFile('./message-id', regMessageID, err => {
                if (err) console.log(err);
                // console.log('saved', regMessageID)
            })
        });
    }
    else {
        tournamentChannel.messages.fetch(regMessageID).then(message => {
            message.edit(formated);
        })
    }

    async function getMsgId() {
        const message = await tournamentChannel.send(formated);
        // console.log(message.id);
        return message.id;
    }

    res.status(200).send();
})

app.post('/api/event', (req, res) => {

    let formated = ':small_orange_diamond: **LEADERBOARD** :small_orange_diamond:\n';
    let pos = 1;

    for (const [key, value] of Object.entries(req.body)) {
        formated += `  **${pos++})** ${key} **${value}**\n`;
    }
    // console.log(formated)

    const tournamentChannel = bot.channels.cache.get(channelID);
    tournamentChannel.send(formated);

    res.status(200).send();
})


app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Listening ${ PORT }`);
})