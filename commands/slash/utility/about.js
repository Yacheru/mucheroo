const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Информация о боте')
        .setDMPermission(false),
    async execute(interaction) {
        const send = await interaction.reply({ content: 'Вычисляем...', ephemeral: true, fetchReply: true });
        const botInfoEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.displayName, iconURL: interaction.client.user.avatarURL() })
            .setThumbnail(interaction.client.user.avatarURL())
            .setDescription('Этот дискорд бот создан, чтобы тихо существовать в фоне сервера, не привлекая излишнего внимания...')
            .setFields(
                { name: 'Задержка', value: `- API: ${interaction.client.ws.ping}мс\n- BOT: ${send.createdTimestamp - interaction.createdTimestamp}мс` },
            )
            .setTimestamp()
            .setFooter({ text: 'developed by yacheru' });

        return interaction.editReply({ embeds: [botInfoEmbed], ephemeral: true });
    },
};
