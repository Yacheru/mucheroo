const db = require('../index.js');
const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static associate(){};
};

User.init(
    {
        discordSnowflake: {
            type: DataTypes.STRING,
            unique: true,
        },
        Pole: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize: db,
        modelName: 'User',
    },
);

module.exports = User;