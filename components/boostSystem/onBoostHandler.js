const { BoostedMembers } = require('../../database/models/mucherooDB');
const { PermissionFlagsBits, ChannelType } = require('discord.js');
const { channels } = require('../../configs/config.json');
const { boostEmbed } = require('./embeds');

module.exports = {
    onBoostAdd: async function(newMember) {
        const existingVoiceChannel = newMember.guild.channels.cache.find(
            (channel) => channel.name === newMember.user.username && channel.type === ChannelType.GuildVoice);

        let voiceChannel;
        let boosted = false;
        if (!existingVoiceChannel) {
            voiceChannel = await newMember.guild.channels.create({
                name: newMember.user.username,
                type: ChannelType.GuildVoice,
                parent: '1177832534906785902',
                permissionOverwrites: [
                    {
                        id: newMember.guild.roles.everyone,
                        deny: [PermissionFlagsBits.Connect],
                        allow: [],
                    },
                    {
                        id: newMember,
                        deny: [],
                        allow: [PermissionFlagsBits.Connect],
                    },
                ],
            });
        }
		else {
            voiceChannel = existingVoiceChannel;
            boosted = true;
        }

        await BoostedMembers.findOrCreate({ where: { userID: newMember.id }, defaults: { userID: newMember.id, channelID: voiceChannel.id, boostTime: Date.now() } });
        const boostChannel = await newMember.guild.channels.cache.get(channels.serverBoostChannel);
		if (boostChannel) return boostChannel.send({ content: `<@${newMember.id}>`, embeds: [boostEmbed(newMember, boosted, voiceChannel)] });
    },
    onBoostRemove: async function(newMember) {
        await BoostedMembers.destroy({ where: { userID: newMember.id } });

        const existingVoiceChannel = newMember.guild.channels.cache.find(
            (channel) => channel.name === newMember.user.username && channel.type === ChannelType.GuildVoice);
        if (existingVoiceChannel) {
            await existingVoiceChannel.delete();
        }
    },
};
