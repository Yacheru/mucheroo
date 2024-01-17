const { Events } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute (message) {
        const mPrefix = prefix;

        if (!message.content.startsWith(mPrefix) || message.author.bot) return;
        const args = message.content.slice(mPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.prefix.get(commandName);

        if (!command) {
            console.error(`[${prefix}] Команда с именем [ ${commandName} ] не найдена!`)
            return;
        };

        try {
            await command.execute(message.client, message, args);
        } catch (error) {
            console.log(error);
            await message.reply({ content: 'При выполнении команды произошла ошибка!', ephemeral: true });
        };

    }
};