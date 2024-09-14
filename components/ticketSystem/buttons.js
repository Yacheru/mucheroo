const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { channels } = require('../../configs/config.json');

module.exports = {
    ticketButtons: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('player')
				.setLabel('Жалоба на игрока')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('questions')
				.setLabel('По любым вопросам')
				.setStyle(ButtonStyle.Secondary),
		);
	}, closeTicketButton: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('closeTicket')
				.setLabel('Закрыть обращение')
				.setStyle(ButtonStyle.Secondary),
		);
	}, deleteTicketButton: function() {
		return new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('deleteTicket')
				.setLabel('Удалить тикет')
				.setStyle(ButtonStyle.Danger),
		);
	}, deleteTicketButtonCallback: function(interaction) {
		return interaction.channel.delete();
	}, closeTicketButtonCallback: function(interaction) {
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
		interaction.message.embeds[0].data.footer.text = `Тикет закрыт: ${interaction.member.displayName}`;
		interaction.message.edit({ components: [this.deleteTicketButton()], embeds: [interaction.message.embeds[0]] });
		return interaction.reply({ content: 'Тикет успешно закрыт!', ephemeral: true });
	},
};
