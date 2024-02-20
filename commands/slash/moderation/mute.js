const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention, time } = require('discord.js');
const { channels, icons, images } = require('../../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Выдать Тайм-Аут')
		.addUserOption((option) =>
			option
				.setName('member')
				.setDescription('Выберите пользователя')
				.setRequired(true))
		.addStringOption((option) =>
			option
				.setName('time')
				.setDescription('Укажите срок выдачи тайм-аута [пример: 1w ; 1d ; 1h ; 10m ; 10s]')
				.setAutocomplete(true)
				.setRequired(true))
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Причина Тайм-Аута')
				.setAutocomplete(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDMPermission(false),
	async execute(interaction) {
		await interaction.deferReply({ content: 'Пользователь наказывается...', ephemeral: true });
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const muteTime = interaction.options.getString('time');
		const timeValues = muteTime.match(/(\d+)([wdhms])/g);
		let timeout = 0;

		if (member.user.bot) return interaction.followUp({ content: 'Никакие операции не могут быть выполнены над ботами!', ephemeral: true });
		if (!timeValues) return interaction.followUp({ content: 'Указан неверный формат времени.', ephemeral: true });

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

		if (member.isCommunicationDisabled()) return interaction.followUp({ content: 'Участник уже наказан', ephemeral: true });
		if (timeout >= 2_419_200_000) return interaction.followUp({ content: 'Не указывайте 28 дней и более!', ephemeral: true });

		const logChannel = interaction.guild.channels.cache.find((channel) => channel.name === channels.logschannel);
		const creator = interaction.member;
		const newTime = new Date(new Date().getTime() + timeout).getTime();

		const muteEmbed = new EmbedBuilder()
			.setColor('#2f3236')
			.setAuthor({ name: 'Тайм-Аут участника', iconURL: icons['time-out'] })
			.setThumbnail(member.displayAvatarURL())
			.addFields(
				{ name: 'Исполнитель:', value: `${creator.displayName}\n(${userMention(creator.id)})`, inline: true },
				{ name: 'Участник:', value: `${member.displayName}\n(${userMention(member.id)})`, inline: true },
			)
			.addFields(
				{ name: 'Спадёт:', value: `${time(Math.round(newTime / 1000, 'R'))}` },
				{ name: 'Причина:', value: reason },
			)
			.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setImage(images.transperentImage)
			.setTimestamp();

		await logChannel.send({ embeds: [muteEmbed] });
		await interaction.followUp({ content: `Пользователь ${member.displayName} успешно наказан по причине: **${reason}**`, ephemeral: true });
		await member.timeout(timeout);
	},
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
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

		const filterd = choices.filter((choice) => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filterd.map((choice) => ({ name: choice, value: choice })),
		);
	},
};
