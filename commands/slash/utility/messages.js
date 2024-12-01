const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Messages } = require('../../../database/models/mucherooDB');

module.exports = {
    deferred: false,
    data: new SlashCommandBuilder()
        .setName('messages')
        .setDescription('Массовое удаление сообщений')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('purge')
                .setDescription('Массовая очистка сообщений')
                .addNumberOption((option) =>
                    option
                        .setName('amount')
                        .setDescription('Количество удаляемых сообщений')
                        .setRequired(true))
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('Укажите канал')))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Снять сообщения с пользователя')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Укажите пользователя')
                        .setRequired(true))
                .addNumberOption((option) =>
                    option
                        .setName('amount')
                        .setDescription('Количество снимаемых сообщений')
                        .setMinValue(1)
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        const amount = interaction.options.get('amount').value;

        switch (command) {
            case 'purge':
                const channel = interaction.options.getChannel('channel') ?? interaction.channel;

                return channel.bulkDelete(amount)
                    .then((messages) => interaction.reply({
                        content: `Успешно удалено **${messages.size}** сообщений`,
                        ephemeral: true,
                    }));
            case 'remove':
                const member = interaction.options.getMember('member');

                const memberRow = await Messages.findOne({ where: { userID: member.id } });

                if (!memberRow) {
                    return await interaction.reply({ content: `Пользователь ${member} не найден!`, ephemeral: true });
                }
                else if (memberRow.count < amount) {
                        return await interaction.reply({ content: `У пользователя ${member} (**${memberRow.count}**) сообщений меньше, чем вы указали!`, ephemeral: true });
                    }
                    else {
                        const newValue = memberRow.count - amount;
                        await memberRow.decrement({ count: amount });
                        return interaction.reply({ content: `Вы успешно сняли **${amount}** сообщений у пользователя ${member}, новое количество сообщений **${newValue}**`, ephemeral: true });
                    }
        }
    },
};
