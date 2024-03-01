const { Monitoring } = require('../../../database/models/mucherooDB');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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
        const monitorRow = await Monitoring.findOne({ where: { ip: ip, port: port, guildID: interaction.guild.id } });

        switch (command) {
            case 'add':
                if (monitorRow) {
                    return await interaction.editReply({ content: 'Такой мониторинг уже существует!' });
                }
                else {
                    await Monitoring.create({ channelID: channel.id, guildID: interaction.guild.id, ip: ip, port: port });
                    await interaction.editReply({ content: `Мониторинг сервера ${ip}:${port} успешно добавлен!` });
                    return;
                }
            case 'remove':

                if (monitorRow) {
                    interaction.guild.channels.cache.get(monitorRow.channelID)
                        .messages.fetch(monitorRow.messageID).then((message) => message.delete());
                    await monitorRow.destroy();
                    return await interaction.editReply({ content: `Мониторинг ${ip}:${port} успешно удален!` });
                }
                else {
                    return await interaction.editReply({ content: 'На сервере не зарегистрирован данный сервер!' });
                }
        }
    },
};
