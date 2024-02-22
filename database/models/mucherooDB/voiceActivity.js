const cron = require('node-cron');
const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');
const { errorLogger } = require('../../../logs/logger.js');

class voiceActivity extends Model {
	static associate() {}
}

voiceActivity.init(
	{
		userID: {
			type: DataTypes.STRING,
			unique: true,
		},
		today: {
            type: DataTypes.BIGINT,
			defaultValue: 0,
        },
        week: {
            type: DataTypes.BIGINT,
			defaultValue: 0,
        },
        all: {
            type: DataTypes.BIGINT,
			defaultValue: 0,
        },
	},
	{
		sequelize: db.sequelize,
		modelName: 'voiceActivity',
	},
);


cron.schedule('0 0 * * *', async () => {
	try {
		return await voiceActivity.update({ today: 0 });
	}
	catch (error) {
		errorLogger.error('[VOICE-ACTIVITY] Ошибка в периодической задаче раз в сутки:', error);
	}
});

cron.schedule('0 0 * * 0', async () => {
	try {
		return await voiceActivity.update({ week: 0 });
	}
	catch (error) {
		errorLogger.error('[VOICE-ACTIVITY] Ошибка в периодической задаче раз в неделю:', error);
	}
});

module.exports = voiceActivity;
