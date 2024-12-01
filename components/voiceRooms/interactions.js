const { TempRooms } = require('../../database/models/mucherooDB');
const { infoLogger } = require('../../logs/logger');

const selectMenuHandler = require('./selectmenu.js');
const modalHandler = require('./modal.js');
const buttonHandler = require('./buttons.js');
const embedHandler = require('./embeds');


module.exports = {
    tempRoomsButtonInteraction: async function(interaction) {
        const privateRoomsNoVoiceCustomIDs = ['upslot', 'hide', 'private', 'access', 'voice', 'downslot', 'limit', 'name', 'owner', 'info', 'templateButton'];

        if (privateRoomsNoVoiceCustomIDs.includes(interaction.customId)) {
            if (!interaction.member.voice.channel) return interaction.reply({ embeds: [embedHandler.notInVoice()], ephemeral: true });

            const tempRoomRow = await TempRooms.findOne({ where: { userID: interaction.user.id } });
            if (!tempRoomRow) return interaction.reply({ embeds: [embedHandler.notOwner()], ephemeral: true });
        }

        switch (interaction.customId) {
            case 'closeTicket':
                return buttonHandler.closeTicketButtonCallback(interaction);
            case 'deleteTicket':
                return buttonHandler.deleteTicketButtonCallback(interaction);
            case 'upslot':
                return buttonHandler.voiceRoomsUpslotCallback(interaction);
            case 'hide':
                return buttonHandler.voiceRoomsHideCallback(interaction);
            case 'private':
                return buttonHandler.voiceRoomsPrivateCallback(interaction);
            case 'voice':
                return selectMenuHandler.tempRoomsVoiceSelectmenu(interaction);
            case 'downslot':
                return buttonHandler.voiceRoomsDownslotCallback(interaction);
            case 'limit':
                return interaction.showModal(modalHandler.tempRoomsLimitModal());
            case 'name':
                return interaction.showModal(modalHandler.tempRoomsNameModal());
            case 'info':
                return buttonHandler.voiceRoomsInfoCallback(interaction);
            case 'templateButton':
                return buttonHandler.voiceRoomsTemplateCallback(interaction);
            case 'createTemplate':
                return buttonHandler.createTemplateSuccessCallback(interaction);
            case 'cancelTemplate':
                return buttonHandler.cancelTemplatecallback(interaction);
            case 'deleteTemplate':
                return buttonHandler.deleteTemplateButtonCallback(interaction);
            case 'more':
                return buttonHandler.voiceRoomsMoreCallback(interaction);
            default:
                return infoLogger.error(`[TEMP-ROOMS] [BUTTONS] ID (${interaction.customId}) компонента не найден!`);
        }
    },
    tempRoomsModalInteraction: function(interaction) {
        switch (interaction.customId) {
            case 'nameModal':
                return modalHandler.tempRoomsNameModalCallback(interaction);
            case 'limitModal':
                return modalHandler.tempRoomsLimitModalCallback(interaction);
            default:
                return infoLogger.error(`[TEMP-ROOMS] [MODAL] ID (${interaction.customId}) компонента не найден!`);
        }
    },
    tempRoomsSelectMenuInteraction: function(interaction) {
        switch (interaction.customId) {
            case 'tempRoomsVoiceSelect':
                return selectMenuHandler.tempRoomsVoiceSelectmenuCallback(interaction);
            case 'templateRooms':
                if (!interaction.member.voice.channel) return interaction.reply({ embeds: [embedHandler.notInVoice()], ephemeral: true });
                return selectMenuHandler.templateRoomsCallback(interaction);
            case 'bitrateChange':
                if (!interaction.member.voice.channel) return interaction.reply({ embeds: [embedHandler.notInVoice()], ephemeral: true });
                return selectMenuHandler.bitrateChangeCallback(interaction);
            default:
                return infoLogger.error(`[TEMP-ROOMS] [SELECT-MENU] ID (${interaction.customId}) компонента не найден!`);
        }
    },
};
