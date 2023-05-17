import express from 'express';
import fs from 'fs';
import { client, EmbedBuilder } from './bot.js';

const PORT = 5000;
const channelID = '1107295531060953209';

const app = express();

app.use(express.static('public'));
app.use(express.json());


const embedMessage = new EmbedBuilder();

app.post('/api/regist', (req, res) => {

    const timeAttackIcon = 'https://world-evolved.ru/templates/statistics/images/races/timeattack.png';

    let formatedText = '';
    let position = 1;

    for (const [nickname, points] of Object.entries(req.body)) {
        formatedText += `**${position++}: ${nickname}**  ${points}\n`;
    }

    embedMessage
        .setColor(0x07b5f5)
        .setAuthor({ name: 'КВАЛИФИКАЦИЯ. QUALIFICATION', iconURL: timeAttackIcon })
        .setTitle('Допускаются. Qualified Racers\n')
        .setDescription(formatedText)
        .setTimestamp()
        .setFooter({text: 'Last update'});

    const tournamentChannel = client.channels.cache.get(channelID);


    let regMessageID = '';

    // to save the registration message
    try {
        regMessageID = fs.readFileSync('./message-id', {encoding:'utf8', flag:'r'});
    } catch(e) {}

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
            message.edit({ embeds: [embedMessage] });
        })
    }

    async function getMsgId() {
        const message = await tournamentChannel.send({ embeds: [embedMessage] });
        // console.log(message.id);
        return message.id;
    }

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
})


app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Listening ${PORT}`);
})