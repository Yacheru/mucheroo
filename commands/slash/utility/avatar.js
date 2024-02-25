const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    defered: false,
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Посмотреть аватарку пользователя')
        .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('Укажите пользователя'))
        .setDMPermission(false),
    async execute(interaction) {
        const member = interaction.options.getMember('member') ?? interaction.member;
        const avatarEmbed = new EmbedBuilder()
            .setTitle(member.displayName)
            .setURL(member.displayAvatarURL())
            .setImage(member.displayAvatarURL({ size: 256 }));
        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
