const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');

class warns extends Model {
	static associate() {}
}

warns.init(
	{
		userID: {
			type: DataTypes.STRING,
			unique: true,
		},
		warns: {
			type: DataTypes.JSONB,
			defaultValue: {},
		},
	},
	{
		sequelize: db.sequelize,
		modelName: 'warns',
	},
);

module.exports = warns;
