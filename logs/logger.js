const { createLogger, format, transports } = require('winston');

module.exports = {
	infoLogger: createLogger({
		format: format.combine(
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => {
				const { timestamp, level, message } = info;
				return `[${timestamp}] [${level.toLocaleUpperCase()}] ${message}`;
			}),
		),
		transports: [
			new transports.Console(),
			// new transports.File({ filename: './logs/info.log' }),
		],
	}),

	errorLogger: createLogger({
		format: format.combine(
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => {
				const { timestamp, level, message } = info;
				return `[${timestamp}] [${level.toLocaleUpperCase()}] ${message}`;
			}),
		),
		transports: [
			new transports.Console(),
			// new transports.File({ filename: './logs/errors.log' }),
		],
	}),

	dbLogger: createLogger({
		format: format.combine(
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.printf((info) => {
				const { timestamp, level, message } = info;
				return `[${timestamp}] [${level.toLocaleUpperCase()}] ${message}`;
			}),
		),
		transports: [
			new transports.Console(),
			// new transports.File({ filename: './logs/database.log' }),
		],
	}),
};
