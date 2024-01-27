const { PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')
const { channels, tmpvoiceIcons } = require('../config.json')


module.exports = {
    tamplateRooms: function () {
        return new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('templateRooms')
            .setPlaceholder('Шаблоны каналов')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Мой шаблон')
                    .setValue('мой шаблон')
                    .setDescription('Применить собственный шаблон')
                    .setEmoji(tmpvoiceIcons.template),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Общение')
                    .setValue('общение')
                    .setDescription('25 участников, 128 кб/с, открытый канал')
                    .setEmoji(tmpvoiceIcons.communicat),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Кинотеатр')
                    .setValue('кинотеатр')
                    .setDescription('Безлимит, 128 кб/с, Говорит только создатель.')
                    .setEmoji(tmpvoiceIcons.cinema),
            ),
        );
    }, bitrateChange: function () {
        return new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('bitrateChange')
            .setPlaceholder('Качество звука')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Низкое')
                    .setValue('низкое')
                    .setDescription('24 кб/с.'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Среднее')
                    .setValue('среднее')
                    .setDescription('64 кб/с.'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Хорошее')
                    .setValue('хорошее')
                    .setDescription('128 кб/с.'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Высшее')
                    .setValue('высшее')
                    .setDescription('256 кб/с. Лидерам общения!')
                    .setEmoji(tmpvoiceIcons.voiceLeader),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Наивысшее')
                    .setValue('наивысшее')
                    .setDescription('384 кб/с. Бустерам сервера на 3 уровне сервера.')
                    .setEmoji(tmpvoiceIcons.boosted),    
            ),
        );
    },
};