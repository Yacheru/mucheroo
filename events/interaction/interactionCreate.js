const { Events, InteractionType } = require('discord.js');
const { infoLogger } = require('../../logs/logger');
const { temprooms, ticketsystem } = require('../../components/customIds.json');

const selectMenuHandler = require('../../handlers/selectMenuHandler');

const { tempRoomsButtonInteraction, tempRoomsModalInteraction, tempRoomsSelectMenuInteraction } = require('../../components/voiceRooms/interactions');
const { ticketSystemButtonInteraction, ticketSystemModalInteraction } = require('../../components/ticketSystem/interactions');


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) return infoLogger.error(`[/] Команда с именем ${command.data.name} не найдена!`);

			try {
				await command.execute(interaction);
			}
			catch (error) {
<<<<<<< HEAD
=======
				// await interaction.reply({ content: 'Ошибка при выполнении данной команды!', ephemeral: true });
<<<<<<< HEAD
>>>>>>> 527af869499b76617512b497e1ac1081a283a960
				errorLogger.log(`Ошибка выполнения ${command.data.name}\n${error}`);
=======
				infoLogger.log(`Ошибка выполнения ${command.data.name}\n${error}`);
>>>>>>> 43c92c8594a9d8bc044639896fe9188d5056a93f
			}
		}
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			try {
				await command.autocomplete(interaction);
			}
			catch (error) {
				infoLogger.error(error);
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
				return infoLogger.error(`[BUTTON] ID (${interaction.customId}) компонента не найден ни в одном из компонентов!`);
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
				return infoLogger.error(`[MODAL] ID (${interaction.customId}) компонента не найден ни в одном из компонентов!`);
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
						return infoLogger.error(`[SELECT-MENU] ID (${interaction.customId}) компонента не найден ни в одном из компонентов!`);
				}
			}
		}
	},
};
