const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    createPlayerModal: function () {
        return new ModalBuilder()
            .setCustomId('playerModal')
            .setTitle('Жалоба игрока')
            .setComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('playerLink')
                        .setLabel('Ссылка на игрока:')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Укажите steam-профиль нарушителя')
                        .setRequired(true)
                        .setMaxLength(100)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('proofs')
                        .setLabel('Доказательство:')
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Укажите ссылку на фото/видео доказательство')
                        .setRequired(true)
                        .setMaxLength(500)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('brokenRules')
                        .setLabel('Что нарушил игрок:')
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder('Опишите, что нарушил по вашему игрок')
                        .setRequired(true)
                        .setMaxLength(2000)
                ),
            );
    },

    handlePlayerModalSubmit: function (interaction) {
        if (interaction.customId === 'playerModal') {
            const playerLink = interaction.fields.getTextInputValue('playerLink');
            const proofs = interaction.fields.getTextInputValue('proofs');
            const brokenRules = interaction.fields.getTextInputValue('brokenRules');

            interaction.reply({ content: `- Ссылка на игрока: ${playerLink}\n- Доказательства: ${proofs}\n- Нарушенные правила: ${brokenRules} `, ephemeral: true });
        }
    }
};
