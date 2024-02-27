const { SlashCommandBuilder, EmbedBuilder, roleMention, time } = require('discord.js');
const { images } = require('../../../config.json');

module.exports = {
    deferred: false,
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Выводит информацию о пользователе')
        .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('Выберите пользователя'))
        .setDMPermission(false),
    async execute(interaction) {
        const member = interaction.options.getMember('member') ?? interaction.member;
        const user = interaction.options.getUser('member') ?? interaction.user;
        const guildName = interaction.guild.name;
        const userName = member.displayName;
        const userCreatedAt = `${time(Math.round(user.createdTimestamp / 1000), 'f')}\n(${time(Math.round(user.createdTimestamp / 1000), 'R')})`;
        const userJoinedAt = `${time(Math.round(member.joinedTimestamp / 1000), 'f')}\n(${time(Math.round(member.joinedTimestamp / 1000), 'R')})`;
        const userRoles = member.roles.cache.size > 1 ? member.roles.cache.filter((role) => role.name !== '@everyone').map((role) => roleMention(role.id)).join(' ') : 'Пользователь не имеет ролей';
        const firstRoleColor = member.displayHexColor;

        const userEmbed = new EmbedBuilder()
            .setColor(firstRoleColor)
            .setTitle('Информация о пользователе')
            .setAuthor({ name: `${userName} ID: ${member.id}`, iconURL: member.displayAvatarURL() })
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                { name: 'Аккаунт создан:', value: userCreatedAt, inline: true },
                { name: 'Присоединился:', value: userJoinedAt, inline: true },
            )
            .setImage(images.transperentImage)
            .addFields({ name: 'Роли на сервере:', value: `${userRoles}` })
            .setTimestamp()
            .setFooter({ text: guildName, iconURL: interaction.guild.iconURL() });

        await interaction.reply({
            embeds: [userEmbed],
            ephemeral: true,
        });
    },
};
