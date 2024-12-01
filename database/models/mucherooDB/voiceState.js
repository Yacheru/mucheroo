const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');

class VoiceState extends Model {
	static associate() {}
}

VoiceState.init(
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

module.exports = VoiceState;
