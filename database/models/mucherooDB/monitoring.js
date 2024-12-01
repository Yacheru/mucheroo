const { Model, DataTypes } = require('sequelize');
const db = require('./../../index.js');


class Monitoring extends Model {
    static associate() {}
}

Monitoring.init(
    {
        channelID: {
            type: DataTypes.STRING,
        },
        messageID: {
            type: DataTypes.STRING,
        },
        guildID: {
            type: DataTypes.STRING,
        },
        country_code: {
            type: DataTypes.STRING,
        },
        ip: {
            type: DataTypes.STRING,
        },
        port: {
            type: DataTypes.STRING,
        },
        disabled: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        timestamps: false,
        sequelize: db.sequelize,
        modelName: 'monitoring',
    },
);

module.exports = Monitoring;

