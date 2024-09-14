const { channels } = require('../../configs/config.json');
const { moderateEmbed } = require('./embed');

module.exports = {
	muteMember: async function(interaction) {
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const muteTime = interaction.options.getString('time');
		const timeValues = muteTime.match(/(\d+)([wdhms])/g);
		let timeout = 0;

		if (member.user.bot) return interaction.editReply({ content: 'Никакие операции не могут быть выполнены над ботами!', ephemeral: true });
		if (!timeValues) return interaction.editReply({ content: 'Указан неверный формат времени.', ephemeral: true });

		for (const value of timeValues) {
			const amount = parseInt(value.slice(0, -1));
			const unit = value.slice(-1);
			switch (unit) {
				case 'w':
					timeout += amount * 7 * 24 * 60 * 60 * 1000;
					break;
				case 'd':
					timeout += amount * 24 * 60 * 60 * 1000;
					break;
				case 'h':
					timeout += amount * 60 * 60 * 1000;
					break;
				case 'm':
					timeout += amount * 60 * 1000;
					break;
				case 's':
					timeout += amount * 1000;
					break;
			}
		}

		if (member.isCommunicationDisabled()) return interaction.editReply({ content: 'Участник уже наказан', ephemeral: true });
		if (timeout >= 2_419_200_000) return interaction.editReply({ content: 'Не указывайте 28 дней и более!', ephemeral: true });

		const logChannel = await interaction.guild.channels.cache.find((channel) => channel.name === channels['logschannel']);
		const newTime = new Date(new Date().getTime() + timeout).getTime();

		await logChannel.send({ embeds: [moderateEmbed('Тайм-аут', reason, member, interaction.member, interaction.guild, 'time-out', newTime)] });
		await interaction.editReply({ content: `Пользователь ${member.displayName} успешно наказан по причине: **${reason}**`, ephemeral: true });
		await member.timeout(timeout);
	},
	muteMemberAutocomplete: async function(interaction) {
		const focusedOption = await interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'time') {
			choices = ['Одна неделя: 1w', 'Один день: 1d', 'Один час: 1h', 'Тридцать минут: 30m', 'Шестьдесят секунд: 60s'];
		}

		if (focusedOption.name === 'reason') {
			choices = [
				'Реклама: Реклама сторонних сервисов, сайтов, услуг, серверов и т.д.',
				'Любая подозрительная активность: Подозрительная активность пользователя.',
				'Нарушение правил: Прочие нарушения правил сервера.',
			];
		}

		const filtered = choices.filter((choice) => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice })),
		);
	},
};
