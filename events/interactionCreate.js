const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js')
const modalHandler = require('../handlers/modalHandlers');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction)  {
        if (interaction.isChatInputCommand()) {;
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`[/] Команда с именем ${interaction.commandName} не найдена!`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.log(`Ошибка выполнения ${command.commandName}`);
                console.log(error);
            }

        } else if (interaction.isButton()) {
            if (interaction.customId === 'player') {
                const playerModal = modalHandler.createPlayerModal();
                interaction.showModal(playerModal);
            }

        } else if (interaction.type === InteractionType.ModalSubmit) {
            modalHandler.handlePlayerModalSubmit(interaction);
        };
    }
};