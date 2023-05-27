# nfsw-tournament
## Installing
### Server
In the root directory, create a `bot-config.json` file and put your bot token:
```json
{ "BOT_TOKEN": "<token>" }
```
In the root directory, create a `guild-config.js` file and put put the identification data of your discord guild:
```js
const config = {
    guildId: '',
    channelId: '',
    participantRoleId: '',
    everyoneRoleId: ''
}
export default config;
```

```bash
# installing dependencies
npm install
# start dev server
npm run dev
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