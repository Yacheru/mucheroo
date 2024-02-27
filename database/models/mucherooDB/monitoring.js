const db = require('./../../index.js');
const { Model, DataTypes } = require('sequelize');


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
        ip: {
            type: DataTypes.STRING,
        },
        port: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize: db.sequelize,
        modelName: 'Monitoring',
    },
);

module.exports = Monitoring;

