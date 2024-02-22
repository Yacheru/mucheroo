const db = require('./../../index.js');
const { infoLogger } = require('../../../logs/logger.js');
const { Model, DataTypes } = require('sequelize');


class Messages extends Model {
	static associate() {}
}

Messages.init(
	{
		userID: {
			type: DataTypes.BIGINT,
			unique: true,
		},
		count: {
			type: DataTypes.INTEGER,
			unique: true,
			defaultValue: 1,
		},
	}, {
		sequelize: db.sequelize,
		modelName: 'Messages',
		hooks: {
			afterCreate: (user, options) => {
				infoLogger.info(`[MESSAGES] Пользователь ${user.userID} занесен в таблицу.`);
			},
			afterUpdate: (user, options) => {
				infoLogger.info(`[MESSAGES] Пользователь ${user.userID} написал сообщение, новое количество сообщений - ${user.count}`);
			},
		},
	},
);

module.exports = Messages;

