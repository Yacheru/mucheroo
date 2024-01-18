const { PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { transperentImage } = require('../../config.json')
const buttonsHandler = require('../../handlers/buttonsHandlers');


const infinitySupportImageTop = 'https://cdn.discordapp.com/attachments/1129601347352809532/1148476569342451752/infinity_support.png'


module.exports = {
    data: {
        name: 'ticket',
        description: 'Отправить эмбед с тикетом',
    },
    execute: async (client, message) => {
        const guildName = message.guild.name
        
        const ticketEmbedImage = new EmbedBuilder()
            .setImage(infinitySupportImageTop)
            
        const ticketEmbed = new EmbedBuilder()
            .setAuthor({ name: guildName, iconURL: message.guild.IconURL })
            .setDescription(`При создании тикета необходимо предоставлять как можно больше подробной информации, включая видео/скриншоты, ссылки на доказательства и прочее, что может способствовать быстрому рассмотрению тикета\n\nПри создании тикета учитывайте время, в которое вы пишете. Время ответа на ваш тикет зависит от сложности обращения и загруженности администратции.`)
            .addFields({ name: '\u200B', value: '- [**Жалобы на администраторов**](https://infinity-tm.ru/complaints/)\n- [**Заявки на разбан**](https://infinity-tm.ru/bans/)' })
            .setImage(transperentImage)
         

        message.channel.send({
            embeds: [ticketEmbedImage, ticketEmbed],
            components: [buttonsHandler.ticketButtons()],
        });
    },
};