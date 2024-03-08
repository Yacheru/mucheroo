const { moderateEmbed } = require('./embed');
const { channels } = require('../../config.json');

module.exports = {
	unmuteMember: async function(interaction) {
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const logChannel = await interaction.guild.channels.cache.find((channel) => channel.name === channels['logschannel']);


		if (member.user.bot) return interaction.editReply({ content: 'Никакие операции не могут быть выполнены над ботами!', ephemeral: true });

		if (member.isCommunicationDisabled()) {
			await member.timeout(null);
			await interaction.editReply({ content: `C участника ${member} успешно снято наказание по причине: ${reason}`, ephemeral: true });
			await logChannel.send({ embeds: [moderateEmbed('Снятие тайм-аута с', reason, member, interaction.member, interaction.guild, 'time-out')] });
		}
		else {
			await interaction.editReply({ content: `Участник ${member} не имеет Тайм-Аута.`, ephemeral: true });
		}
	},
};
