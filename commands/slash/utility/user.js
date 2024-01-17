const { SlashCommandBuilder, EmbedBuilder, roleMention, time } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Выводит информацию о пользователе.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Выберите пользователя.')
            ),
    async execute(interaction) {
        const member = interaction.options.getMember('member') ?? interaction.member;
        const user = interaction.options.getUser('member') ?? interaction.user;
        const guildName = interaction.guild.name;
        const userName = member.displayName;
        const boostAt = time(member.premiumSinceTimestamp, 'R');
        console.log(boostAt);
        const userCreatedAt = `${time(Math.round(user.createdTimestamp / 1000), 'f')}\n(${time(Math.round(user.createdTimestamp / 1000), 'R')})`
        const userJoinedAt = `${time(Math.round(member.joinedTimestamp / 1000), 'f')}\n(${time(Math.round(member.joinedTimestamp / 1000), 'R')})`
        const guildIcon = `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png?size=1024`;
        const userAvatar = member.avatar !== null ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png?size=1024` : 'https://cdn.discordapp.com/embed/avatars/0.png';
        const userRoles = member.roles.cache.size > 1 ? member.roles.cache.filter(role => role.name !== '@everyone').map(role => roleMention(role.id)).join(' ') : 'Пользователь не имеет ролей';
        const firstRoleColor = member.roles.cache.size > 1 ? member.roles.cache.filter(role => role.name !== '@everyone').map(role => role.color)[0].toString(16) : '313338';

        const userEmbed = new EmbedBuilder()
            .setColor(`#${firstRoleColor}`)
            .setTitle('Информация о пользователе')
            .setAuthor({ name: `${userName} ID: ${member.id}`, iconURL: userAvatar, url: userAvatar })
            .setThumbnail(userAvatar)
            .addFields(
                { name: 'Аккаунт создан:', value: userCreatedAt, inline: true },
                { name: 'Присоединился:', value: userJoinedAt, inline: true},
            )
            .addFields({ name: 'Роли на сервере:', value: `${userRoles}` })
            .setTimestamp()
            .setFooter({ text: guildName, iconURL: guildIcon });

        await interaction.reply({
            embeds: [userEmbed],
            ephemeral: true
        });
    },
};