const { PermissionFlagsBits, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')

module.exports = {
    data: {
        name: 'ticket',
        description: 'Отправить эмбед с тикетом',
    },
    execute: async (client, message) => {
        const guildName = message.guild.name
        const guildIcon = `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png?size=1024`;
        const image = 'https://cdn.discordapp.com/attachments/1129601347352809532/1148476569342451752/infinity_support.png'
        const transperentImage = 'https://cdn.discordapp.com/attachments/1111378209934680087/1113885628132765747/invs.png?ex=65b29dd4&is=65a028d4&hm=c80c5c5b69314bbb4da2fa76d9e3d3f5860d5f90845783c4724a7e5fbf2ab3f1&'
        
        const ticketEmbedImage = new EmbedBuilder()
            .setImage(image)
        const ticketEmbed = new EmbedBuilder()
            .setAuthor({ name: guildName, iconURL: guildIcon })
            .setDescription(`При создании тикета необходимо предоставлять как можно больше подробной информации, включая видео/скриншоты, ссылки на доказательства и прочее, что может способствовать быстрому рассмотрению тикета\n\nПри создании тикета учитывайте время, в которое вы пишете. Время ответа на ваш тикет зависит от сложности обращения и загруженности администратции.`)
            .addFields({ name: '\u200B', value: '- [**Жалобы на администраторов**](https://infinity-tm.ru/complaints/)\n- [**Заявки на разбан**](https://infinity-tm.ru/bans/)' })
            .setImage(transperentImage)
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('player')
                .setLabel('Жалоба на игрока')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('questions')
                .setLabel('По любым вопросам')
                .setStyle(ButtonStyle.Secondary)
        );    

        message.channel.send({
            embeds: [ticketEmbedImage, ticketEmbed],
            components: [row],
        });
    },
};