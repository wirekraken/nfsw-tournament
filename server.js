import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import bot from './bot.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 5000;

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
	// res.sendFile(__dirname + '/psdblic/index.html');
})

app.post('/api', (req, res) => {
	console.log(req.body);

	let format = '';
	let i = 1;
	for (const [key, value] of Object.entries(req.body)) {
		format += `**${i++}) ${key}: ${value}**\n`;
	}
	// console.log(format)

	const tournamentChannel = bot.channels.cache.get('1106138987694919802');
	tournamentChannel.send(format);
})


app.listen(PORT, err => {
	err ? console.log(err) : console.log(`Listening ${ PORT }`);
})