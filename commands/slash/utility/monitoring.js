const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Monitoring } = require('../../../database/models/mucherooDB');

module.exports = {
    deferred: true,
    data: new SlashCommandBuilder()
        .setName('monitoring')
        .setDescription('Добавить сервер в мониторинг')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Добавить сервер в мониторинг')
                .addStringOption((option) =>
                    option
                        .setName('ip')
                        .setDescription('Формат: ip:port')
                        .setRequired(true))
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('Укажите канал')
                        .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Удалить сервер с мониторинга')
                .addStringOption((option) =>
                    option
                        .setName('ip')
                        .setDescription('Формат: ip:port')
                        .setRequired(true)))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');
        const [ip, port] = interaction.options.getString('ip').split(':');

        switch (command) {
            case 'add':
                await Monitoring.create({ channelID: channel.id, guildID: interaction.guild.id, ip: ip, port: port });
                await interaction.editReply({ content: `Мониторинг сервера ${ip}:${port} успешно добавлен!` });
                return;
            case 'remove':
                return await interaction.editReply({ content: 'Ещё в разработке...' });
        }
    },
};
