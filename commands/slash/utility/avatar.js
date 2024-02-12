const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Посмотреть аватарку пользователя')
        .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('Укажите пользователя'))
        .setDMPermission(false),
    execute(interaction) {
        const member = interaction.options.getMember('member') ?? interaction.member;
        const avatarEmbed = new EmbedBuilder()
            .setTitle(interaction.displayName)
            .setURL(member.displayAvatarURL())
            .setImage(member.displayAvatarURL({ size: 256 }));
        return interaction.reply({ embeds: [avatarEmbed] });
    },
};
