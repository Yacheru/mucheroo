const db = require('./../../index.js');
// const { infoLogger } = require('../../logs/logger.js');
const { Model, DataTypes } = require('sequelize');

class TempRoomsTemplate extends Model {
	static associate() {}
}

TempRoomsTemplate.init(
	{
		userID: {
			type: DataTypes.STRING,
			unique: true,
		},
		channelLimit: {
			type: DataTypes.INTEGER,
		},
		channelName: {
			type: DataTypes.STRING,
		},
		channelBitrate: {
			type: DataTypes.INTEGER,
		},
	},
	{
		sequelize: db.sequelize,
		modelName: 'tempRoomsTemplate',
		timestamps: true,
		updatedAt: false,
		// hooks: {
		// 	afterCreate: (temproomsTemplate, options) => {
		// 		infoLogger.info(`[TEMPROOMS] ${ temproomsTemplate.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temproomsTemplate.channelID} пользователя ${temproomsTemplate.userID} создана`);
		// 	},
		// 	afterDestroy: (temproomsTemplate, options) => {
		// 		infoLogger.info(`[TEMPROOMS] ${ temproomsTemplate.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temproomsTemplate.channelID} пользователя ${temproomsTemplate.userID} удалена`);
		// 	},
		// },
	},
);

module.exports = TempRoomsTemplate;
