const { channels } = require('../../config.json');
const { moderateEmbed } = require('./embed');


module.exports = {
	unbanMember: async function(interaction) {
		const userId = interaction.options.get('user').value;
		const user = await interaction.client.users.fetch(userId);
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const logChannel = interaction.guild.channels.cache.find((channel) => channel.name === channels['logschannel']);

		const fetchBans = await interaction.guild.bans.fetch();
		const bannedUsers = fetchBans.map((ban) => ban.user.id);

		if (bannedUsers.includes(user.id)) {
			await interaction.guild.members.unban(user.id);
			await interaction.editReply({ content: `Пользователь ${user} был успешно разблокирован!`, ephemeral: true });
			await logChannel.send({ embeds: [moderateEmbed('Разблокировка', reason, user, interaction.member, interaction.guild, 'ban-kick')] });
		}
		else {
			await interaction.editReply({ content: `Пользователь ${user} не найден в списке забаненых!`, ephemera: true });
		}
	},
};
