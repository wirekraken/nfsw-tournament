import express from 'express';
import fs from 'fs';
import { client, EmbedBuilder } from './bot.js';

const PORT = 5000;
const channelID = '1107295843746316309';


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

const updateMessage = async (fileMessageId, messageBody) => {
    const channel = client.channels.cache.get(channelID);

    const getMsgId = async () => {
        const message = await channel.send({embeds: [messageBody]});
        return message.id;
    }

    let messageId = '';

    try {
        messageId = await readFile(fileMessageId);
    } catch (err) {
        console.log(err);
    }

    if (!messageId) {
        getMsgId().then(res => {
            messageId = res;
            fs.writeFile(fileMessageId, messageId, err => {
                (err) && console.log(err);
            })
        });
        return;
    }

    channel.messages.fetch(messageId).then(message => {
        message.edit({embeds: [messageBody]});
    })

}


app.get('/api/settings', async (req, res) => {
    const settingsJSON = await readFile('./settings.json');
    res.status(200).send(settingsJSON);
})

app.post('/api/settings', (req, res) => {
    updateSettings(req.body.key, req.body.value);
    res.status(200).send('saved');
})

app.post('/api/welcome', (req, res) => {
    const channel = client.channels.cache.get(channelID);
    channel.send(req.body.text);

    res.status(200).send();
})

app.post('/api/regist', async (req, res) => {

    const embedMessage = new EmbedBuilder();

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
        .setFooter({text: 'Последнее обновление. Last update                    • '});


    updateMessage('./reg-message-id', embedMessage);
    updateSettings('RegisteredPlayersTime', req.body);

    res.status(200).send();
})

app.post('/api/tracks', async (req, res) => {

    const embedMessage = new EmbedBuilder();
    

    let formatedText = '';
    let number = 1;

    for (const track of req.body) {
        formatedText += `**${number++} - ${track}**\n`;
    }

    const sprintIconURL = 'https://world-evolved.ru/templates/statistics/images/races/sprint.png';
    const racingFlagURL = 'https://i.ibb.co/DGgy1sC/flag.png';

    embedMessage
        .setColor(0x368ad9)
        .setAuthor({name: 'ТРАССЫ. TRACKS', iconURL: sprintIconURL})
        .setDescription(formatedText)
        .setThumbnail(racingFlagURL)
        .setTimestamp()
        .setFooter({text: 'Последнее обновление. Last update                    • '});


    updateMessage('./tracks-message-id', embedMessage);
    updateSettings('Tracks', req.body);

    // console.log(embedMessage)

    res.status(200).send();
})

app.get('/api/start', async (req, res) => {
    const channel = client.channels.cache.get(channelID);

    const settingsJSON = await readFile('./settings.json');
    const parsed = JSON.parse(settingsJSON);

    const players = Object.keys(parsed['RegisteredPlayersTime']).join(', ');
    
    let tracks = '';
    let number = 1;
    for (const track of parsed['Tracks']) {
        tracks += `**${number++}** - *${track}* :triangular_flag_on_post:\n`;
    }

    let points = '';
    for (const [position, point] of Object.entries(parsed['PointsSystem'])) {
        points += `${position}: **${point}**:small_orange_diamond:  `;
    }

    let formatedText = `:alarm_clock: **Турнир начинается!**\n`;
    formatedText += `:loudspeaker: Игрокам: **${players}** срочно зайти в игру!\n`;
    formatedText += `:alarm_clock: **The tournament begins!**\n`;
    formatedText += `:loudspeaker: Players: **${players}** urgently join the game!\n\n`;
    formatedText += `:checkered_flag: **Трассы. Tracks:**\n${tracks}\n`;
    formatedText += `:large_orange_diamond: **Система очков. Points system:**\n${points}\n`;

    channel.send(formatedText);
    // console.log(formatedText)

    res.status(200).send();
})


app.post('/api/event', (req, res) => {
    const channel = client.channels.cache.get(channelID);

    const body = req.body;

    let formatedText = `:checkered_flag: **Турнирный заезд. Tournament race #${body.trackNumber}**\n`;
    formatedText += `:triangular_flag_on_post: *${body.trackName}*\n`;
    formatedText += `:chart_with_upwards_trend: Текущая таблица. Current leaderboard\n`;
    
    let position = 1;
    const markers = [':first_place:', ':second_place:', ':third_place:'];

    for (const [nickname, points] of Object.entries(body.players)) {
        const marker = markers[+points.eventPosition -1] || '';
        const currentPoints = `*${points.eventPoints}*:small_orange_diamond:` || '';
        formatedText += `  **${position++}** • **${nickname}**  `;
        formatedText += `•  ${marker}${currentPoints} •  **${points.summaryPoints}**:small_blue_diamond:\n`;
    }

    formatedText += '_                                      _';

    // console.log(formatedText)
    channel.send(formatedText);

    res.status(200).send();
})

app.post('/api/finish', (req, res) => {
    const channel = client.channels.cache.get(channelID);

    const winner = Object.keys(req.body)[0];

    let formatedText = `:tada: **Турнир окончен!**\nИгроку **${winner}** вручаем этот кубок :trophy:\n`;
    formatedText += `:tada: **The tournament is over!**\nTo the player **${winner}** we present this cup :trophy:\n`;
    formatedText += `:pushpin: **Итоговая таблица. Final leaderboard**\n`;
    
    let position = 1;
    const markers = [':trophy:', ':second_place:', ':third_place:'];

    for (const [nickname, points] of Object.entries(req.body)) {
        const marker = markers[position -1] || ':medal:';
        formatedText += `**${position++}** ${marker} • **${nickname}** • **${points}**:small_blue_diamond:\n`;
    }
    formatedText += '\nВсем спасибо за участие! Удачи и до следующего раза!\n';
    formatedText += 'Thank you for participating! Good luck and see you next time!';

    channel.send(formatedText);
    // console.log(formatedText)

    fs.unlink('./reg-message-id', (err) => res.status(200).send());
    fs.unlink('./tracks-message-id', (err) => res.status(200).send());

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