const { voiceState, voiceActivity } = require('../../database/models/mucherooDB');
const { userMention, Colors, EmbedBuilder } = require('discord.js');
const { infoLogger } = require('../../logs/logger');
const { images, tmpvoiceIcons, roles, guildId, channels } = require('../../configs/config.json');
const { Op } = require('sequelize');

function timeInVoice(time) {
    const seconds = time / 1000;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);

    return `${h} ч. ${m} мин.`;
}

async function sendActivityEmbed(client, title, queryCondition, noData, time) {
    const channel = client.channels.cache.get(channels['activityEmbedChannel']);
    const ActivityEmbed = new EmbedBuilder()
        .setTitle(title)
        .setImage(images['transperentImage'])
        .setTimestamp();

    try {
        const activityRows = await voiceActivity.findAll({ where: queryCondition, limit: 10, order: [['today', 'DESC']] });

        let userRow = '';
        let i = 1;

        const prefixArray = ['🥇', '🥈', '🥉', '4)', '5)', '6)', '7)', '8)', '9)', '10)'];

        if (activityRows.length > 0) {
            for (const row of activityRows) {
                const hasAdminRole = client.guilds.cache.get(guildId).members.cache.get(row.userID).roles.cache.has(roles['admin']);
                userRow += `${prefixArray[i - 1]} ${userMention(row.userID)} ${hasAdminRole ? tmpvoiceIcons['admin'] : ''} ${timeInVoice(time === 'day' ? row.today : row.week)}\n`;
                i++;
            }
        }
        else {
            userRow = noData;
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
            await voiceActivity.upsert({ userID: member.id });
            await voiceState.upsert({ userID: member.id, channelID: member.channel.id, joinedAt: Date.now() });
        }
        catch (error) {
            return infoLogger.error(`[VOICE-CONNECT] Ошибка изменения данных пользователя в onVoiceChannelConnect: ${error}`);
        }
    },

    onVoiceChannelLeave: async function(member) {
        try {
            const voiceStateRow = await voiceState.findOne({ where: { userID: member.id } });
            const timeSpent = Date.now() - voiceStateRow['joinedAt'];

            return await voiceActivity.increment({ today: timeSpent, week: timeSpent, all: timeSpent }, { where: { userID: member.id } });
        }
        catch (error) {
            return infoLogger.error(`[VOICE-LEAVE] Ошибка изменения данных пользователя в onVoiceChannelLeave: ${error}`);
        }
    },

    activityIn24h: async function(client) {
        return await sendActivityEmbed(client, 'Голосовая активность за 24 часа', { today: { [Op.gt]: 60000 } }, 'Голосовая активность за 24 часа отсутствует :(', 'day');
    },

    activityIn7days: async function(client) {
        return await sendActivityEmbed(client, 'Голосовая активность за 7 дней', { week: { [Op.gt]: 600000 } }, 'Голосовая активность за 7 дней отсутствует :(', 'week');
    },
    timeInVoice,
};
