const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Массовое удаление сообщений')
        .addNumberOption((option) =>
            option
                .setName('amount')
                .setDescription('Количество удаляемых сообщений')
                .setRequired(true))
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('Укажите канал'))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const amount = interaction.options.get('amount').value;
        const channel = interaction.options.getChannel('channel') ?? interaction.channel;

        channel.bulkDelete(amount)
            .then((messages) => interaction.reply({
                content: `Успешно удалено **${messages.size}** сообщений`,
                ephemeral: true,
            }));
    },
};
