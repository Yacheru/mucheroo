const { infoLogger } = require('../../logs/logger');
const { serverEmbed, errorEmbed } = require('./embeds');
const { Colors } = require('discord.js');
const { GameDig } = require('gamedig');

async function fetchData(client, row) {
    let channel;
    let msgId = '';

    await client.guilds.fetch(row.guildID)
        .then(async (guild) => {
            await guild.channels.fetch(row.channelID)
                .then((c) => {
                    channel = c;
                })
                .catch((error) => { throw error; });
        })
        .catch((error) => { throw error; });

    try {
        const query = await GameDig.query({
            type: 'counterstrike2',
            host: row.ip,
            port: row.port,
        });
        const embed = await serverEmbed(row.country_code, query);

        if (!row.messageID) {
            await channel.send({ embeds: [embed] })
                .then(async (message) => msgId = message.id)
                .catch((error) => infoLogger.error(`[MONITORING] Ошибка отправки успешного сообщения ${error}`));
        }
        else {
            await channel.messages.fetch(row.messageID)
                .then((message) => {
                    message.edit({ embeds: [embed] });
                    msgId = message.id;
                })
                .catch((error) => infoLogger.error(`[MONITORING] Ошибка поиска успешного сообщения ${error}`));
        }

        return await row.update({ messageID: msgId, disabled: false });
    }
    catch (error) {
        if (row.disabled) return;

        const embed = errorEmbed();
        if (!row.messageID) {
            return await channel.send({ embeds: [embed] })
                .then(async (message) => await row.update({ messageID: message.id, disabled: true }))
                .catch((error) => infoLogger.error(`[MONITORING] Ошибка отправки проваленого сообщения ${error}`));
        }

        await channel.messages.fetch(row.messageID)
            .then(async (message) => {
                message.embeds[0].data.color = `${Colors.Red}`;
                message.embeds[0].data.description = '- **Сервер недоступен или, возможно, отключен.**';
                message.embeds[0].data.fields = [];
                message.embeds[0].data.image = { 'url': 'https://i.imgur.com/AXI5LbK.png' };
                message.embeds[0].data.thumbnail = { 'url': 'https://infinity-tm.ru/files/maps_imgs/none.jpg' };
                await message.edit({ embeds: [message.embeds[0]] });
            })
            .then((error) => infoLogger.error(`[MONITORING] Ошибка поиска проваленого сообщения ${error}`));

        return await row.update({ disabled: true });
    }
}

module.exports = { fetchData };
