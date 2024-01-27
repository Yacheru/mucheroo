const { PermissionFlagsBits, Events, ChannelType, Collection, NewsChannel } = require('discord.js')
const { channels, roles } = require('../config.json')
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
                userLimit: 5,
            });
            member.voice.setChannel(channel);
            voiceCollection.set(member.id, channel.id);

        } else if (!oldState.channel && newState.channel.id === channels.newChannelAdminCreater) {
            const channel = await newState.guild.channels.create({
                name: `адм | ${member.displayName}`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
                userLimit: 2,
                permissionOverwrites: [
                    {
                        id: newState.guild.roles.everyone,
                        deny: [PermissionFlagsBits.Connect],
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: roles['gl-admin'],
                        deny: [],
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Stream, PermissionFlagsBits.Connect],
                   },
                   {
                        id: roles['zam-admin'],
                        deny: [],
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Stream, PermissionFlagsBits.Connect],
                    },
                    {
                        id: roles['st-admin'],
                        deny: [],
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Stream, PermissionFlagsBits.Connect],
                   },
                   {
                        id: roles.admin,
                        deny: [],
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Stream, PermissionFlagsBits.Connect],
                    },
                ],
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