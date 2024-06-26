const { infoLogger } = require('../../logs/logger');
const { serverEmbed, errorEmbed } = require('./embeds');
const { Colors } = require('discord.js');
const { GameDig } = require('gamedig');


async function fetchData(client, row) {
    const channel = client.guilds.cache.get(row.guildID).channels.cache.get(row.channelID);

    return new Promise((resolve, reject) => {
        GameDig.query({
            type: 'counterstrike2',
            host: row.ip,
            port: row.port,
        }).then(async (result) => {
            row.disabled = false;
            const embed = await serverEmbed(result);
            if (!row.messageID) {
                return channel.send({ embeds: [embed] })
                    .then(async (message) => {
                        resolve(
                            await row.update({ messageID: message.id, disabled: false }),
                        );
                    })
                    .catch((error) => reject(
                        infoLogger.error(`[MONITORING] Ошибка отправки сообщения ${error}`),
                    ));
            }
            else {
                return channel.messages.fetch(row.messageID)
                    .then((message) => message.edit({ embeds: [embed] }))
                    .catch((error) => reject(
                        infoLogger.error(`[MONITORING] Ошибка поиска сообщения ${error}`),
                    ));
            }
        }).catch(async (error) => {
            if (row.disabled) return;

            if (!row.messageID) {
                return channel.send({ embeds: [errorEmbed()] })
                    .then(async (message) => {
                        resolve(
                            await row.update({ messageID: message.id, disabled: true }),
                        );
                    })
                    .catch((e) => reject(
                        infoLogger.error(`[MONITORING] Ошибка отправки сообщения ${e}`),
                    ));
            }
            else {
                await row.update({ disabled: true });

                return channel.messages.fetch(row.messageID)
                    .then(async (message) => {
                        message.embeds[0].data.color = `${Colors.Red}`;
                        message.embeds[0].data.description = '- Сервер недоступен или, возможно, отключен.';
                        message.embeds[0].data.fields = [];
                        message.embeds[0].data.image = { 'url': 'https://i.imgur.com/AXI5LbK.png' };
                        message.embeds[0].data.thumbnail = { 'url': 'https://infinity-tm.ru/files/maps_imgs/none.jpg' };

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
