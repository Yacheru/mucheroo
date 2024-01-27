const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { channels, icons, images } = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Снять Тайм-Аут с участника')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Выберите участника')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Причина снятия Тайм-Аута'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute (interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'Причина не указана.';

        if (member.user.bot) return interaction.reply({
            content: `Никакие операции не могут быть выполнены над ботами!`,
            ephemeral: true
        })

        if (member.isCommunicationDisabled()) {
            member.timeout(null)
            interaction.reply({
                content: `C участника ${userMention(member.id)} успешно снято наказание.`,
                ephemeral: true
            })
        } else {
            interaction.reply({
                content: `Участник ${userMention(member.id)} не имеет Тайм-Аута.`,
                ephemeral: true
            })
        }
    }    
}