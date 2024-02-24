const { SlashCommandBuilder, userMention, channelMention } = require('discord.js');
const { tempRooms } = require('../../../database/models/mucherooDB');
const { boostRoomControl } = require('../../../components/boostSystem/boostCommand');
const { channels } = require('../../../config.json');

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

        if (!member || member.user.bot || member.id === interaction.member.id) {
            return interaction.reply({ content: 'Некорректный пользователь.', ephemeral: true });
        }

        if (!interaction.member.voice.channel && command !== 'boost') {
            return interaction.reply({ content: `Создайте личную комнату для взаимодействия с командой - ${channelMention(channels.newChannelCreater)}`, ephemeral: true });
        }

        if (!tempRoomRow && command !== 'boost') {
            return interaction.reply({ content: 'Вы не являетесь создателем комнаты!', ephemeral: true });
        }

        switch (command) {
            case 'access':
                const action = interaction.options.getString('action') === 'true';
                const messageReply = action ? 'открыли' : 'закрыли';

                interaction.member.voice.channel.permissionOverwrites.edit(member, { Connect: action });
                return interaction.reply({ content: `Вы успешно ${messageReply} комнату пользователю ${userMention(member.id)}`, ephemeral: true });
            case 'owner':
                await tempRooms.update({ userID: member.id }, { where: { userID: interaction.user.id } });
                return interaction.reply({ content: `Вы успешно передали владение комнатой пользователю ${userMention(member.id)}`, ephemeral: true });
            case 'boost':
                return await boostRoomControl(interaction);
        }
    },
};
