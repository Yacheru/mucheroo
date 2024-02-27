const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { channels, icons, images } = require('../../../config.json');

module.exports = {
	deferred: false,
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Исключить пользователя с сервера.')
		.addUserOption((option) =>
			option
				.setName('member')
				.setDescription('Выберите пользователя')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('reason')
				.setDescription('Причина бана'))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false),
	async execute(interaction) {
		const creator = interaction.member;
		const member = interaction.options.getUser('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
		const logChannel = interaction.guild.channels.cache.find((channel) => channel.name === channels.logschannel);

		if (member.id === interaction.member.id) return interaction.reply({ content: 'Вы не можете кикнуть самого себя!', ephemeral: true });
		if (member.id === interaction.client.user.id) return interaction.reply({ content: 'Ну давай без кика меня, по-братски!', ephemeral: true });

		const kickEmbed = new EmbedBuilder()
			.setColor('#2f3236')
			.setAuthor({ name: 'Исключение участника', iconURL: icons['ban-kick'] })
			.setThumbnail(creator.displayAvatarURL())
			.addFields(
				{ name: 'Исполнитель:', value: `${creator.displayName}\n(${userMention(creator.id)})`, inline: true },
				{ name: 'Участник:', value: `${member.displayName}\n(${userMention(member.id)})`, inline: true },
			)
			.addFields({ name: 'Причина:', value: reason })
			.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setImage(images.transperentImage)
			.setTimestamp();

		await logChannel.send({ embeds: [kickEmbed] });
		await interaction.reply({ content: `Пользователь ${member.displayName} успешно исключён по причине: **${reason}**`, ephemeral: true });
		await interaction.guild.members.kick(member, { reason: reason });
	},
};
