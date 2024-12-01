const { infoLogger } = require('../../logs/logger');
const { serverEmbed, errorEmbed } = require('./embeds');
const { Colors } = require('discord.js');
const { GameDig } = require('gamedig');

async function fetchData(client, row) {
    const channel = client.guilds.cache.get(row.guildID).channels.cache.get(row.channelID);

    try {
        const query = await GameDig.query({
            type: 'counterstrike2',
            host: row.ip,
            port: row.port,
        });
        const embed = await serverEmbed(query);

        if (!row.messageID) {
            try {
                return channel.send({ embeds: [embed] }).then(async (message) => {
                    await row.update({ messageID: message.id, disabled: false });
                });
            }
            catch (error) {
                return infoLogger.error(`[MONITORING] Ошибка отправки сообщения ${error}`);
            }
        }

        try {
            return channel.messages.fetch(row.messageID).then((message) => message.edit({ embeds: [embed] }));
        }
        catch (error) {
            return infoLogger.error(`[MONITORING] Ошибка поиска сообщения ${error}`);
        }
    }
    catch (error) {
        if (row.disabled) return;

        if (!row.messageID) {
            try {
                const message = channel.send({ embeds: [errorEmbed()] });
                return await row.update({ messageID: message.id, disabled: true });
            }
            catch (error) {
                return infoLogger.error(`[MONITORING] Ошибка отправки сообщения ${error}`);
            }
        }

        await row.update({ disabled: true });

        try {
            const message = channel.messages.fetch(row.messageID);

            message.embeds[0].data.color = `${Colors.Red}`;
            message.embeds[0].data.description = '- Сервер недоступен или, возможно, отключен.';
            message.embeds[0].data.fields = [];
            message.embeds[0].data.image = { 'url': 'https://i.imgur.com/AXI5LbK.png' };
            message.embeds[0].data.thumbnail = { 'url': 'https://infinity-tm.ru/files/maps_imgs/none.jpg' };

            await message.edit({ embeds: [message.embeds[0]] });

        }
        catch (error) {
            return infoLogger.error(`[MONITORING] Ошибка поиска сообщения ${error}`);
        }
    }
}

module.exports = { fetchData };
