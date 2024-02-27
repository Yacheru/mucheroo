const { GameDig } = require('gamedig');
const { serverEmbed } = require('./embeds');
const { infoLogger } = require('../../logs/logger');
const { Monitoring } = require('../../database/models/mucherooDB');


async function fetchData(client, row) {
    return new Promise((resolve, reject) => {
        GameDig.query({
            type: 'counterstrike2',
            host: row.ip,
            port: row.port,
        }).then(async (result) => {
            const embed = await serverEmbed(result);
            const channel = client.guilds.cache.get(row.guildID).channels.cache.get(row.channelID);
            if (!row.messageID) {
                channel.send({ embeds: [embed] })
                    .then(async (message) => {
                        resolve(
                            await Monitoring.update({ messageID: message.id }, { where: { port: row.port } }),
                        );
                    })
                    .catch((error) => reject(
                        infoLogger.error(`[MONITORING] Ошибка отправки сообщения ${error}`),
                    ));
            }
            else {
                channel.messages.fetch(row.messageID)
                    .then((message) => message.edit({ embeds: [embed] }))
                    .catch((error) => reject(
                        infoLogger.error(`[MONITORING] Ошибка поиска сообщения ${error}`),
                    ));
            }
        }).catch((error) => reject(
            infoLogger.error(`[MONITORING] Ошибка получения данных сервера ${error}`),
        ));
    });
}

module.exports = { fetchData };
