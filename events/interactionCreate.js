const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js')
const modalHandler = require('../handlers/modalHandlers');
const buttonHandler = require('../handlers/buttonsHandlers')

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
            switch (interaction.customId) {
                case 'player':
                    const playerModal = modalHandler.createPlayerModal();
                    interaction.showModal(playerModal);
                    break
                case 'questions':
                    const questionModal = modalHandler.createQuestionsModal();
                    interaction.showModal(questionModal);
                    break
                case 'closeTicket':
                    buttonHandler.closeTicketButtonCallback(interaction)
                    break
                case 'deleteTicket':
                    buttonHandler.deleteTicketButtonCallback(interaction)
                    break
                default:
                    console.log('ID Компонента не найден!')
                    break
            }

        } else if (interaction.type === InteractionType.ModalSubmit) {
            modalHandler.handlePlayerModalSubmit(interaction);
            modalHandler.handleQuestionModalSubmit(interaction);
        };
    }
};