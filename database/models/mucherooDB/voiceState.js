const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');

class voiceState extends Model {
	static associate() {}
}

voiceState.init(
	{
		userID: {
			type: DataTypes.STRING,
			unique: true,
		},
		channelID: {
			type: DataTypes.STRING,
		},
		joinedAt: {
			type: DataTypes.STRING,
		},
	},
	{
		createdAt: false,
		sequelize: db.sequelize,
		modelName: 'voiceState',
	},
);

module.exports = voiceState;
