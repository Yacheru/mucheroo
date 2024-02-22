const { createLogger, format, transports } = require('winston');
const fs = require('fs');

fs.writeFile('info.log', '', (err) => {
	if (err) {
		console.error('[LOGGER] Ошибка при создании файла:', err);
	}
	else {
		console.log('[LOGGER] Файл успешно создан!');
	}
});

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
			// new transports.Console(),
			new transports.File({ filename: './logs/info.log' }),
		],
	}),
};
