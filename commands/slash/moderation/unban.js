const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { channels, icons, images } = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Разблокировать пользователя на сервере')
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('Укажите ID пользователя')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),  
    async execute (interaction) {
        await interaction.deferReply({ content: 'Поиск...', ephemeral: true });
        const userId = interaction.options.get('user').value;
        const user = await interaction.client.users.fetch(userId);
        
        const fetchBans = await interaction.guild.bans.fetch();
        const bannedUsers = fetchBans.map((ban) => ban.user.id);

        if (bannedUsers.includes(user.id)) {
            interaction.guild.members.unban(user.id);
            interaction.followUp({
                content: `Пользователь ${userMention(user.id)} был успешно разблокирован.`,
                ephemeral: true
            });
        };
    },
};