const { Sequelize } = require('sequelize');
const { databases } = require('../configs/config.json');

const sequelize = new Sequelize(databases['mucherooDB']['database'], databases['mucherooDB']['user'], databases['mucherooDB']['password'], {
	host: databases['mucherooDB']['host'],
	dialect: 'postgres',
	logging: false,
});

module.exports = { sequelize };
