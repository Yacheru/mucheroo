const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: {
        name: 'say',
        description: 'Отправить сообщение от лица бота',
    },
    execute: async (client, message, args) => {

        const channel = message.mentions.channels.first();
        const msg = args.slice(1).join(' ');
        
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({ content: 'У вас нет прав на использование данной команды!!!' });
        if (!channel) return message.reply({ content: 'Укажите канал для отправки' });
        if (!msg) return message.reply({ content: 'Укажите сообщение для отправки' });
        
        channel.send(msg);
    }
}