const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { channels, icons, transperentImage } = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Снять Тайм-Аут с участника')
}