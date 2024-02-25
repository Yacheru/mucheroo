module.exports = {
	data: {
		name: 'say',
	},
	execute: async (client, message, args) => {
		const channel = message.mentions.channels.first();
		const msg = args.slice(1).join(' ');

		if (!channel) {
			return message.reply({
				content: 'Укажите канал для отправки',
			});
		}
		else if (!msg) {
			return message.reply({
				content: 'Укажите сообщение для отправки',
			});
		}

		await channel.send(msg);
	},
};
