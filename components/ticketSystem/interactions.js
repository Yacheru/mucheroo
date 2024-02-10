const { errorLogger } = require('../../logs/logger');

const modalHandler = require('./modal.js');
const buttonHandler = require('./buttons.js');

module.exports = {
    ticketSystemButtonInteraction: function(interaction) {
        switch (interaction.customId) {
            case 'player':
                return interaction.showModal(modalHandler.createPlayerModal());
            case 'questions':
                return interaction.showModal(modalHandler.createQuestionsModal());
            case 'closeTicket':
                return buttonHandler.closeTicketButtonCallback(interaction);
            case 'deleteTicket':
                return buttonHandler.deleteTicketButtonCallback(interaction);
            default:
                return errorLogger.error(`[TICKET-SYSTEM] [BUTTONS] ID (${interaction.customId}) компонента не найден!`);
        }
    },
    ticketSystemModalInteraction: function(interaction) {
        switch (interaction.customId) {
            case 'playerModal':
                return modalHandler.handlePlayerModalSubmit(interaction);
            case 'questionsModal':
                return modalHandler.handleQuestionModalSubmit(interaction);
            default:
                return errorLogger.error(`[TICKET-SYSTEM] [MODAL] ID (${interaction.customId}) компонента не найден!`);
        }
    },
};
