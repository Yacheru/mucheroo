const { Events } = require('discord.js');
const { dbLogger, infoLogger } = require('../../logs/logger.js');
const db = require('../../database/index.js');
const models = require('../../database/models/index.js');


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		try {
			dbLogger.info('[CONNECTION] Установка соединения...');

			Object.keys(models).forEach((ele) => {
				dbLogger.info(`[TABLES] Регистрация таблицы: ${ele}...`),
				models[ele].associate(models);
			});
			db.sync({ force: false });
		}
		catch (error) {
			dbLogger.error('[SYCHRONIZATION] Ошибка синхроницазии!', error);
		}
		finally {
			dbLogger.info('[SYCHRONIZATION] Синхронизация закончена.');
		}

		infoLogger.info(`[${client.user.displayName.toUpperCase()}] ${client.user.tag} Готов!`);
	},
};
