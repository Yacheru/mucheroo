const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Информация о боте')
        .setDMPermission(false),
    async execute(interaction) {
        const botInfoEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.displayName, iconURL: interaction.client.user.avatarURL() })
            .setThumbnail(interaction.client.user.avatarURL())
            .setDescription('Этот дискорд бот создан, чтобы тихо существовать в фоне сервера, не привлекая излишнего внимания...')
            .setTimestamp()
            .setFooter({ text: 'developed by yacheru' });

        return interaction.reply({ embeds: [botInfoEmbed], ephemeral: true });
    },
};
