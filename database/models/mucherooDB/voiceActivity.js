const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');

class VoiceActivity extends Model {
	static associate() {}
}

VoiceActivity.init(
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

module.exports = VoiceActivity;
