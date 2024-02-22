const { Events } = require('discord.js');
const { dbLogger, infoLogger } = require('../../logs/logger.js');
const mModels = require('../../database/models/mucherooDB/index.js');
const wModels = require('../../database/models/webApplication/index.js');
const lModels = require('../../database/models/level_ranks/index.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            dbLogger.info('[CONNECTION] Установка соединения...');

            // Синхронизация моделей MucherooDB
            for (const model of Object.values(mModels)) {
                dbLogger.info(`[TABLES] Регистрация таблицы: ${model.name}...`);
                await model.sync({ force: false });
                if (typeof model.associate === 'function') {
                    model.associate(mModels);
                }
            }

            // Синхронизация моделей Web Application
            for (const model of Object.values(wModels)) {
                dbLogger.info(`[TABLES] Регистрация таблицы: ${model.name}...`);
                await model.sync({ force: false });
                if (typeof model.associate === 'function') {
                    model.associate(wModels);
                }
            }

            // Синхронизация моделей Level Ranks
            for (const model of Object.values(lModels)) {
                dbLogger.info(`[TABLES] Регистрация таблицы: ${model.name}...`);
                await model.sync({ force: false });
                if (typeof model.associate === 'function') {
                    model.associate(lModels);
                }
            }

            dbLogger.info('[SYCHRONIZATION] Синхронизация завершена.');
        }
		catch (error) {
            dbLogger.error('[SYCHRONIZATION] Ошибка синхронизации!', error);
        }
		finally {
            infoLogger.info(`[${client.user.displayName.toUpperCase()}] ${client.user.tag} Готов!`);
        }
    },
};
