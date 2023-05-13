import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import config from './bot-config.json' assert { type: 'json'};


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


client.login(config.BOT_TOKEN);


// const prefix = '!';

// client.on('messageCreate', message => {
//     if (message.author.bot) return;
//     if (!message.content.startsWith(prefix)) return;

//     const commandBody = message.content.slice(prefix.length);
//     const args = commandBody.split(' ');
//     const command = args.shift().toLowerCase();

// });

client.on('ready', () => console.log('Bot is online'));

export { client, EmbedBuilder };