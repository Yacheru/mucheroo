const { PermissionFlagsBits, Events, ChannelType } = require('discord.js');
const { channels, roles } = require('../../config.json');
const { tempRooms } = require('../../database/models');
const voiceArray = [];

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
		const member = newState.guild.members.cache.get(newState.id);

		if (newState.channel) {
			if (newState.channel.id === channels.newChannelCreater) {
				const tempRoomRow = await tempRooms.findOne({ where: { userID: member.id } });
				const channel = await newState.guild.channels.create({
					name: member.displayName,
					type: ChannelType.GuildVoice,
					parent: newState.channel.parent,
					userLimit: 5,
				});
				member.voice.setChannel(channel);
				voiceArray.push(channel.id);
				channel.permissionOverwrites.edit(member, { Connect: true, ManageChannels: true });

				if (tempRoomRow) {
					await tempRooms.update({ channelID: channel.id }, { where: { userID: member.id } });
				}
				else {
					await tempRooms.create({ userID: newState.member.id, channelID: channel.id });
				}
			}
			else if (newState.channel.id === channels.newChannelAdminCreater) {
				const tempRoomRow = tempRooms.findOne({ where: { userID: member.id } });
				const channel = await newState.guild.channels.create({
					name: member.displayName,
					type: ChannelType.GuildVoice,
					parent: newState.channel.parent,
					userLimit: 2,
					permissionOverwrites: [
						{
							id: member.guild.roles.everyone,
							deny: [PermissionFlagsBits.Connect],
							allow: [],
						},
						{
							id: roles.gay,
							deny: [],
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Stream, PermissionFlagsBits.Connect],
						},
					],
				});
				member.voice.setChannel(channel);
				voiceArray.push(channel.id);
				channel.permissionOverwrites.edit(member, { Connect: true, ManageChannels: true });
				if (tempRoomRow) {
					await tempRooms.update({ channelID: channel.id }, { where: { userID: member.id } });
				}
				else {
					await tempRooms.create({ userID: newState.member.id, channelID: channel.id });
				}
			}

			if (!newState.member.roles.cache.some((role) => role.id === roles.gay)) {
				const tempRoomRow = await tempRooms.findOne({ where: { channelID: newState.channel.id } });

				if (tempRoomRow.adminRoom) {
					newState.channel.permissionOverwrites.edit(newState.id, {
						ViewChannel: true,
						Connect: true,
						SendMessages: true,
						Stream: true,
					});
				}
				else {
					return;
				}
			}
		}
		else if (oldState.channel) {
			if (voiceArray.includes(oldState.channel.id) && oldState.channel.members.size === 0) {
				oldState.channel.delete();
				await tempRooms.destroy({ where: { channelID: oldState.channel.id } });
			}
		}
	},
};
