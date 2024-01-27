const { PermissionFlagsBits, EmbedBuilder, channelMention } = require('discord.js')
const { images, channels, tmpvoiceIcons } = require('../../config.json')
const buttonsHandler = require('../../handlers/buttonsHandlers');
const selectMenuHandler = require('../../handlers/selectMenuHandler');

module.exports = {
    data: {
        name: 'voice',
        description: 'Отправить эмбед с приватные комнатами',
    },
    execute: (message) => {
        const topImageEmbed = new EmbedBuilder()
            .setImage(images.privateRoomsImage)
            .setColor('#ebc034');
        const tmpVoiceEmbed = new EmbedBuilder()
            .setColor('#ebc034')
            .setAuthor({ name: 'Приватные комнаты', iconURL: images.authorHourglass })
            .setDescription(`Это приватные комнаты, которые создаются при входе в триггерный канал и удаляются, если в них нет участников.\n\n- ${channelMention(channels.newChannelCreater)}\n\nИзменяйте конфигурацию вашей комнаты благодаря кнопкам. Изменяйте лимит - ${tmpvoiceIcons.limit}, Закрывайте/Открывайте канал кнопкой - ${tmpvoiceIcons.private} и многое другое... Подробнее по кнопке - ${tmpvoiceIcons.more}`)
            .setImage(images.voiceDescription)
            .setFooter({ text: 'Присоединитесь к голосовому каналу для взаимодействия с кнопками' });

        message.channel.send({
            embeds: [topImageEmbed, tmpVoiceEmbed],
            components: [
                buttonsHandler.voiceRoomsButtonsRowFirst(), 
                buttonsHandler.voiceRoomsButtonsRowSecond(), 
                buttonsHandler.voiceRoomsButtonsRowThird(),
                selectMenuHandler.tamplateRooms(),
                selectMenuHandler.bitrateChange()
            ]
        });
    },
};