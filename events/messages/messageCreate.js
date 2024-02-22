const { Events, PermissionsBitField } = require('discord.js');
const { errorLogger } = require('../../logs/logger');
const { Messages } = require('../../database/models/mucherooDB');
const { prefix } = require('../../config.json');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		await message.guild.members.fetch();
		const member = message.guild.members.cache.get(message.author.id);
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = message.client.prefix.get(commandName);

		if (!message.content.startsWith(prefix) || message.author.bot) return;
		if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.react('<a:whoareu:1199162349630799882>');
		if (!command) return errorLogger.error(`[${prefix}] Команда с именем [ ${commandName} ] не найдена!`);

		const userRow = await Messages.findOne({ where: { userID: member.id } });

		if (userRow) {
			await userRow.update({ count: userRow.count + 1 });
		}
		else {
			await Messages.create({ userID: member.id });
		}

		try {
			await command.execute(message, args);
		}
		catch (error) {
			await message.reply({ content: 'При выполнении команды произошла ошибка!', ephemeral: true });
			errorLogger.error(`[${prefix}] При выполнении команды [ ${commandName} ] произошла ошибка!\n${error}`);
		}
	},
};
