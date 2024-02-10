const db = require('../index.js');
// const { dbLogger } = require('../../logs/logger.js');
const { Model, DataTypes } = require('sequelize');

class tempRoomsTemplate extends Model {
	static associate() {}
}

tempRoomsTemplate.init(
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
		sequelize: db,
		modelName: 'tempRoomsTemplate',
		timestamps: true,
		updatedAt: false,
		// hooks: {
		// 	afterCreate: (temproomsTemplate, options) => {
		// 		dbLogger.info(`[TEMPROOMS] ${ temproomsTemplate.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temproomsTemplate.channelID} пользователя ${temproomsTemplate.userID} создана`);
		// 	},
		// 	afterDestroy: (temproomsTemplate, options) => {
		// 		dbLogger.info(`[TEMPROOMS] ${ temproomsTemplate.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temproomsTemplate.channelID} пользователя ${temproomsTemplate.userID} удалена`);
		// 	},
		// },
	},
);

module.exports = tempRoomsTemplate;
