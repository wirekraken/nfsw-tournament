import express from 'express';
import fs from 'fs';
import { client, EmbedBuilder } from './bot.js';

const PORT = 5000;
const channelID = '1106138987694919802';

const app = express();

app.use(express.static('public'));
app.use(express.json());


const embed = new EmbedBuilder();

app.post('/api/regist', (req, res) => {

    const timeAttackIcon = 'https://world-evolved.ru/templates/statistics/images/races/timeattack.png'

    // let formated = ':stopwatch: **REGISTERED**\n';
    let formated = '';
    let pos = 1;

    for (const [key, value] of Object.entries(req.body)) {
        formated += `**${pos++}: ${key}**  ${value}\n`;
    }

    embed
        .setColor(0x237987)
        .setAuthor({ name: 'КВАЛИФИКАЦИЯ | QUALIFICATION', iconURL: timeAttackIcon })
        .setTitle('Допускаются | Qualified Racers\n')
        .setDescription(formated)
        .setTimestamp()
        .setFooter({ text: 'Last update' });

    const tournamentChannel = client.channels.cache.get(channelID);


    let regMessageID = '';

    // to save the registration message
    try {
        regMessageID = fs.readFileSync('./message-id', {encoding:'utf8',flag:'r'});
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
            message.edit({ embeds: [embed] });
        })
    }

    async function getMsgId() {
        const message = await tournamentChannel.send({ embeds: [embed] });
        // console.log(message.id);
        return message.id;
    }

    res.status(200).send();
})

app.post('/api/wellcome', (req, res) => {

    const tournamentChannel = client.channels.cache.get(channelID);
    tournamentChannel.send(req.body.Body);

    res.status(200).send();
})

app.post('/api/event', (req, res) => {

    // let formated = ':pushpin: **Турнирная Гонка** | **Tournament Race**\n';
    let formated = `:checkered_flag: **Турнирный заезд** | **Tournament race #${req.body.TrackNumber}**\n${req.body.Track}\n`;
    let pos = 1;

    console.log('body:', req.body)

    for (const [key, value] of Object.entries(req.body.Racers)) {
        formated += `  **${pos++}** - ${key} - **${value[0]}** ${value[1]}:small_orange_diamond:\n`;
    }
    // console.log(formated)

    const tournamentChannel = client.channels.cache.get(channelID);
    tournamentChannel.send(formated);

    res.status(200).send();
})

app.post('/api/finish', (req, res) => {

    let formated = `:tada: Турнир окончен. Спасибо за участие.\n:trophy: Игрока **${Object.keys(req.body)[0]}** поздравляем с победой!\n`;
    formated += `:tada: The tournament is over. Thank you for participating.\n:trophy: Сongratulations to player **${Object.keys(req.body)[0]}** on the victory!\n`;
    let pos = 1;

    for (const [key, value] of Object.entries(req.body)) {
        formated += `  **${pos++}** - ${key} - **${value}** :small_orange_diamond:\n`;
    }
    // console.log(formated)

    const tournamentChannel = client.channels.cache.get(channelID);
    tournamentChannel.send(formated);

    fs.unlink('./message-id', (err) => {
        // console.log('Tournament finished');
        res.status(200).send();
    });
})


app.listen(PORT, err => {
    err ? console.log(err) : console.log(`Listening ${ PORT }`);
})