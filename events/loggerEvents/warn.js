const { Events } = require('discord.js');
const { infoLogger } = require('../../logs/logger');

module.exports = {
	name: Events.Warn,
	async execute(info) {
		infoLogger.warn(info);
	},
};
