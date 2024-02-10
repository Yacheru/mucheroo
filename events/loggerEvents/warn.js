const { Events } = require('discord.js');
const { errorLogger } = require('../../logs/logger');

module.exports = {
	name: Events.Warn,
	async execute(info) {
		errorLogger.warn(info);
	},
};
