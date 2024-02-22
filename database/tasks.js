const cron = require('node-cron');
const { infoLogger } = require('../logs/logger.js');
const { actvityin24h } = require('../components/voiceActivity/voiceState.js');


module.exports = {
    dayTask: async function() {
        cron.schedule('0 0 * * *', async () => {
            try {
                await actvityin24h(client);
                return await voiceActivity.update({ today: 0 });
            }
            catch (error) {
                infoLogger.error('[VOICE-ACTIVITY] Ошибка в периодической задаче раз в сутки:', error);
            }
        });
    },

    weekTask: function() {
        cron.schedule('0 0 * * 0', async () => {
            try {
                return await voiceActivity.update({ week: 0 });
            }
            catch (error) {
                infoLogger.error('[VOICE-ACTIVITY] Ошибка в периодической задаче раз в неделю:', error);
            }
        });
    },
};
