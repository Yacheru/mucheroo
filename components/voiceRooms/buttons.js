const { ButtonStyle, ButtonBuilder, ActionRowBuilder, Collection, userMention } = require('discord.js');
const { tempRooms, tempRoomsTemplate } = require('../../database/models/mucherooDB');
const { tmpvoiceIcons } = require('../../config.json');

const embedHandler = require('./embeds');

const privateCollection = new Collection();
const hideCollection = new Collection();

module.exports = {
    voiceRoomsButtonsRowFirst: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('upslot')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.upslot)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('hide')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.hide)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('private')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.private)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('voice')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.voice)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('templateButton')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.template)
				.setStyle(ButtonStyle.Secondary),
		);
	}, voiceRoomsButtonsRowSecond: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('downslot')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.downslot)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('limit')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.limit)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('name')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.name)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('info')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.info)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setCustomId('more')
				.setLabel(' ')
				.setEmoji(tmpvoiceIcons.more)
				.setStyle(ButtonStyle.Primary),
		);
	}, createTemplateButton: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('createTemplate')
				.setLabel('Создать')
				.setStyle(ButtonStyle.Success),
			new ButtonBuilder()
				.setCustomId('cancelTemplate')
				.setLabel('Отмена')
				.setStyle(ButtonStyle.Secondary),
		);
	}, deleteTemplateButton: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('deleteTemplate')
				.setLabel('Удалить')
				.setStyle(ButtonStyle.Danger),
		);
	}, deleteTemplateButtonCallback: async function(interaction) {
		await tempRoomsTemplate.destroy({ where: { userID: interaction.member.id } });
		return interaction.update({ ephemeral: true, embeds: [embedHandler.deleteTemplateSuccess()], components: [] });
	}, cancelTemplatecallback: function(interaction) {
		return interaction.update({ embeds: [embedHandler.cancelCreateTemplate()], ephemeral: true, components: [] });
	}, createTemplateSuccessCallback: async function(interaction) {
		const voiceChannel = interaction.member.voice.channel;
		await tempRoomsTemplate.create({ userID: interaction.member.id, channelLimit: voiceChannel.userLimit, channelName: voiceChannel.name, channelBitrate: voiceChannel.bitrate });
		return interaction.update({ embeds: [embedHandler.createTemplateSuccess()], ephemeral: true, components: [] });
	}, voiceRoomsUpslotCallback: function(interaction) {
		if (interaction.member.voice.channel.userLimit === 99) return interaction.reply({ embeds: [embedHandler.maxLimit()], ephemeral: true });
		interaction.member.voice.channel.edit({ userLimit: interaction.member.voice.channel.userLimit + 1 });
		return interaction.reply({ embeds: [embedHandler.newLimit()], ephemeral: true });
	}, voiceRoomsHideCallback: function(interaction) {
		const memberChannelId = interaction.member.voice.channel.id;

		if (!hideCollection.has(memberChannelId)) {
			hideCollection.set(memberChannelId, 'unhide');
		}

		interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: hideCollection.get(memberChannelId) !== 'unhide' });

		const replyMessage = hideCollection.get(memberChannelId) === 'unhide' ? 'скрыта' : 'раскрыта';
		interaction.reply({ embeds: [embedHandler.hideChannel(replyMessage)], ephemeral: true });

		hideCollection.set(memberChannelId, hideCollection.get(memberChannelId) === 'unhide' ? 'hide' : 'unhide');
	}, voiceRoomsPrivateCallback: async function(interaction) {
		const memberChannelId = interaction.member.voice.channel.id;
		const tempRoomRow = await tempRooms.findOne({ where: { channelID: memberChannelId } });

		if (tempRoomRow.adminRoom) return interaction.reply({ embeds: [embedHandler.noOpenAdminRoom()], ephemeral: true });

		if (!privateCollection.has(memberChannelId)) {
			privateCollection.set(memberChannelId, 'open');
		}

		await interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
			Connect: privateCollection.get(memberChannelId) !== 'open',
		});

		const replyMessage = privateCollection.get(memberChannelId) === 'open' ? 'закрыта' : 'открыта';
		interaction.reply({ embeds: [embedHandler.privateChannel(replyMessage)], ephemeral: true });

		privateCollection.set(memberChannelId, privateCollection.get(memberChannelId) === 'open' ? 'closed' : 'open');
	}, voiceRoomsDownslotCallback: function(interaction) {
		if (interaction.member.voice.channel.userLimit === 0) return interaction.reply({ embeds: [embedHandler.minLimit()], ephemeral: true });

		interaction.member.voice.channel.edit({ userLimit: interaction.member.voice.channel.userLimit - 1 });
		interaction.reply({ embeds: [embedHandler.newLimit()], ephemeral: true });
	}, voiceRoomsInfoCallback: async function(interaction) {
		const tempRoomRow = await tempRooms.findOne({ where: { channelID: interaction.member.voice.channel.id } });
		const adminRoom = tempRoomRow.adminRoom ? 'Да' : 'Нет';
		const templateRoom = tempRoomRow.templateRoom ? 'Да' : 'Нет';
		const channel = interaction.member.voice.channel;

		const membersArray = [];
		interaction.member.voice.channel.members.forEach((member) => {
			membersArray.push(`- ${userMention(member.id)} ${tempRoomRow.userID === member.id ? tmpvoiceIcons.owner : ' '}\n`);
		});

		return interaction.reply({ embeds: [embedHandler.infoChannel(channel, interaction.member.displayAvatarURL(), tempRoomRow.userID, adminRoom, templateRoom, membersArray)], ephemeral: true });
	}, voiceRoomsTemplateCallback: async function(interaction) {
		const ownTemplateRow = await tempRoomsTemplate.findOne({ where: { userID: interaction.member.id } });
		const voiceChannel = interaction.member.voice.channel;

		return interaction.reply({ embeds: [embedHandler.haveOrCreateTemplate(interaction.member, ownTemplateRow, voiceChannel)], components: [ownTemplateRow ? this.deleteTemplateButton() : this.createTemplateButton()], ephemeral: true });
	}, voiceRoomsMoreCallback: function(interaction) {
		return interaction.reply({ embeds: [embedHandler.tempRoomsInfo()], ephemeral: true });
	},
};
