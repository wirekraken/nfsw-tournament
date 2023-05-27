import fs from 'fs';
import config from './guild-config.js';

import { 
    client, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} from './bot.js';

import { 
    readFile, 
    updateSettings, 
    updateMessage, 
    removeRole, 
    roleHandler 
} from './helpers.js';


const devMode = true;

const welcome = (req, res) => {
    const channel = client.channels.cache.get(config.channelId);

    const addButton = new ButtonBuilder()
        .setCustomId(config.participantRoleId)
        .setLabel('Add me')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(addButton);


    let formatedText = devMode ? '' : `<@&${config.everyoneRoleId}>\n`;
    formatedText += req.body.text;
    formatedText += '\n\nНажмите, если вы хотите получить или убрать роль участника турнира.';
    formatedText += '\nClick if you want to get or remove the role of a tournament participant.';

    channel.send({ content: formatedText, components: [row] });

    client.on('interactionCreate', roleHandler);

    res.status(200).send('success');
}


const tracks = async (req, res) => {
    const channel = client.channels.cache.get(config.channelId);
    const embedMessage = new EmbedBuilder();
    
    let formatedText = '';
    let number = 1;

    for (const track of req.body) {
        formatedText += `**${number++} • ${track}**\n`;
    }

    const sprintIconURL = 'https://world-evolved.ru/templates/statistics/images/races/sprint.png';
    const racingFlagURL = 'https://i.ibb.co/DGgy1sC/flag.png';

    embedMessage
        .setColor(0x368ad9)
        .setAuthor({ name: 'ТРАССЫ. TRACKS', iconURL: sprintIconURL })
        .setDescription(formatedText)
        .setThumbnail(racingFlagURL)
        .setTimestamp()
        .setFooter({text: 'Последнее обновление. Last update                    • '});

    updateMessage('./tracks-message-id', embedMessage, channel);
    updateSettings('Tracks', req.body);

    // console.log(embedMessage)

    res.status(200).send('success!');
}

const regist = async (req, res) => {
    const channel = client.channels.cache.get(config.channelId);
    const embedMessage = new EmbedBuilder();

    let formatedText = '';
    let position = 1;

    for (const [nickname, points] of Object.entries(req.body)) {
        formatedText += `**${position++} • ${nickname}** • ${points}\n`;
    }

    const timeAttackIconURL = 'https://world-evolved.ru/templates/statistics/images/races/timeattack.png';
    const racingFlagURL = 'https://i.ibb.co/DGgy1sC/flag.png';

    embedMessage
        .setColor(0x368ad9)
        .setAuthor({ name: 'КВАЛИФИКАЦИЯ. QUALIFICATION', iconURL: timeAttackIconURL })
        .setTitle('Допускаются. Qualified Racers\n')
        .setDescription(formatedText)
        .setThumbnail(racingFlagURL)
        .setTimestamp()
        .setFooter({text: 'Последнее обновление. Last update                    • '});


    updateMessage('./reg-message-id', embedMessage, channel);
    updateSettings('RegisteredPlayersTime', req.body);

    res.status(200).send('success!');
}

const start = async (req, res) => {
    const channel = client.channels.cache.get(config.channelId);

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

    let formatedText = `<@&${config.participantRoleId}>\n`;
    formatedText += `:alarm_clock: **Турнир начинается!**\n`;
    formatedText += `:loudspeaker: Игрокам: **${players}** срочно зайти в игру!\n`;
    formatedText += `:alarm_clock: **The tournament begins!**\n`;
    formatedText += `:loudspeaker: Players: **${players}** urgently join the game!\n\n`;
    formatedText += `:checkered_flag: **Трассы. Tracks:**\n${tracks}\n`;
    formatedText += `:large_orange_diamond: **Система очков. Points system:**\n${points}\n`;
    formatedText += '_                                      _';

    channel.send(formatedText);
    // console.log(formatedText)

    res.status(200).send('success!');
}


const event = (req, res) => {
    const channel = client.channels.cache.get(config.channelId);

    const body = req.body;

    let formatedText = `:checkered_flag: **Турнирный заезд. Tournament race #${body.trackNumber}** <@&${config.participantRoleId}>\n`;
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

    res.status(200).send('success!');
}


const finish = (req, res) => {
    const channel = client.channels.cache.get(config.channelId);

    const winner = Object.keys(req.body)[0];

    let formatedText = `<@&${config.participantRoleId}>\n`;
    formatedText += `:tada: **Турнир окончен!**\nИгроку **${winner}** вручаем этот кубок :trophy:\n`;
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


    const guild = client.guilds.cache.find(g => g.id === config.guildId);
    const role = guild.roles.cache.get(config.participantRoleId);

    removeRole(guild, role);

    channel.send(formatedText);
    // console.log(formatedText)

    fs.unlink('./reg-message-id', (err) => res.status(200).send());
    fs.unlink('./tracks-message-id', (err) => res.status(200).send());

    // clear
    fs.writeFile('./settings.json', JSON.stringify({}), (err) => {
        (err) && console.log(err);
    })

}


export { welcome, tracks, regist, start, event, finish };