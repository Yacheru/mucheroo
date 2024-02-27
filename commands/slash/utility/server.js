const { SlashCommandBuilder, EmbedBuilder, Colors, userMention, time, ChannelType } = require('discord.js');
const { roles, images } = require('../../../config.json');

module.exports = {
    deferred: false,
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Выводит информацию о сервере')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.guild.members.fetch();
        const guildVerifLevelsMap = {
            1: 'Низкий',
            2: 'Средний',
            3: 'Высокий',
            4: 'Самый высокий',
        };
        const guildIconUrl = interaction.guild.iconURL();
        const serverOwner = interaction.guild.ownerId;
        const guildVerificationLevel = guildVerifLevelsMap[interaction.guild.verificationLevel];
        const createdAt = `${time(Math.round(interaction.guild.createdTimestamp / 1000), 'f')} / (${time(Math.round(interaction.guild.createdTimestamp / 1000), 'R')})`;
        const textChannelsCount = interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size;
        const voiceChannelsCount = interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size;
        const categoryChannelsCount = interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildCategory).size;
        const channelsCount = `Всего **${interaction.guild.channels.cache.size}** канала\n - Текстовых: **${textChannelsCount}**\n - Голосовых: **${voiceChannelsCount}**\n - Категорий: **${categoryChannelsCount}**`;
        const membersCount = interaction.guild.members.cache.filter((m) => !m.user.bot).size;
        const botCount = interaction.guild.members.cache.filter((m) => m.user.bot).size;
        const userCount = `Всего **${interaction.guild.memberCount}** пользователей\n - Ботов: **${botCount}**\n - Участников: **${membersCount}**`;
        const boosterRoleMembers = interaction.guild.roles.cache.get(roles.booster).members.map((member) => ` - ${userMention(member.id)} - kogdato :)`).join('\n') ?? 'Нет бустеров на сервере';
        const guildBoost = `Уровень: ${interaction.guild.premiumTier} (бустов - ${interaction.guild.premiumSubscriptionCount})\n${boosterRoleMembers}`;

        const serverEmbed = new EmbedBuilder()
            .setColor(Colors.Yellow)
            .setTitle(interaction.guild.name)
            .setURL(guildIconUrl)
            .setThumbnail(guildIconUrl)
            .addFields(
                { name: 'Информация:', value: `- Владалец: ${userMention(serverOwner)} (${serverOwner})\n- Уровень проверки: ${guildVerificationLevel}\n- Создан: ${createdAt}\n- ${channelsCount}` },
                { name: 'Пользователи', value: `- ${userCount}` },
                { name: 'Бустеры', value: `- ${guildBoost}` },
            )
            .setImage(images.transperentImage)
            .setFooter({ text: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({
            embeds: [serverEmbed],
            ephemeral: true,
        });
    },
};
