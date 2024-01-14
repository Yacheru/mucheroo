const { Client, Events, GatewayIntentBits, Collection, } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandsFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] В Команде по пути ${filePath} отсутствуют важные параметры: 'data' и 'execute'`)
        }
    }
}

client.once(Events.ClientReady, clientReady => {
    console.log(`Готов! Запущен ${clientReady.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Команда с именем ${interaction.commandName} не найдена!`)
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'При выполнении команды произошла ошибка!',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: 'При выполнении команды произошла ошибка!',
                ephemeral: true
            });
        }
    }
});

client.login(token)