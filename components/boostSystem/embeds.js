const { EmbedBuilder } = require('discord.js');

module.exports = {
    boostEmbed: function(newMember, boosted, voiceChannel) {
        return new EmbedBuilder()
            .setColor(0xf47fff)
            .setAuthor({ name: newMember.displayName, iconURL: newMember.displayAvatarURL() })
            .setThumbnail(newMember.displayAvatarURL())
            .addFields(
                { name: 'Новые привелегии:', value: `- **Качество звука**\n - Вам доступна возможность ставить качество звука до 384кб/с!\n- **Личная комната**\n - Для вас ${boosted ? 'существует' : 'создана'} личная комната, пока вы бустите сервер - ${voiceChannel}. Управляйте ей с помощью команды: </room boost:1202279762689806416>` },
            )
            .setTimestamp()
            .setFooter({ text: 'Благодарим вас за буст нашего сервера!' });
    },
};
