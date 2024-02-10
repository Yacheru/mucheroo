/* eslint-disable max-len */
const { EmbedBuilder } = require('discord.js');
const { images } = require('../../config.json');

const buttonsHandler = require('../../components/ticketSystem/buttons');

module.exports = {
	data: {
		name: 'ticket',
		description: 'Отправить эмбед с тикетом',
	},
	execute: (message) => {
		const guildName = message.guild.name;

		const ticketEmbedImage = new EmbedBuilder()
			.setImage(images.infinitySupportImageTop);

		const ticketEmbed = new EmbedBuilder()
			.setAuthor({ name: guildName, iconURL: message.guild.IconURL })
			.setDescription('При создании тикета необходимо предоставлять как можно больше подробной информации, включая видео/скриншоты, ссылки на доказательства и прочее, что может способствовать быстрому рассмотрению тикета\n\nПри создании тикета учитывайте время, в которое вы пишете. Время ответа на ваш тикет зависит от сложности обращения и загруженности администратции.')
			.addFields({ name: '\u200B', value: '- [**Жалобы на администраторов**](https://infinity-tm.ru/complaints/)\n- [**Заявки на разбан**](https://infinity-tm.ru/bans/)' })
			.setImage(images.transperentImage);

		message.delete();
		message.channel.send({
			embeds: [ticketEmbedImage, ticketEmbed],
			components: [buttonsHandler.ticketButtons()],
		});
	},
};
