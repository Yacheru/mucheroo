const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');

class Warns extends Model {
	static associate() {}
}

Warns.init(
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

module.exports = Warns;
