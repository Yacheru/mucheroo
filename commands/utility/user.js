const { SlashCommandBuilder, EmbedBuilder, roleMention, time } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Выводит информацию о пользователе.'),
    async execute(interaction) {
        const userCreatedAt = `
            ${time(Math.round(interaction.user.createdTimestamp / 1000), 'f')}
            (${time(Math.round(interaction.user.createdTimestamp / 1000), 'R')})`
        const userJoinedAt = `
            ${time(Math.round(interaction.member.joinedTimestamp / 1000), 'f')}
            (${time(Math.round(interaction.member.joinedTimestamp / 1000), 'R')})`
        const guildName = interaction.guild.name;
        const userName = interaction.user.username;
        const guildIcon = `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png?size=1024`;
        const userAvatar = interaction.user.avatar !== null
            ? `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png?size=1024`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
        const userRoles = interaction.member.roles.cache.filter(role => role.name !== '@everyone').map(role => roleMention(role.id)).join(' ');
        const firstRoleColor = interaction.member.roles.cache.filter(role => role.name !== '@everyone').map(role => role.color)[0].toString(16);

        const userEmbed = new EmbedBuilder()
            .setColor(`#${firstRoleColor}`)
            .setTitle('Информация о пользователе')
            .setAuthor({ name: `${userName} ID: ${interaction.user.id}`, iconURL: userAvatar, url: userAvatar })
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