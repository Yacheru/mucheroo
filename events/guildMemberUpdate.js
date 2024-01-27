const { Events, time } = require('discord.js')

module.exports = { 
    name: Events.GuildMemberUpdate, 
    async execute (oldMember, newMember) {
        if (newMember.isCommunicationDisabled() && !oldMember.isCommunicationDisabled()) return console.log(`${newMember.displayName} отправлен в тайм-аут до ${time(newMember.communicationDisabledUntilTimestamp / 1000, 'R')} участником: `)
        if (!newMember.isCommunicationDisabled() && oldMember.isCommunicationDisabled()) return console.log(`${newMember.displayName} возвращён голос участником: `)
    },
};