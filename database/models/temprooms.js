const db = require('../index.js');
const { dbLogger } = require('../../logs/logger.js');
const { Model, DataTypes } = require('sequelize');

class tempRooms extends Model {
	static associate() {}
}

tempRooms.init(
	{
		userID: {
			type: DataTypes.STRING,
			unique: true,
		},
		channelID: {
			type: DataTypes.STRING,
			unique: true,
		},
		adminRoom: {
			type: DataTypes.BOOLEAN,
			unique: false,
			defaultValue: false,
		},
		templateRoom: {
			type: DataTypes.BOOLEAN,
			unique: false,
			defaultValue: false,
		},
	},
	{
		sequelize: db,
		modelName: 'tempRooms',
		timestamps: true,
		updatedAt: false,
		hooks: {
			afterCreate: (temprooms, options) => {
				dbLogger.info(`[TEMPROOMS] ${ temprooms.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temprooms.channelID} пользователя ${temprooms.userID} создана`);
			},
			afterDestroy: (temprooms, options) => {
				dbLogger.info(`[TEMPROOMS] ${ temprooms.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temprooms.channelID} пользователя ${temprooms.userID} удалена`);
			},
			afterUpdate: (temprooms, options) => {
				dbLogger.info(`[TEMPROOMS] ${ temprooms.adminRoom ? 'Комната администратора' : 'Пользовательская комната' } ${temprooms.channelID} пользователя ${temprooms.userID} обновлена`);
			},
		},
	},
);

module.exports = tempRooms;
