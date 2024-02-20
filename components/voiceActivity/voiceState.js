const { voiceState, voiceActivity } = require('../../database/models/mucherooDB');
const { errorLogger } = require('../../logs/logger');


module.exports = {
    onVoiceChannelConnect: async function(member) {
        try {
            await voiceState.upsert({ userID: member.id, channelID: member.channel.id, joinedAt: new Date().getTime() });
            await voiceActivity.upsert({ userID: member.id });
        }
        catch (error) {
            return errorLogger.error(`[VOICE-CONNECT] ${error}`);
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
            return errorLogger.error(`[VOICE-LEAVE] ${error}`);
        }
    },
};
