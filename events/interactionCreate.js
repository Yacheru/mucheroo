const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction)  {
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
                await interaction.followUp({content: 'При выполнении команды произошла ошибка!', ephemeral: true });
            } else {
            await interaction.reply({ content: 'При выполнении команды произошла ошибка!', ephemeral: true})
            }
        }
    },
};