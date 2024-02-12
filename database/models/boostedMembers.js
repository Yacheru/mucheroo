const db = require('../index.js');
const { dbLogger } = require('../../logs/logger.js');
const { Model, DataTypes } = require('sequelize');


class boostedMembers extends Model {
	static associate() {}
}

boostedMembers.init(
	{
		userID: {
			type: DataTypes.STRING,
			unique: true,
		},
		channelID: {
			type: DataTypes.STRING,
			unique: true,
		},
		boostTime: {
			type: DataTypes.BIGINT,
		},
	}, {
		sequelize: db,
		modelName: 'boostedMembers',
		hooks: {
			afterCreate: (members, options) => {
				dbLogger.info(`[BOOST] Пользователь ${members.userID} забустил сервер!`);
			},
		},
	},
);

module.exports = boostedMembers;

