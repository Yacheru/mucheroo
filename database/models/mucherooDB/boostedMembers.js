const db = require('./../../index.js');
const { infoLogger } = require('../../../logs/logger.js');
const { Model, DataTypes } = require('sequelize');

class BoostedMembers extends Model {
	static associate() {}
}

BoostedMembers.init(
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
		sequelize: db.sequelize,
		modelName: 'boostedMembers',
		hooks: {
			afterCreate: (members, options) => {
				infoLogger.info(`[BOOST] Пользователь ${members.userID} забустил сервер!`);
			},
		},
	},
);

module.exports = BoostedMembers;
