const { ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder, Collection, channelMention, time, userMention } = require('discord.js');
const { tempRooms, tempRoomsTemplate } = require('../../database/models');
const { channels, tmpvoiceIcons } = require('../../config.json');

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
	}, cancelTemplatecallback: function(interaction) {
		return interaction.update({ embeds: [], content: 'Вы успешно отменили запрос на создание комнаты!', ephemeral: true, components: [] });
	}, createTemplateSuccessCallback: async function(interaction) {
		const voiceChannel = interaction.member.voice.channel;
		await tempRoomsTemplate.create({ userID: interaction.member.id, channelLimit: voiceChannel.userLimit, channelName: voiceChannel.name, channelBitrate: voiceChannel.bitrate });
		return interaction.update({ embeds: [], content: 'Ваш шаблон успешно создан!', ephemeral: true, components: [] });
	}, voiceRoomsUpslotCallback: function(interaction) {
		if (interaction.member.voice.channel.userLimit === '99') return interaction.reply({ content: `${tmpvoiceIcons.upslot} Лимит участников достиг максимума!`, ephemeral: true });
		interaction.member.voice.channel.edit({ userLimit: interaction.member.voice.channel.userLimit + 1 });
		return interaction.reply({ content: `${tmpvoiceIcons.upslot} Лимит участников успешно изменен!`, ephemeral: true });
	}, voiceRoomsHideCallback: function(interaction) {
		const memberChannelId = interaction.member.voice.channel.id;

		if (!hideCollection.has(memberChannelId)) {
			hideCollection.set(memberChannelId, 'unhide');
		}

		interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: hideCollection.get(memberChannelId) !== 'unhide' });

		const replyMessage = hideCollection.get(memberChannelId) === 'unhide' ? 'скрыта' : 'раскрыта';
		interaction.reply({ content: `${tmpvoiceIcons.hide} Комната успешно ${replyMessage}!`, ephemeral: true });

		hideCollection.set(memberChannelId, hideCollection.get(memberChannelId) === 'unhide' ? 'hide' : 'unhide');
	}, voiceRoomsPrivateCallback: async function(interaction) {
		const memberChannelId = interaction.member.voice.channel.id;
		const tempRoomRow = await tempRooms.findOne({ where: { channelID: memberChannelId } });

		if (tempRoomRow.adminRoom) return interaction.reply({ content: 'Комнату администратора нельзя открыть публично! Перекиньте пользователя из другого канала или используйте команду </room access:1202279762689806416>', ephemeral: true });

		if (!privateCollection.has(memberChannelId)) {
			privateCollection.set(memberChannelId, 'open');
		}

		interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
			Connect: privateCollection.get(memberChannelId) !== 'open',
		});

		const replyMessage = privateCollection.get(memberChannelId) === 'open' ? 'закрыта' : 'открыта';
		interaction.reply({ content: `${tmpvoiceIcons.private} Комната успешно ${replyMessage}!`, ephemeral: true });

		privateCollection.set(memberChannelId, privateCollection.get(memberChannelId) === 'open' ? 'closed' : 'open');
	}, voiceRoomsDownslotCallback: function(interaction) {
		if (interaction.member.voice.channel.userLimit === '0') return interaction.reply({ content: `${tmpvoiceIcons.downslot} Лимит участников достиг минимума!`, ephemeral: true });

		interaction.member.voice.channel.edit({ userLimit: interaction.member.voice.channel.userLimit - 1 });
		interaction.reply({ content: `${tmpvoiceIcons.downslot} Лимит участников успешно изменен!`, ephemeral: true });
	}, voiceRoomsInfoCallback: async function(interaction) {
		const tempRoomRow = await tempRooms.findOne({ where: { channelID: interaction.member.voice.channel.id } });
		const adminRoom = tempRoomRow.adminRoom ? 'Да' : 'Нет';
		const templateRoom = tempRoomRow.templateRoom ? 'Да' : 'Нет';
		const channel = interaction.member.voice.channel;

		const membersArray = [];
		interaction.member.voice.channel.members.forEach((member) => {
			membersArray.push(`- ${userMention(member.id)} ${tempRoomRow.userID === member.id ? tmpvoiceIcons.owner : '\u200b'}\n`);
		});

		const infoEmbed = new EmbedBuilder()
			.setTitle(`Комната - ${channel.name}`)
			.setThumbnail(interaction.member.displayAvatarURL())
			.setFields(
				{ name: 'Настройки', value: `- Название: ${channel.name}\n- Лимит участников: ${channel.members.size}/${channel.userLimit}\n- Битрейт: ${channel.bitrate}\n- Создана: ${time(channel.createdAt, 'R')}\n- Создатель: ${userMention(tempRoomRow.userID)}\n- Комната администраторов: ${adminRoom}\n- Шаблонная: ${templateRoom}` },
				{ name: 'Участники', value: `${membersArray}` },
			)
			.setTimestamp();

		return interaction.reply({ embeds: [infoEmbed], ephemeral: true });
	}, voiceRoomsTemplateCallback: async function(interaction) {
		const ownTeplateRow = await tempRoomsTemplate.findOne({ where: { userID: interaction.member.id } });

		if (ownTeplateRow) {
			return interaction.reply({ content: 'У вас уже создан шаблон. Вы не можете создать ещё', ephemeral: true });
		}
		else {
			const voiceChannel = interaction.member.voice.channel;
			const createTemplateEmbed = new EmbedBuilder()
				.setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
				.addFields(
					{ name: 'Настройки:', value: `- Название: **${voiceChannel.name}**\n- Лимит участников: **${voiceChannel.userLimit === 0 ? 'Без ограничений' : voiceChannel.userLimit}**\n- Битрейт: **${voiceChannel.bitrate}**` },
				)
				.setThumbnail(interaction.member.displayAvatarURL())
				.setFooter({ text: 'Вы можете предложить другие параметры для хранения в шаблоне - @yacheru', ephemeral: true });

			return interaction.reply({ content: 'У вас нет личных шаблонов. Желаете создать?', embeds: [createTemplateEmbed], ephemeral: true, components: [this.createTemplateButton()] });
		}
	}, voiceRoomsMoreCallback: function(interaction) {
		const moreEmbed = new EmbedBuilder()
			.setFields(
				{ name: 'Про кнопки:', value: `- ${tmpvoiceIcons.upslot} / ${tmpvoiceIcons.downslot} - Данные кнопки изменяют лимит вашей комнаты на 1 в + или -.\n- ${tmpvoiceIcons.hide} - Данная кнопка скрывает/показывает ваш канал в списке каналов.\n- ${tmpvoiceIcons.private} - Данная кнопка открывает/скрывает ваш канал.\n- ${tmpvoiceIcons.voice} - Включить или выключить пользователю в вашей комнате микрофон.\n- ${tmpvoiceIcons.template} - Создать свой шаблон. Потом его можно применить в меню выбора.\n- ${tmpvoiceIcons.limit} - Поможет вам изменить лимит участников комнаты до желаемого.\n- ${tmpvoiceIcons.name} - Используйте, если нужно изменить название своей комнаты.\n- ${tmpvoiceIcons.info} - Узнать информацию о канале в котором вы находитесь.\n- ${tmpvoiceIcons.more} - Вызовет данное осведомительное сообщение вновь.`, inline: false },
				{ name: 'Про меню выбора:', value: `- **Шаблоны каналов** - Предустановленные настройки комнаты. Комнату нельзя изменить кнопками.\n - ${tmpvoiceIcons.template} Мой шаблон - Применяется собственный шаблон.\n - ${tmpvoiceIcons.communicat} Общение - 25 участников, 128 кб/с, открытый канал.\n - ${tmpvoiceIcons.cinema} Кинотеатр - Безлимит, 128кб/с, Говорит только создатель.\n- **Качество звука** - Изменяет bitrate (качество) звука в вашей комнате.\n - 24кб/c - Плохое качество звука.\n - 64кб/с - Аналогично личным звонкам.\n - 128кб/с - Лучше личных звонков.\n - 256кб/с - Очень хорошее качество звука.\n - 384кб/с - Наилучшее качество звука.` },
				{ name: 'Про команды:', value: '- </room access:1202279762689806416> - Запретите или выдайте права на вход в вашу комнату.\n- </room owner:1202279762689806416> - Передайте владение комнатой другому пользователю.' },
				{ name: 'Про каналы:', value: `- ${channelMention(channels.newChannelCreater)} - Основной триггерный канал. При заходе в него вы создадите личную комнату.\n- ${channelMention(channels.newChannelAdminCreater)} - Триггерный канал для администраторов. Проверки или собрания проходят в этих комнатах.` },
			);

		interaction.reply({ embeds: [moreEmbed], ephemeral: true });
	},
};
