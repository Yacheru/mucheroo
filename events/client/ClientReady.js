const { Events } = require('discord.js');
const { infoLogger } = require('../../logs/logger.js');
const { dayTask, weekTask } = require('../../database/tasks.js');
const mModels = require('../../database/models/mucherooDB/index.js');
const wModels = require('../../database/models/webApplication/index.js');
const lModels = require('../../database/models/level_ranks/index.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        try {
            infoLogger.info('[CONNECTION] Установка соединения...');

            // Синхронизация моделей MucherooDB
            for (const model of Object.values(mModels)) {
                infoLogger.info(`[TABLES] Регистрация таблицы: ${model.name}...`);
                await model.sync({ force: false });
                if (typeof model.associate === 'function') {
                    model.associate(mModels);
                }
            }

            // Синхронизация моделей Web Application
            for (const model of Object.values(wModels)) {
                infoLogger.info(`[TABLES] Регистрация таблицы: ${model.name}...`);
                await model.sync({ force: false });
                if (typeof model.associate === 'function') {
                    model.associate(wModels);
                }
            }

            // Синхронизация моделей Level Ranks
            for (const model of Object.values(lModels)) {
                infoLogger.info(`[TABLES] Регистрация таблицы: ${model.name}...`);
                await model.sync({ force: false });
                if (typeof model.associate === 'function') {
                    model.associate(lModels);
                }
            }

            infoLogger.info('[SYNCHRONIZATION] Синхронизация завершена.');
        }
		catch (error) {
            infoLogger.error('[SYNCHRONIZATION] Ошибка синхронизации!', error);
        }

        try {
            infoLogger.info('[TASKS] Запуск задач...');
            await dayTask(client);
            await weekTask(client);

            infoLogger.info('[TASKS] Успешный запуск задач!');
        }
        catch (error) {
            infoLogger.error('[TASKS] Ошибка запуска задач:', error);
        }

        infoLogger.info(`[${client.user.displayName.toUpperCase()}] ${client.user.tag} Готов!`);
    },
};
