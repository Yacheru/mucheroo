const { Events } = require('discord.js');
const { onBoostAdd, onBoostRemove } = require('../../components/boostSystem/onBoostHandler');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
		// !oldMember.premiumSince && newMember.premiumSince
		// oldMember.premiumSincee && !newMember.premiumSince

        if (newMember.roles.cache.some((role) => role.id === '1159334533913661450')) {
			return await onBoostAdd(newMember);
        }
		else if (!newMember.roles.cache.some((role) => role.id === '1159334533913661450')) {
            return await onBoostRemove(newMember);
        }
    },
};
