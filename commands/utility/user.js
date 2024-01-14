const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Выводит информацию о пользователе.'),
    async execute(interaction) {
        await interaction.reply({content: `Команда вызвана пользователем: <@${interaction.user.id}>, который присоединился к серверу:\n${interaction.member.joinedAt}`, ephemeral: true});
    },
};