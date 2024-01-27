const { PermissionFlagsBits, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { channels, tmpvoiceIcons } = require('../config.json')


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
        );
    }, deleteTicketButtonCallback: function (interaction) {
        interaction.channel.delete();

    }, closeTicketButtonCallback: function (interaction) {
        interaction.channel.edit({
            parent: channels.closedTicketCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                    allow: [],
                },
            ],
        });
        interaction.message.edit({ components: [this.deleteTicketButton()] });
        interaction.reply({ content: 'Тикет успешно закрыт!', ephemeral: true });
    },

    voiceRoomsButtonsRowFirst: function () {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('upslot')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.upslot)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('hide')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.hide)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('private')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.private)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('access')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.access)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('voice')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.voice)
                .setStyle(ButtonStyle.Secondary),    
        );
    }, voiceRoomsButtonsRowSecond: function () {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('downslot')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.downslot)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('limit')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.limit)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('name')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.name)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('owner')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.owner)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('info')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.info)
                .setStyle(ButtonStyle.Secondary),    
        );
    }, voiceRoomsButtonsRowThird: function () {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('templateButton')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.template)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('more')
                .setLabel(' ')
                .setEmoji(tmpvoiceIcons.more)
                .setStyle(ButtonStyle.Primary),
        );
    },
};