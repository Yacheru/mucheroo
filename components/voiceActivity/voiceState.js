const { Op } = require('sequelize');
const { userMention, Colors } = require('discord.js');
const { voiceState, voiceActivity } = require('../../database/models/mucherooDB');
const { infoLogger } = require('../../logs/logger');
const { EmbedBuilder } = require('@discordjs/builders');
const { images } = require('../../config.json');

function timeInVoice(time) {
    const h = Math.floor(time / 3600);
    const m = Math.floor(time % 3600 / 60);

    return `${h} ч. ${m} мин.`;
}

async function sendActivityEmbed(client, title, queryCondition, errorMessage, time) {
    const ActivityEmbed = new EmbedBuilder()
        .setTitle(title)
        .setImage(images.transperentImage)
        .setTimestamp();

    try {
        const activityRows = await voiceActivity.findAll({ where: queryCondition, limit: 10, order: [['today', 'DESC']] });
        const channel = client.channels.cache.get('1205814495415373876');

        let userRow = '';
        let i = 1;

        if (activityRows.length > 0) {
            for (const row of activityRows) {
                userRow += `${i}) ${userMention(row.userID)} ${timeInVoice(time === 'day' ? row.day : row.week)}\n`;
                i++;
            }
        }
        else {
            userRow += errorMessage;
        }

        ActivityEmbed.setDescription(userRow).setColor(Colors.Blue);
        return await channel.send({ embeds: [ActivityEmbed] });
    }
    catch (error) {
        infoLogger.error(`Произошла ошибка при получении активности (${title}):`, error);
        ActivityEmbed.setDescription(`Произошла ошибка при получении активности (${title}) :(`).setColor(Colors.Red);
        return await channel.send({ embeds: [ActivityEmbed] });
    }
}

module.exports = {
    onVoiceChannelConnect: async function(member) {
        try {
            await voiceState.upsert({ userID: member.id, channelID: member.channel.id, joinedAt: new Date().getTime() });
            await voiceActivity.upsert({ userID: member.id });
        }
        catch (error) {
            return infoLogger.error(`[VOICE-CONNECT] ${error}`);
        }
    },

    onVoiceChannelLeave: async function(member) {
        try {
            const voiceStateRow = await voiceState.findOne({ where: { userID: member.id } });
            const now = new Date().getTime();
            const timeSpent = (now - voiceStateRow.joinedAt) / 1000;

            return await voiceActivity.increment({ today: timeSpent, week: timeSpent, all: timeSpent }, { where: { userID: member.id } });
        }
        catch (error) {
            return infoLogger.error(`[VOICE-LEAVE] ${error}`);
        }
    },

    activityin24h: async function(client) {
        return await sendActivityEmbed(client, 'Голосовая активность за 24 часа', { today: { [Op.gt]: 60 } }, 'Голосовая активность за 24 часа отсутствует :(', 'day');
    },

    activityin7days: async function(client) {
        return await sendActivityEmbed(client, 'Голосовая активность за 7 дней', { today: { [Op.gt]: 520 } }, 'Голосовая активность за 7 дней отсутствует :(', 'week');
    },
    timeInVoice,
};
