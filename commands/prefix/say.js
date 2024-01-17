const { PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: {
        name: 'ticket',
        description: 'Отправить эмбед с тикетом',
    },
    execute: async (client, message, args) => {
        const channel = message.mentions.channels.first();
        const msg = args.slice(1).join(' ');
        
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply({ content: 'Вы не можете использовать данную команду!!!', ephemeral: true });
        if (!channel) return message.reply({ content: 'Укажите канал для отправки', ephemeral: true });
        if (!msg) return message.reply({ content: 'Укажите сообщение для отправки', ephemeral: true });
        
        channel.send(msg);
    }
}