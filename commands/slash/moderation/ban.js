const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { logschannel} = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Забанить участника')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Выберите пользователя.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Причина бана.')
                .addChoices(
                    { name: 'Нарушение правил', value: 'Нарушение правил сервера.' },
                    { name: 'Реклама', value: 'Реклама.' },
                    { name: 'Подозрительная активность', value: 'Подозрительная активность пользователя.' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const member = interaction.options.getUser('member');
        const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === logschannel);
        const creator = interaction.member;
        const banEmbed = new EmbedBuilder()
            .setColor('#2f3236')
            .setAuthor({ name: 'Блокировка участника', iconURL: 'https://cdn.discordapp.com/attachments/1129601347352809532/1196352737860919356/hammer-sledge_.png' })
            .setThumbnail(creator.displayAvatarURL())
            .addFields(
                { name: 'Исполнитель:', value: `${creator.displayName}\n(${userMention(creator.id)})`, inline: true },
                { name: 'Участник:', value: `${member.displayName}\n(${userMention(member.id)})`, inline: true }
            )
            .addFields({ name: 'Причина:', value: reason })
            .setTimestamp()
        
        await logChannel.send({ embeds: [banEmbed] })
        await interaction.reply({content: `Пользователь ${member.displayName} успешно забанен по причине: **${reason}**`, ephemeral: true})
        await interaction.guild.members.ban(member, { reason: reason });
    }
};