const { Monitoring } = require('../../../database/models/mucherooDB');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { infoLogger } = require('../../../logs/logger');

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
                        .setDescription('Укажите канал. Если не указан, будет использован текущий')
                        .setRequired(false)))
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
        const channel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel') : interaction.channel;
        const [ip, port] = interaction.options.getString('ip').split(':');
        const monitorRow = await Monitoring.findOne({ where: { ip: ip, port: port, guildID: interaction.guild.id } });

        switch (command) {
            case 'add':
                if (monitorRow) {
                    return await interaction.editReply({ content: 'Такой мониторинг уже существует!' });
                }

                const response = await fetch(`https://api.ip.sb/geoip/${ip}`);
                if (!response.ok) {
                    return await interaction.editReply({ content: `Ошибка получения локации сервера: ${response.status}` });
                }

                const json = await response.json();
                const code = json['country_code'];

                await Monitoring.create({ channelID: channel.id, guildID: interaction.guild.id, country_code: code, ip: ip, port: port });
                return await interaction.editReply({ content: `Мониторинг сервера ${ip}:${port} успешно добавлен!` });
            case 'remove':
                if (monitorRow) {
                    return interaction.guild.channels.fetch(monitorRow.channelID)
                        .then((c) => {
                            c.messages.fetch(monitorRow.messageID)
                                .then(async (message) => {
                                    console.log(message);
                                    message.delete();
                                    await monitorRow.destroy();
                                    await interaction.editReply({ content: `Мониторинг ${ip}:${port} успешно удален!` });
                                })
                                .catch(async (error) => {
                                    await interaction.editReply({ content: `Ошибка поиска сообщения: ${error}` });
                                });
                        })
                        .catch(async (error) => {
                            await interaction.editReply({ content: `Ошибка поиска канала: ${error}` });
                        });
                }
                return await interaction.editReply({ content: 'На сервере не зарегистрирован данный игровой сервер!' });
        }
    },
};
