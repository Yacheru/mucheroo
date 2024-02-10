const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, userMention } = require('discord.js');
const { tmpvoiceIcons } = require('../../config.json');
const { tempRoomsTemplate, tempRooms } = require('../../database/models');

module.exports = {
	templateRooms: function() {
		return new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('templateRooms')
				.setPlaceholder('Шаблоны каналов')
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel('Мой шаблон')
						.setValue('ownTemplate')
						.setDescription('Применить собственный шаблон')
						.setEmoji(tmpvoiceIcons.template),
					new StringSelectMenuOptionBuilder()
						.setLabel('Общение')
						.setValue('communicat')
						.setDescription('25 участников, 128 кб/с, открытый канал')
						.setEmoji(tmpvoiceIcons.communicat),
					new StringSelectMenuOptionBuilder()
						.setLabel('Кинотеатр')
						.setValue('cinema')
						.setDescription('Безлимит, 64 кб/с, Говорит только создатель.')
						.setEmoji(tmpvoiceIcons.cinema),
				),
		);
	}, bitrateChange: function() {
		return new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('bitrateChange')
				.setPlaceholder('Качество звука')
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel('Низкое')
						.setValue('24_000')
						.setDescription('24 кб/с.'),
					new StringSelectMenuOptionBuilder()
						.setLabel('Среднее')
						.setValue('64_000')
						.setDescription('64 кб/с.'),
					new StringSelectMenuOptionBuilder()
						.setLabel('Хорошее')
						.setValue('128_000')
						.setDescription('128 кб/с.'),
					new StringSelectMenuOptionBuilder()
						.setLabel('Высшее')
						.setValue('256_000')
						.setDescription('256 кб/с.')
						.setEmoji(tmpvoiceIcons.voiceLeader),
					new StringSelectMenuOptionBuilder()
						.setLabel('Наивысшее')
						.setValue('384_000')
						.setDescription('384 кб/с.')
						.setEmoji(tmpvoiceIcons.boosted),
				),
		);
	}, templateRoomsCallback: async function(interaction) {
		const template = interaction.values[0];
		const voiceRoom = interaction.member.voice.channel;
		const ownTeplateRow = await tempRoomsTemplate.findOne({ where: { userID: interaction.member.id } });

		switch (template) {
			case 'ownTemplate':

				if (ownTeplateRow) {
					voiceRoom.edit({ name: ownTeplateRow.channelName, userLimit: ownTeplateRow.channelLimit, bitrate: interaction.guild.premiumTier > 1 ? ownTeplateRow.channelBitrate : '64_000' });
					await tempRooms.update({ templateRoom: true }, { where: { userID: interaction.member.id } });
					return interaction.reply({ content: 'Комната изменена!', ephemeral: true });
				}
				else {
					return interaction.reply({ content: 'У вас нет созданного шаблона!', ephemeral: true });
				}

			case 'communicat':
				voiceRoom.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true, ViewChannel: true });
				voiceRoom.edit({ userLimit: 25, bitrate: interaction.guild.premiumTier > 1 ? '128_000' : '64_000' });
				await tempRooms.update({ templateRoom: true }, { where: { userID: interaction.member.id } });
				return interaction.reply({ content: 'Комната изменена!', ephemeral: true });
			case 'cinema':
				voiceRoom.edit({ userLimit: 0, bitrate: '64_000' });
				voiceRoom.permissionOverwrites.edit(interaction.member, { Speak: true });
				voiceRoom.permissionOverwrites.edit(interaction.guild.roles.everyone, { Speak: false });
				await tempRooms.update({ templateRoom: true }, { where: { userID: interaction.member.id } });
				return interaction.reply({ content: 'Комната изменена!', ephemeral: true });
		}
	}, bitrateChangeCallback: async function(interaction) {
		const bitrate = interaction.values[0];

		const userBitrate = { '24000': '**24кб/с**', '64000': '**64кб/с**', '128000': '**128кб/с**', '256000': '**256кб/с**', '384000': '**384кб/с**' };
		const bitrateRequirements = { '128_000': 1, '256_000': 2, '384_000': 3 };

		if (bitrateRequirements[bitrate] && interaction.guild.premiumTier !== bitrateRequirements[bitrate]) {
			return interaction.reply({ content: `Сервер не поддерживает данный уровень битрейта! Необходим - ${bitrateRequirements[bitrate]} уровень буста.`, ephemeral: true });
		}

		interaction.member.voice.channel.setBitrate(bitrate)
			.then((channel) =>
				interaction.reply({ content: `Успешно установлено ${channel.bitrate} (${userBitrate[channel.bitrate]})`, ephemeral: true }));
	}, tempRoomsVoiceSelectmenu: async function(interaction) {
		await interaction.deferReply({ content: 'Секундочку...', ephemeral: true });
		const members = interaction.member.voice.channel.members;

		if (members.size === 1) return interaction.editReply({ content: 'Это действие невозможно, потому что в комнате нет никого, кроме вас.', ephemeral: true });

		const tempRoomsVoiceSelectRow = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('tempRoomsVoiceSelect')
				.setPlaceholder('Выберите пользователя')
				.setOptions(members
					.filter((member) => member.id !== interaction.member.id)
					.map((member) => ({
						label: member.displayName,
						value: member.id,
						description: `Нажмите, чтобы выполнить действие с ${member.displayName}`,
						emoji: tmpvoiceIcons.member,
					})),
				),
		);
		await interaction.followUp({ content: 'Выберите пользователя из голосового канала:', components: [tempRoomsVoiceSelectRow], ephemeral: true });
	}, tempRoomsVoiceSelectmenuCallback: async function(interaction) {
		const member = interaction.guild.members.cache.get(interaction.values[0]);

		if (!member) return interaction.reply({ content: 'Не удалось найти пользователя.', ephemeral: true });
		if (!member.voice.channel) return interaction.reply({ content: 'Пользователь не находится в голосовом канале!', ephemeral: true });

		const action = member.voice.serverMute ? false : true;
		const messageReply = member.voice.serverMute ? 'размутил' : 'замутил';

		member.voice.setMute(action, `${interaction.member.displayName} ${messageReply} пользователя в приватной комнате`);
		await interaction.deferUpdate({ content: `Вы успешно ${messageReply}и пользователя ${userMention(member.displayName)}`, ephemeral: true });
	},
};
