const { SlashCommandBuilder, userMention } = require('discord.js');
const { tempRooms } = require('../../../database/models');
const { boostRoomControl } = require('../../../components/boostSystem/boostCommand');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('room')
        .setDescription('Дополнительная настройка вашей комнаты')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('access')
                .setDescription('Запретить или выдать права на вход в вашу комнату')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите пользователя')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('action')
                        .setDescription('Укажите действие над пользователем')
                        .addChoices(
                            { name: 'Запретить', value: 'false' },
                            { name: 'Открыть', value: 'true' },
                        )
                        .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('owner')
                .setDescription('Передать владение комнатой другому пользователю')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите пользователя')
                        .setRequired(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('boost')
                .setDescription('Управление личной комнатой')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите пользователя')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('action')
                        .setDescription('Укажите действие над пользователем')
                        .addChoices(
                            { name: 'Запретить', value: 'false' },
                            { name: 'Открыть', value: 'true' },
                        )
                        .setRequired(true)))
        .setDMPermission(false),
    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        const member = interaction.options.getMember('member');
        const tempRoomRow = await tempRooms.findOne({ where: { userID: interaction.member.id } });

        if (!member) return interaction.reply({ content: 'Не удалось найти указанного пользователя.', ephemeral: true });
        if (member.user.bot) return interaction.reply({ content: 'Не указывайте ботов.', ephemeral: true });
        if (member.id === interaction.member.id) return interaction.reply({ content: 'Не указывайте взаимодействие на себе.', ephemeral: true });

        switch (command) {
            case 'access':
                const action = interaction.options.getString('action') === 'true';
                const messageReply = action ? 'открыли' : 'закрыли';

                if (!interaction.member.voice.channel) return await interaction.reply({ content: `Создайте личную комнату для взаимодействия с командой - ${channelMention(channels.newChannelCreater)}`, ephemeral: true });
                if (!tempRoomRow) return await interaction.reply({ content: 'Вы не являетесь создателем комнаты!', ephemeral: true });

                interaction.member.voice.channel.permissionOverwrites.edit(member, { Connect: action });
                return interaction.followUp({ content: `Вы успешно ${messageReply} комнату пользователю ${userMention(member.id)}`, ephemeral: true });
            case 'owner':

                if (!interaction.member.voice.channel) return await interaction.reply({ content: `Создайте личную комнату для взаимодействия с командой - ${channelMention(channels.newChannelCreater)}`, ephemeral: true });
                if (!tempRoomRow) return await interaction.reply({ content: 'Вы не являетесь создателем комнаты!', ephemeral: true });

                await tempRooms.update({ userID: member.id }, { where: { userID: interaction.user.id } });
                return interaction.followUp({ content: `Вы успешно передали владение комнатой пользователю ${userMention(member.id)}`, ephemeral: true });
            case 'boost':
                return await boostRoomControl(interaction);
        }
    },
};
