const { channels } = require('../../config.json');
const { moderateEmbed } = require('./embed');

module.exports = {
	kickMember: async function(interaction) {
		const member = interaction.options.getUser('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const logChannel = interaction.guild.channels.cache.find((channel) => channel.name === channels['logschannel']);

		if (member.id === interaction.member.id) return interaction.editReply({ content: 'Вы не можете кикнуть самого себя!', ephemeral: true });
		if (member.id === interaction.client.user.id) return interaction.editReply({ content: 'Ну давай без кика меня, по-братски!', ephemeral: true });

		await logChannel.send({ embeds: [moderateEmbed('Исключение', reason, member, interaction.member, interaction.guild, 'ban-kick')] });
		await interaction.editReply({ content: `Пользователь ${member} успешно исключён по причине: **${reason}**`, ephemeral: true });
		await interaction.guild.members.kick(member, { reason: reason });
	},
};
