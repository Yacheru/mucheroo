const { PermissionFlagsBits, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { channels } = require('../config.json')


module.exports = {
    ticketButtons: function () {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('player')
                .setLabel('Жалоба на игрока')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('questions')
                .setLabel('По любым вопросам')
                .setStyle(ButtonStyle.Secondary)
        );
    }, closeTicketButton: function () {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('closeTicket')
                .setLabel('Закрыть обращение')
                .setStyle(ButtonStyle.Secondary)
        );
    }, deleteTicketButton: function () {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('deleteTicket')
                .setLabel('Удалить тикет')
                .setStyle(ButtonStyle.Danger)
        )
    }, deleteTicketButtonCallback: function (interaction) {
        interaction.channel.delete()

    }, closeTicketButtonCallback: function (interaction) {
        interaction.channel.setParent(`${channels.closedTicketCategory}`);
        interaction.message.edit({ 
            components: [this.deleteTicketButton()], 
        })
        interaction.reply({ content: 'Тикет успешно закрыт!', ephemeral: true });
    }
}