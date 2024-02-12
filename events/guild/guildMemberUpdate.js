const { Events } = require('discord.js');
const { onBoostAdd, onBoostRemove } = require('../../components/boostSystem/onBoostHandler');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        if (!oldMember.premiumSince && newMember.premiumSince) {
			return await onBoostAdd(newMember);
        }
		else if (oldMember.premiumSincee && !newMember.premiumSince) {
            return await onBoostRemove(newMember);
        }
    },
};
