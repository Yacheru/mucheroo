const db = require('../index.js');
const { Model, DataTypes } = require('sequelize');


class Messages extends Model {
    static associate(){};
};

Messages.init(
    {
        userId: {
            type: DataTypes.BIGINT,
            unique: true,
        },
        Count: {
            type: DataTypes.INTEGER,
            unique: true,
            defaultValue: 0
        }
    },
    {
        sequelize: db,
        modelName: 'Messages',
        timestamps: false
    },
);

module.exports = Messages;

