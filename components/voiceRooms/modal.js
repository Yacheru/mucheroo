const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const embedHandler = require('./embeds');

module.exports = {
	tempRoomsNameModal: function() {
		return new ModalBuilder()
			.setCustomId('nameModal')
			.setTitle('Название комнаты')
			.setComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('nameModalInput')
						.setLabel('Имя:')
						.setStyle(TextInputStyle.Short)
						.setPlaceholder('Введите новое имя здесь')
						.setRequired(true)
						.setMaxLength(60),
				),
			);
	}, tempRoomsLimitModal: function() {
		return new ModalBuilder()
			.setCustomId('limitModal')
			.setTitle('Лимит участников')
			.setComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('limitModalInput')
						.setLabel('Количество:')
						.setStyle(TextInputStyle.Short)
						.setPlaceholder('Введите новое значение здесь')
						.setRequired(true)
						.setMaxLength(2),
				),
			);
	}, tempRoomsLimitModalCallback: function(interaction) {
		const newLimit = interaction.fields.getTextInputValue('limitModalInput');

		function isNumeric(str) {
			return /^\d+$/.test(str);
		}

		if (!isNumeric(newLimit)) return interaction.reply({ embeds: [embedHandler.notCorrectNumber()], ephemeral: true });

		interaction.member.voice.channel.edit({ userLimit: newLimit });
		return interaction.reply({ embeds: [embedHandler.newLimit()], ephemeral: true });
	}, tempRoomsNameModalCallback: function(interaction) {
		const newName = interaction.fields.getTextInputValue('nameModalInput');
		const voiceChannel = interaction.member.voice.channel;
		voiceChannel.setName(newName);
		return interaction.reply({ embeds: [embedHandler.newName()], ephemeral: true });
	},
};
