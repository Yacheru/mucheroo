const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token, prefix } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ 	
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    presence: {
        activities: [{
            type: ActivityType.Competing,
            name: "разработке..."
        }],
    },
});

client.commands = new Collection();
client.prefix = new Collection()

const slashPath = path.join(__dirname, './commands/slash');
const slashsFolders = fs.readdirSync(slashPath);

for (const folder of slashsFolders) {
    const commandsPath = path.join(slashPath, folder);
    const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandsFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[/] [WARNING] В команде по пути ${filePath} отсутствуют важные параметры: 'data' и 'execute'`)
        };
    };
};

const eventsPath = path.join(__dirname, 'events');
const eventFile = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFile) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const prefixPath = path.join(__dirname, './commands/prefix');
const prefixFiles = fs.readdirSync(prefixPath).filter(file => file.endsWith('.js'));

for (const file of prefixFiles) {
    const filePath = path.join(prefixPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.prefix.set(command.data.name, command)
    } else {
        console.log(`[${prefix}] [WARNING] В команде по пути ${filePath} отсутствуют важные параметры: 'data' и 'execute'`)
    }
}

client.login(token)