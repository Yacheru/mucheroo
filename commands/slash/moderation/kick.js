const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js')
const { channels, icons, transperentImage } = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Исключить пользователя с сервера.')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('Выберите пользователя')
                .setRequired(true)
            )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Причина бана'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const creator = interaction.member;
        const member = interaction.options.getUser('member');
        const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === channels.logschannel);

        const kickEmbed = new EmbedBuilder()
            .setColor('#2f3236')
            .setAuthor({ name: 'Исключение участника', iconURL: icons['ban-kick'] })
            .setThumbnail(creator.displayAvatarURL())
            .addFields(
                { name: 'Исполнитель:', value: `${creator.displayName}\n(${userMention(creator.id)})`, inline: true },
                { name: 'Участник:', value: `${member.displayName}\n(${userMention(member.id)})`, inline: true }
            )
            .addFields({ name: 'Причина:', value: reason })
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setImage(transperentImage)
            .setTimestamp()
        
        await logChannel.send({ embeds: [kickEmbed] });
        await interaction.reply({content: `Пользователь ${member.displayName} успешно исключён по причине: **${reason}**`, ephemeral: true});
        await interaction.guild.members.kick(member, { reason: reason }); 
    }
};