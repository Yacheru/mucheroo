const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { banMember } = require('../../../components/moderateActions/ban');
const { muteMember, muteMemberAutocomplete } = require('../../../components/moderateActions/mute');
const { unbanMember } = require('../../../components/moderateActions/unban');
const { unmuteMember } = require('../../../components/moderateActions/unmute');
const { kickMember } = require('../../../components/moderateActions/kick');


module.exports = {
    deferred: true,
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('Действия над участниками сервера')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('ban')
                .setDescription('Забанить участника')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите участника')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Причина бана')
                        .addChoices(
                            { name: 'Нарушение правил', value: 'Нарушение правил сервера.' },
                            { name: 'Реклама', value: 'Реклама.' },
                            { name: 'Подозрительная активность', value: 'Подозрительная активность пользователя.' },
                        )))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('unban')
                .setDescription('Разбанить пользователя')
                .addStringOption((option) =>
                    option
                        .setName('user')
                        .setDescription('Укажите ID пользователя')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Причина разблокировки')
                        .setAutocomplete(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('mute')
                .setDescription('Выдать Тайм-аут участнику')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите участника')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('time')
                        .setDescription('Укажите срок выдачи тайм-аута [пример: 1w ; 1d ; 1h ; 10m ; 10s]')
                        .setAutocomplete(true)
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Причина Тайм-Аута')
                        .setAutocomplete(true)))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('unmute')
                .setDescription('Снять Тайм-аут с участника')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите участника')
                        .setRequired(true))
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Причина снятия Тайм-Аута')))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('kick')
                .setDescription('Исключить участника')
                .addUserOption((option) =>
                    option
                        .setName('member')
                        .setDescription('Выберите пользователя')
                        .setRequired(true),
                )
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Причина исключения')))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const command = interaction.options.getSubcommand();

        switch (command) {
            case 'ban':
                return await banMember(interaction);
            case 'unban':
                return await unbanMember(interaction);
            case 'mute':
                return await muteMember(interaction);
            case 'unmute':
                return await unmuteMember(interaction);
            case 'kick':
                return kickMember(interaction);
        }
    },
    async autocomplete(interaction) {
        await muteMemberAutocomplete(interaction);
    },
};
