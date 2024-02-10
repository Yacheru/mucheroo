const { Events } = require('discord.js');
const { errorLogger } = require('../../logs/logger');

module.exports = {
	name: Events.Debug,
	async execute(info) {
		errorLogger.debug(info);
	},
};
