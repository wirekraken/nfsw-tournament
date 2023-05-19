# nfsw-tournament
## Installing
### Server
In the root directory, create the `bot-config.json` file and put your bot token:
```json
{ "BOT_TOKEN": <token> }
```
In `server.js ` put the ID of the channel to which you want the bot to send messages:
```js
const channelID = '1107295531060953209';
```
```bash
# installing dependencies
npm install
# running
node server.js
```
### Client
If you want to make changes in the web interface, in `./frontend` run:
```bash
# installing dependencies
npm install
# start dev server
npm run dev
# building
npm run build
```
*Note: Don't forget to restart the server after changing:* `node server.js`