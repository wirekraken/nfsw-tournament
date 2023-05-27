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

export default roleHandler;