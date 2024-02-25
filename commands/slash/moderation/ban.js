const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { channels, icons, images } = require('../../../config.json');

module.exports = {
	defered: false,
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Забанить участника')
		.addUserOption((option) =>
			option
				.setName('member')
				.setDescription('Выберите пользователя')
				.setRequired(true))
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Причина бана')
				.addChoices(
					{ name: 'Нарушение правил', value: 'Нарушение правил сервера.' },
					{ name: 'Реклама', value: 'Реклама.' },
					{ name: 'Подозрительная активность', value: 'Подозрительная активность пользователя.' },
				))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const member = interaction.options.getUser('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const logChannel = interaction.guild.channels.cache.find((channel) => channel.name === channels.logschannel);
		const creator = interaction.member;

		if (member.id === interaction.member.id) return interaction.reply({ content: 'Вы не можете забанить самого себя!', ephemeral: true });
		if (member.id === interaction.client.user.id) return interaction.reply({ content: 'Ну давай без бана меня, по-братски!', ephemeral: true });

		const banEmbed = new EmbedBuilder()
			.setColor('#2f3236')
			.setAuthor({ name: 'Блокировка участника', iconURL: icons['ban-kick'] })
			.setThumbnail(creator.displayAvatarURL())
			.addFields(
				{ name: 'Исполнитель:', value: `${creator.displayName}\n(${userMention(creator.id)})`, inline: true },
				{ name: 'Участник:', value: `${member.displayName}\n(${userMention(member.id)})`, inline: true },
			)
			.addFields({ name: 'Причина:', value: reason })
			.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setImage(images.transperentImage)
			.setTimestamp();

		await logChannel.send({ embeds: [banEmbed] });
		await interaction.reply({ content: `Пользователь ${member.displayName} успешно забанен по причине: **${reason}**`, ephemeral: true });
		await interaction.guild.members.ban(member, { reason: reason });
	},
};
