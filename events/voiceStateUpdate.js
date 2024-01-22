const { Events, ChannelType, Collection, NewsChannel } = require('discord.js')
const { channels } = require('../config.json')
const voiceCollection = new Collection()

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute (oldState, newState) {
        const member = newState.guild.members.cache.get(newState.id)

        if (!oldState.channel && newState.channel.id === channels.newChannelCreater) {
            const channel = await newState.guild.channels.create({
                name: member.displayName,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            });
            member.voice.setChannel(channel);
            voiceCollection.set(member.id, channel.id);   
        } 
        else if (!newState.channel) {
            if (oldState.channel.id === voiceCollection.get(newState.id))
                return oldState.channel.delete();
        }
    },
}; 