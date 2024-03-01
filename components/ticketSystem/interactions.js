const buttonHandler = require('./buttons.js');
const modalHandler = require('./modal.js');

const { infoLogger } = require('../../logs/logger');


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
                return infoLogger.error(`[TICKET-SYSTEM] [BUTTONS] ID (${interaction.customId}) компонента не найден!`);
        }
    },
    ticketSystemModalInteraction: function(interaction) {
        switch (interaction.customId) {
            case 'playerModal':
                return modalHandler.handlePlayerModalSubmit(interaction);
            case 'questionsModal':
                return modalHandler.handleQuestionModalSubmit(interaction);
            default:
                return infoLogger.error(`[TICKET-SYSTEM] [MODAL] ID (${interaction.customId}) компонента не найден!`);
        }
    },
};
