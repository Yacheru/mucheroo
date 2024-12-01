const { Events, PermissionsBitField } = require('discord.js');
const { Messages } = require('../../database/models/mucherooDB');
const { infoLogger } = require('../../logs/logger');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        await message.guild.members.fetch();

        const messageRow = await Messages.findOne({ where: { userID: message.author.id } });

        try {
            await messageRow.decrement('count');
        }
        catch (error) {
            infoLogger.error(`[MESSAGES] Ошибка декремента количества сообщений: ${error}`);
        }
    },
};