const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits, channelMention, userMention, EmbedBuilder } = require('discord.js');
const { images, channels } = require('../../config.json');

const buttonsHandler = require('./buttons');

const playerComplaintsThumbnail = 'https://cdn.discordapp.com/attachments/1129601347352809532/1197402491931861023/playerComplaints.png';
const questionThumbnail = 'https://cdn.discordapp.com/attachments/1129601347352809532/1198288820936917023/anotherQuestion.png';

module.exports = {
    createPlayerModal: function() {
		return new ModalBuilder()
			.setCustomId('playerModal')
			.setTitle('Жалоба игрока')
			.setComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('playerLink')
						.setLabel('Ссылка на игрока:')
						.setStyle(TextInputStyle.Short)
						.setPlaceholder('Укажите steam-профиль нарушителя')
						.setRequired(true)
						.setMaxLength(200),
				),
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('proofs')
						.setLabel('Доказательство:')
						.setStyle(TextInputStyle.Short)
						.setPlaceholder('Укажите ссылку на фото/видео доказательство')
						.setRequired(true)
						.setMaxLength(500),
				),
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('brokenRules')
						.setLabel('Что нарушил игрок:')
						.setStyle(TextInputStyle.Paragraph)
						.setPlaceholder('Опишите, что нарушил по вашему игрок')
						.setRequired(true)
						.setMaxLength(2000),
				),
			);
	}, createQuestionsModal: function() {
		return new ModalBuilder()
			.setCustomId('questionsModal')
			.setTitle('По любым вопросам')
			.setComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('question')
						.setLabel('Вопрос:')
						.setStyle(TextInputStyle.Paragraph)
						.setPlaceholder('Напиши ваш вопрос здесь')
						.setRequired(true)
						.setMaxLength(2000),
				),
			);
	}, handlePlayerModalSubmit: async function(interaction) {
		await interaction.deferReply({ content: 'Создание...', ephemeral: true });

		const playerLink = interaction.fields.getTextInputValue('playerLink');
		const proofs = interaction.fields.getTextInputValue('proofs');
		const brokenRules = interaction.fields.getTextInputValue('brokenRules');

		const playerComplaintsEmbed = new EmbedBuilder()
			.setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
			.setTitle('Жалоба на игрока')
			.setImage(images.transperentImage)
			.setThumbnail(playerComplaintsThumbnail)
			.setDescription(`Комментарий заявителя:\n> ${brokenRules}\n\n- **Информация:**\n - ${playerLink} **(нарушитель)**\n - ${proofs} **(доказательство)**`)
			.setFooter({ text: 'Нажмите на кнопку ниже, чтобы закрыть обращение' })
			.setTimestamp();

		const channel = await interaction.guild.channels.create({
			name: `Жалоба〢${interaction.member.displayName}`,
			type: ChannelType.GuildText,
			parent: channels.openTicketCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
					allow: [],
				},
				{
					id: interaction.member.id,
					deny: [],
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
				},
			],
		});
		channel.send({ embeds: [playerComplaintsEmbed], components: [buttonsHandler.closeTicketButton()], pinned: true });
		interaction.followUp({ content: `Проследуйте в канал: ${channelMention(channel.id)}`, ephemeral: true });
	}, handleQuestionModalSubmit: async function(interaction) {
		await interaction.deferReply({ content: 'Создание...', ephemeral: true });

		const question = interaction.fields.getTextInputValue('question');

		const playerComplaintsEmbed = new EmbedBuilder()
			.setAuthor({ name: `${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() })
			.setTitle('Вопрос')
			.setImage(images.transperentImage)
			.setThumbnail(questionThumbnail)
			.setDescription(`Комментарий заявителя:\n> ${question}`)
			.setFooter({ text: 'Нажмите на кнопку ниже, чтобы закрыть обращение' })
			.setTimestamp();

		const channel = await interaction.guild.channels.create({
			name: `Вопрос〢${interaction.member.displayName}`,
			type: ChannelType.GuildText,
			parent: channels.openTicketCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.roles.everyone,
					deny: [PermissionFlagsBits.ViewChannel],
					allow: [],
				},
				{
					id: interaction.member.id,
					deny: [],
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles],
				},
			],
		});
		channel.send({ content: `|| ${userMention(interaction.member.id)} ||`, embeds: [playerComplaintsEmbed], components: [buttonsHandler.closeTicketButton()], pinned: true });
		interaction.followUp({ content: `Проследуйте в канал: ${channelMention(channel.id)}`, ephemeral: true });
	},
};
