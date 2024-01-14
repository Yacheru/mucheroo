const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Выводит информацию о сервере.'),
    async execute(interaction) {
        await interaction.reply({
            content: `Сервер называется **${interaction.guild.name}** с ${interaction.guild.memberCount} участниками`, 
            ephemeral: true
        });
    },
};