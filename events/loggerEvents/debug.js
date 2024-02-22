const { Events } = require('discord.js');
const { infoLogger } = require('../../logs/logger');

module.exports = {
	name: Events.Debug,
	async execute(info) {
		infoLogger.debug(info);
	},
};
