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
				if (command.onDeveloped) return interaction.reply({ content: 'Данная команда ещё в разработке...', ephemeral: true });

				await command.execute(interaction);
			}
			catch (error) {
				infoLogger.info(`Ошибка выполнения ${command.data.name}\n${error}`);
				if (command.defered) {
					return interaction.editReply({ content: 'Ошибка при выполении команды!' });
				}
				else {
					return interaction.reply({ content: 'Ошибка при выполении команды!', ephemeral: true });
				}
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
