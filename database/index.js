const { Sequelize } = require('sequelize');
const { postgres } = require('../config.json');

const sequelize = new Sequelize(postgres.database, postgres.user, postgres.password, {
	host: postgres.host,
	dialect: 'postgres',
	logging: false,
});

module.exports = sequelize;
