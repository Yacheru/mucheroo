const { SlashCommandBuilder } = require('discord.js');
const { profileCommand } = require('../../../components/profile/command');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Мой профиль')
        .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('Выберите пользователя'))
        .setDMPermission(false),
    async execute(interaction) {
        await profileCommand(interaction);
    },
};
