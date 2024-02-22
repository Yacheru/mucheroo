/* eslint-disable no-unused-vars */
const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { channels, roles } = require('../../config.json');
const { tempRooms } = require('../../database/models/mucherooDB');
const { infoLogger } = require('../../logs/logger');

const voiceArray = [];

module.exports = {
    checkNewState: async function(newChannel, member) {
        if (newChannel.id === channels.newChannelCreater) {
            await createTempRoom(member, newChannel.guild, 5);
        }
        else if (newChannel.id === channels.newChannelAdminCreater) {
            await createTempRoom(member, newChannel.guild, 2, true);
        }
        else if (!member.roles.cache.has(roles.admin) && newChannel.id !== channels.newChannelCreater) {
            await updatePermissions(newChannel, member);
        }
    },
    checkOldState: async function(oldChannel) {
        if (voiceArray.includes(oldChannel.id) && oldChannel.members.size === 0) {
            const index = voiceArray.indexOf(oldChannel.id);
            if (index !== -1) {
                voiceArray.splice(index, 1);
            }
            await deleteTempRoom(oldChannel);
        }
    },
};

async function createTempRoom(member, guild, userLimit, isAdmin = false) {
    const permissions = isAdmin ? [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.Connect] },
        { id: roles.admin, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Stream, PermissionFlagsBits.Connect] },
    ] : [
        { id: member, allow: [PermissionFlagsBits.Connect] },
        { id: member.guild.roles.everyone, allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles] },
    ];
    const channel = await guild.channels.create({
        name: member.displayName,
        type: ChannelType.GuildVoice,
        parent: member.voice.channel.parent,
        userLimit,
        permissionOverwrites: permissions,
    });
    voiceArray.push(channel.id);
    await member.voice.setChannel(channel);
    await tempRooms.upsert({ userID: member.id, channelID: channel.id, today: new Date(), adminRoom: isAdmin });
}

async function updatePermissions(channel, member) {
    const tempRoomRow = await tempRooms.findOne({ where: { channelID: channel.id } });
    if (tempRoomRow && tempRoomRow.adminRoom === true) {
        await channel.permissionOverwrites.edit(member.id, {
            ViewChannel: true,
            Connect: true,
            SendMessages: true,
            Stream: true,
        });
    }
}

async function deleteTempRoom(channel) {
    try {
        await channel.delete();
        await tempRooms.destroy({ where: { channelID: channel.id } });
        const index = voiceArray.indexOf(channel.id);
        if (index !== -1) {
            voiceArray.splice(index, 1);
        }
    }
    catch (error) {
        infoLogger.error('[TEMP-ROOMS] Ошибка при удалении комнаты', error);
    }
}
