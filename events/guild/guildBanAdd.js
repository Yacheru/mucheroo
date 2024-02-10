const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildBanAdd,
	execute(ban) {
		// console.log(`Добавлен бан: ${ban}`);
	},
};
