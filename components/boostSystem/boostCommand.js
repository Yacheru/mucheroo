const { userMention } = require('discord.js');
const { boostedMembers } = require('../../database/models');

module.exports = {
    boostRoomControl: async function(interaction) {
        const boostedMemberRow = await boostedMembers.findOne({ where: { userID: interaction.user.id } });
        if (!boostedMemberRow) return interaction.reply({ content: 'У вас нет личной комнаты, скорее всего вы не бустер сервера!', ephemeral: true });

        const member = interaction.options.getMember('member');
        const action = interaction.options.getString('action') === 'true';
        const channel = await interaction.guild.channels.fetch(boostedMemberRow.channelID);
        const messageReply = action ? 'открыли' : 'закрыли';

        channel.permissionOverwrites.edit(member, { Connect: action });
        return await interaction.reply({ content: `Вы успешно ${messageReply} комнату пользователю ${userMention(member.id)}`, ephemeral: true });
    },
};
