const { EmbedBuilder, Colors, time } = require('discord.js');
const { icons, images } = require('../../configs/config.json');


module.exports = {
    moderateEmbed: function(move, reason, member, creator, guild, emoji, newTime = false) {
        const templateEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: `${move} участника`, iconURL: icons[emoji] })
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                { name: 'Исполнитель:', value: `${creator}\n(${creator.id})`, inline: true },
                { name: 'Участник:', value: `${member}\n(${member.id})`, inline: true },
            )
            .addFields({ name: 'Причина:', value: `- ${reason}` })
            .setFooter({ text: guild.name, iconURL: guild.iconURL() })
            .setImage(images['transperentImage'])
            .setTimestamp();

        if (newTime) {
            return templateEmbed
                .addFields(
                    { name: 'Спадёт:', value: `${time(Math.round(newTime / 1000, 'R'))}` },
                );
        }
        else {
            return templateEmbed;
        }
    },
};
