const { GameDig } = require('gamedig');
const { serverEmbed } = require('./embeds');
const { infoLogger } = require('../../logs/logger');
const { Monitoring } = require('../../database/models/mucherooDB');


async function fetchData(client, row) {
    const channel = client.guilds.cache.get(row.guildID).channels.cache.get(row.channelID);

    return new Promise((resolve, reject) => {
        GameDig.query({
            type: 'counterstrike2',
            host: row.ip,
            port: row.port,
        }).then(async (result) => {
            const embed = await serverEmbed(result);
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
        }).catch(async (error) => {
            if (!row.messageID) {
                channel.send({ embeds: [embed] })
                    .then(async (message) => {
                        resolve(
                            await Monitoring.update({ messageID: message.id }, { where: { port: row.port } }),
                        );
                    })
                    .catch((er) => reject(
                        infoLogger.error(`[MONITORING] Ошибка отправки сообщения ${er}`),
                    ));
            }
            else {
                channel.messages.fetch(row.messageID)
                    .then(async (message) => {
                        message.embeds[0].data.description = '- Сервер недоступен или, возможно, отключен.';
                        message.embeds[0].data.fields = [];
                        message.embeds[0].data.image = 'https://i.imgur.com/AXI5LbK.png';
                        message.embeds[0].data.thumbnail = 'https://infinity-tm.ru/files/maps_imgs/none.jpg';

                        await message.edit({ embeds: [message.embeds[0]] });
                    })
                    .catch((e) => reject(
                        infoLogger.error(`[MONITORING] Ошибка поиска сообщения ${e}`),
                    ));
            }
        });
    });
}

module.exports = { fetchData };
