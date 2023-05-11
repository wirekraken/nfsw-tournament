import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
})


app.listen(PORT, err => {
	err ? console.log(err) : console.log(`Listening ${ PORT }`);
})