const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const folderPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(folderPath, folder);
    const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandsFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] В Команде по пути ${filePath} отсутствуют важные параметры: 'data' и 'execute'`)
        }
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`[/] Начато обновление ${commands.length} команд.`);

        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        
        console.log(`[/] ${data.length} команды успешно перезагружены.`);
    } catch (error) {
        console.error(error);
    }
})();