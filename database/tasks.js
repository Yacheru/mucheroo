const cron = require('node-cron');

const { voiceActivity } = require('../database/models/mucherooDB/');
const { activityin24h, activityin7days } = require('../components/voiceActivity/voiceState.js');
const { infoLogger } = require('../logs/logger.js');


module.exports = {
    dayTask: async function(client) {
        infoLogger.info('[TASKS] Запуск ежедневной задачи...');

        cron.schedule('0 0 * * *', async () => {
            try {
                await activityin24h(client);
                return await voiceActivity.update({ today: 0 });
            }
            catch (error) {
                infoLogger.error('[VOICE-ACTIVITY] Ошибка в периодической задаче раз в сутки:', error);
            }
        },
            {
                timezone: 'Europe/Moscow',
            },
        );
    },

    weekTask: function(client) {
        infoLogger.info('[TASKS] Запуск еженедельной задачи...');

        cron.schedule('0 0 * * 0', async () => {
            try {
                await activityin7days(client);
                return await voiceActivity.update({ week: 0 });
            }
            catch (error) {
                infoLogger.error('[VOICE-ACTIVITY] Ошибка в периодической задаче раз в неделю:', error);
            }
        },
            {
                timezone: 'Europe/Moscow',
            },
        );
    },
};
