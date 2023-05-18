import express from 'express';
import fs from 'fs';
import { client, EmbedBuilder } from './bot.js';

const PORT = 5000;
const channelID = '1107295531060953209';
const embedMessage = new EmbedBuilder();

const app = express();

app.use(express.static('public'));
app.use(express.json());


const readFile = src => {
    return new Promise((resolve, reject) => {
        fs.readFile(src, 'utf8', (err, data) => {
            (!err) ? resolve(data) : reject(data);
        })
    })
}

const updateSettings = async (key, value) => {
    const settingsJSON = await readFile('./settings.json');
    const parsed = JSON.parse(settingsJSON);
    parsed[key] = value;
    fs.writeFile('./settings.json', JSON.stringify(parsed), (err) => {
        (err) && console.log(err);
    })
}


app.get('/api/settings', async (req, res) => {
    const settingsJSON = await readFile('./settings.json');
    res.status(200).send(settingsJSON);
})

app.post('/api/settings', (req, res) => {
    updateSettings(req.body.key, req.body.value);
    res.status(200);
})

app.post('/api/regist', async (req, res) => {

    let formatedText = '';
    let position = 1;

    for (const [nickname, points] of Object.entries(req.body)) {
        formatedText += `**${position++}: ${nickname}**  ${points}\n`;
    }

    const timeAttackIconURL = 'https://world-evolved.ru/templates/statistics/images/races/timeattack.png';
    const racingFlagURL = 'https://i.ibb.co/DGgy1sC/flag.png';

    embedMessage
        .setColor(0x368ad9)
        .setAuthor({name: 'КВАЛИФИКАЦИЯ. QUALIFICATION', iconURL: timeAttackIconURL})
        .setTitle('Допускаются. Qualified Racers\n')
        .setDescription(formatedText)
        .setThumbnail(racingFlagURL)
        .setTimestamp()
        .setFooter({text: 'Last update'});

    const tournamentChannel = client.channels.cache.get(channelID);

    let regMessageId = '';

    // to save the registration message
    try {
        regMessageId = await readFile('./message-id');
    } catch (err) {
        console.log(err);
    }

    if (!regMessageId) {
        getMsgId().then(res => {
            regMessageId = res
            fs.writeFile('./message-id', regMessageId, err => {
                (err) && console.log(err);
            })
        });
    }
    else {
        tournamentChannel.messages.fetch(regMessageId).then(message => {
            message.edit({ embeds: [embedMessage] });
        })
    }

    async function getMsgId() {
        const message = await tournamentChannel.send({embeds: [embedMessage]});
        // console.log(message.id);
        return message.id;
    }

    updateSettings('RegisteredPlayersTime', req.body);

    res.status(200).send();
})

app.post('/api/welcome', (req, res) => {

    const tournamentChannel = client.channels.cache.get(channelID);
    tournamentChannel.send(req.body.text);

    res.status(200).send();
})

app.post('/api/event', (req, res) => {

    let formatedText = `:checkered_flag: **Турнирный заезд. Tournament race #${req.body.trackNumber}**\n:triangular_flag_on_post: **${req.body.trackName}**\n`;
    let position = 1;

    for (const [nickname, points] of Object.entries(req.body.players)) {
        formatedText += `  **${position++}** - ${nickname} - **${points[0]}** ${points[1]}:small_orange_diamond:\n`;
    }

    const tournamentChannel = client.channels.cache.get(channelID);
    tournamentChannel.send(formatedText);

    res.status(200).send();
})

app.post('/api/finish', (req, res) => {

    const winner = Object.keys(req.body)[0];

    let formatedText = `:tada: Турнир окончен. Спасибо за участие.\n:trophy: Игрока **${winner}** поздравляем с победой!\n`;
    formatedText += `:tada: The tournament is over. Thank you for participating.\n:trophy: Сongratulations to player **${winner}** on the victory!\n`;
    let position = 1;

    for (const [nickname, points] of Object.entries(req.body)) {
        formatedText += `  **${position++}** - ${nickname} - **${points}** :small_orange_diamond:\n`;
    }

    const tournamentChannel = client.channels.cache.get(channelID);
    tournamentChannel.send(formatedText);

    fs.unlink('./message-id', (err) => {
        res.status(200).send();
    });

    // const defaultSettings = {
    //     RegisteredPlayersTime: {},
    //     Tracks: {},
    //     PointsSystem: {}
    // }

    // clear
    fs.writeFile('./settings.json', JSON.stringify({}), (err) => {
        (err) && console.log(err);
    })
})


app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Listening ${PORT}`);
})