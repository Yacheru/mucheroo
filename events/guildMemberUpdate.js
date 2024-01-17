const { Events } = require('discord.js')

module.exports = { 
    name: Events.GuildMemberUpdate, 
    execute (client, oldMember, newMember) {
        const oldStatus = oldMember.premiumSince
        const newStatus = newMember.premiumSince
    },
};