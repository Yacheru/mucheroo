const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once(Events.ClientReady, botReady => {
    console.log(`Готов! Запущен как: ${botReady.user.tag}`);
});

bot.login(token)