// /* eslint-disable new-cap */
// const db = require('./../../index.js');
// // const { dbLogger } = require('../../../logs/logger.js');
// const { Model, DataTypes } = require('sequelize');
//
//
// class lvlBase extends Model {
// 	static associate() {}
// }
//
// lvlBase.init(
//     {
//         newid: {
//             type: DataTypes.INTEGER.UNSIGNED,
//             allowNull: false,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         steam: {
//             type: DataTypes.STRING(32),
//             allowNull: false,
//             defaultValue: '',
//         },
//         name: {
//             type: DataTypes.STRING(32),
//             allowNull: false,
//             defaultValue: '',
//         },
//         value: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         rank: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         kills: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         deaths: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         shoots: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         hits: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         headshots: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         assists: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         round_win: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         round_lose: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         playtime: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//         lastconnect: {
//             type: DataTypes.DECIMAL(10, 0),
//             defaultValue: null,
//         },
//     },
//     {
//         sequelize: db.mysql,
//         tableName: 'lvl_base',
//         timestamps: false,
//     },
// );
//
//
// module.exports = lvlBase;
