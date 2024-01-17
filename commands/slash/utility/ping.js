const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Понг.'),
    async execute(interaction) {
        const sent = await interaction.reply({
            content: `Вычисляем...`,
            ephemeral: true,
            fetchReply: true
        });
        interaction.editReply(`Задержка: ${sent.createdTimestamp - interaction.createdTimestamp}мс`);
    },
};