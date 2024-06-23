const { Sequelize } = require('sequelize');
const { databases } = require('../config.json');

const sequelize = new Sequelize(databases['mucherooDB']['database'], databases['mucherooDB']['user'], databases['mucherooDB']['password'], {
	host: databases['mucherooDB']['host'],
	dialect: 'postgres',
	logging: false,
});


/* const webapp = new Sequelize(databases.WebApplication.database, databases.WebApplication.user, databases.WebApplication.password, {
	host: databases.WebApplication.host,
	dialect: 'postgres',
	logging: false,
});


const mysql = new Sequelize(databases.ReadRanks.database, databases.ReadRanks.user, databases.ReadRanks.password, {
	host: databases.ReadRanks.host,
	dialect: 'mysql',
	logging: false,
}); */


module.exports = { sequelize };
