const { SlashCommandBuilder } = require('discord.js');
const { TempRooms, VoiceActivity, VoiceState } = require('../../../database/models/mucherooDB');
const { boostRoomControl } = require('../../../components/boostSystem/boostCommand');

const embedHandler = require('../../../components/voiceRooms/embeds');

module.exports = {
    deferred: false,
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
        .addSubcommand((subcommand) =>
            subcommand
                .setName('spent')
                .setDescription('Время проведенное в голосовых комнатах')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите пользователя')
                        .setRequired(false)))
        .setDMPermission(false),
    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        const member = await interaction.options.getMember('member') ? await interaction.options.getMember('member') : interaction.member;

        if (command === 'spent') {
            const voiceState = await VoiceState.findOne({ where: { userID: member.id } });
            const voiceActivity = await VoiceActivity.findOne({ where: { userID: member.id } });

            if (!voiceState || !voiceActivity) {
                return await interaction.reply({ content: `Похоже участник **${member.displayName}** ещё не был в голосовой комнате...😥`, ephemeral: true });
            }

            return await interaction.reply({ embeds: [embedHandler.voiceTimeSpent(voiceState, voiceActivity, member)], ephemeral: true });
        }

        if (command === 'boost') {
            return await boostRoomControl(interaction);
        }

        if (!member || member.user.bot || member.id === interaction.member.id) {
            return interaction.reply({ embeds: [embedHandler.notCorrectUser()], ephemeral: true });
        }

        if (!interaction.member.voice.channel && command !== 'boost') {
            return interaction.reply({ embeds: [embedHandler.notInVoice()], ephemeral: true });
        }

        const tempRoomRow = await TempRooms.findOne({ where: { userID: interaction.member.id } });
        if (!tempRoomRow && command !== 'boost') {
            return interaction.reply({ embeds: [embedHandler.notOwner()], ephemeral: true });
        }

        switch (command) {
            case 'access':
                const action = interaction.options.getString('action') === 'true';
                const messageReply = action ? 'открыли' : 'закрыли';

                await interaction.member.voice.channel.permissionOverwrites.edit(member, { Connect: action });
                return interaction.reply({ embeds: [embedHandler.lockOrOpenRoom(messageReply, member.id)], ephemeral: true });
            case 'owner':
                await TempRooms.update({ userID: member.id }, { where: { userID: interaction.user.id } });
                return interaction.reply({ embeds: [embedHandler.transferRoom(member.id)], ephemeral: true });
        }
    },
};
