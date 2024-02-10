const { Events, InteractionType, channelMention } = require('discord.js');
const { channels } = require('../../config.json');
const { tempRooms } = require('../../database/models');
const { errorLogger } = require('../../logs/logger');
const { temprooms, ticketsystem } = require('../../components/customIds.json');

const selectMenuHandler = require('../../handlers/selectMenuHandler');

const { tempRoomsButtonInteraction, tempRoomsModalInteraction, tempRoomsSelectMenuInteraction } = require('../../components/voiceRooms/interactions');
const { ticketSystemButtonInteraction, ticketSystemModalInteraction } = require('../../components/ticketSystem/interactions');


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return errorLogger.error(`[/] Команда с именем ${command.data.name} не найдена!`);

			try {
				if (command.data.name === 'room') {
					const tempRoomRow = await tempRooms.findOne({ where: { userID: interaction.member.id } });

					if (!interaction.member.voice.channel) return interaction.reply({ content: `Создайте личную комнату для взаимодействия с командой - ${channelMention(channels.newChannelCreater)}`, ephemeral: true });
					if (!tempRoomRow) return interaction.reply({ content: 'Вы не являетесь создателем комнаты!', ephemeral: true });

					await command.execute(interaction);
				}
				else {
					await command.execute(interaction);
				}
			}
			catch (error) {
				errorLogger.log(`Ошибка выполнения ${command.data.name}\n${error}`);
			}
		}
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			try {
				await command.autocomplete(interaction);
			}
			catch (error) {
				errorLogger.error(error);
			}
		}
		else if (interaction.isButton()) {
			if (temprooms.privateRoomsButtonsCustomIDs.includes(interaction.customId)) {
				return tempRoomsButtonInteraction(interaction);
			}
			else if (ticketsystem.ticketSystemButtonsCustomIDs.includes(interaction.customId)) {
				return ticketSystemButtonInteraction(interaction);
			}
			else {
				return errorLogger.error(`[BUTTON] ID (${interaction.customId}) компонента не найден ни в одном из компонентов!`);
			}
		}
		else if (interaction.type === InteractionType.ModalSubmit) {
			if (temprooms.privateRoomsModalCustomIDs.includes(interaction.customId)) {
				return tempRoomsModalInteraction(interaction);
			}
			else if (ticketsystem.ticketSystemModalCustomIDs.includes(interaction.customId)) {
				return ticketSystemModalInteraction(interaction);
			}
			else {
				return errorLogger.error(`[MODAL] ID (${interaction.customId}) компонента не найден ни в одном из компонентов!`);
			}
		}
		else if (interaction.isStringSelectMenu()) {
			if (temprooms.privateRoomsSelectMenuCustomIDs.includes(interaction.customId)) {
				return tempRoomsSelectMenuInteraction(interaction);
			}
			else {
				switch (interaction.customId) {
					case 'warnTakeSelect':
						return selectMenuHandler.warnTakeSelectCallback(interaction);
					default:
						return errorLogger.error(`[SELECT-MENU] ID (${interaction.customId}) компонента не найден ни в одном из компонентов!`);
				}
			}
		}
	},
};
