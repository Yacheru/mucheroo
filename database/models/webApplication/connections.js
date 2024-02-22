const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');

class connections extends Model {
	static associate() {}
}

connections.init(
	{
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
        },
        spotify: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0,
        },
        steam: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0,
        },
        twitch: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0,
        },
        youtube: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0,
        },
        instagram: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0,
        },
	},
	{
        timestamps: false,
		sequelize: db.webapp,
		modelName: 'yacherusite_connections',
	},
);

module.exports = connections;
