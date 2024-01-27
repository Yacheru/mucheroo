const { Events, PermissionsBitField } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute (message) {
        await message.guild.members.fetch();
        
        const mPrefix = prefix;
        const member = message.guild.members.cache.get(message.author.id)

        if (!message.content.startsWith(mPrefix) || message.author.bot) return;
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.react('<a:whoareu:1199162349630799882>');
        const args = message.content.slice(mPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.prefix.get(commandName);

        if (!command) {
            console.error(`[${prefix}] Команда с именем [ ${commandName} ] не найдена!`)
            return;
        };

        try {
            await command.execute(message, args);
        } catch (error) {
            await message.reply({ content: 'При выполнении команды произошла ошибка!', ephemeral: true });
            console.log(error);
        };
    },
};