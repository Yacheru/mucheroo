const { BoostedMembers } = require('../../database/models/mucherooDB');
const { userMention } = require('discord.js');

module.exports = {
    boostRoomControl: async function(interaction) {
        await interaction.deferReply({ content: 'Проверка...', ephemeral: true });
        const boostedMemberRow = await BoostedMembers.findOne({ where: { userID: interaction.user.id } });
        if (!boostedMemberRow) return interaction.followUp({ content: 'У вас нет личной комнаты, скорее всего вы не бустер сервера!', ephemeral: true });

        const member = interaction.options.getMember('member');
        const action = interaction.options.getString('action') === 'true';
        const channel = interaction.guild.channels.cache.get(boostedMemberRow.channelID);
        const messageReply = action ? 'открыли' : 'закрыли';

        await channel.permissionOverwrites.edit(member, { Connect: action });
        return await interaction.followUp({ content: `Вы успешно **${messageReply}** комнату пользователю ${userMention(member.id)}`, ephemeral: true });
    },
};
