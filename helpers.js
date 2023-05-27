import fs from 'fs';

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

const updateMessage = async (fileMessageId, messageBody, channel) => {

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

const removeRole = (guild, role) => {
    // removing roles
    guild.members
        .fetch()
        .then((members) => {
            members.forEach(member => {
                member.roles.remove(role);
            })
        })
        .catch(err => console.log('error removing roles!', err));

    return role.name;
}

// tournament participant role selector handler
const roleHandler = async (interaction) => {
    try {
        if (!interaction.isButton()) return;
        await interaction.deferReply({ ephemeral: true });

        const role = interaction.guild.roles.cache.get(interaction.customId);

        if (!role) {
            interaction.editReply({
                content: 'There is no such role!'
            });
            return;
        }

        const hasRole = interaction.member.roles.cache.has(role.id);

        if (hasRole) {
            await interaction.member.roles.remove(role);
            await interaction.editReply(`Роль участника ${role} была удалена.\nThe participant role ${role} has been removed.`);
            return;
        }

        await interaction.member.roles.add(role);
        await interaction.editReply(`Добавлена роль участника ${role}.\nThe participant role ${role} has been added.`);

    } catch (err) {
        console.log(err);
    }

}

export { readFile, updateSettings, updateMessage, removeRole, roleHandler };