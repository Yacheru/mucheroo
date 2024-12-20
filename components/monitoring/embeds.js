const { timeInGame, timeInVoice } = require('../voiceActivity/voiceState');
const { EmbedBuilder, Colors } = require('discord.js');

function roundTo(num) {
    if (num < 10) {
        return 0;
    }
    else {
        return Math.floor(num / 10) * 10;
    }
}

module.exports = {
    async serverEmbed(countryCode, server) {
        let players = '';
        let kills = '';
        let time = '';
        let stats = [];
        let i = 1;

        server.players.forEach((row) => players += `${i++}) ${row.name.slice(0, 17)}\n`);
        server.players.forEach((row) => kills += `${row.raw.score}\n`);
        server.players.forEach((row) => {time += `${timeInVoice(row.raw.time * 1000)}\n`;});

        if (players) {
            stats = [
                { name: '# **Игрок**', value: `${players}`, inline: true },
                { name: '**Убийств**', value: `${kills}`, inline: true },
                { name: '**Время**', value: `${time}`, inline: true },
            ];
        }
        else {
            stats = [
                { name: '\u200b', value: '- **На сервере нет игроков**' },
            ];
        }

        const images = {
            '0%': 'https://i.imgur.com/AXI5LbK.png', '60%': 'https://i.imgur.com/y8aJyeh.png',
            '10%': 'https://i.imgur.com/6SBy0vX.png', '70%': 'https://i.imgur.com/cfbqbvb.png',
            '20%': 'https://i.imgur.com/i0biL51.png', '80%': 'https://i.imgur.com/LQ8ARMK.png',
            '30%': 'https://i.imgur.com/sbQLEsQ.png', '90%': 'https://i.imgur.com/A5UMygF.png',
            '40%': 'https://i.imgur.com/ZscUiYj.png', '100%': 'https://i.imgur.com/TKQoGyS.png',
            '50%': 'https://i.imgur.com/cu9hJew.png',
        };
        const precent = `${roundTo((server.numplayers / server.maxplayers) * 100)}%`;


        return new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle(`${server.name}`)
            .setThumbnail(`https://infinity-tm.ru/files/maps_imgs/${server.map}.jpg`)
            .setDescription(`\`\`\`connect ${server.connect}\`\`\``)
            .addFields(
                { name: 'Карта:', value: `${server.map}`, inline: true },
                { name: 'Игроков:', value: `${server.numplayers}/${server.maxplayers} [${Math.round((server.numplayers / server.maxplayers) * 100)}%]`, inline: true },
                { name: 'Локация:', value: `:flag_${countryCode.toLowerCase()}: ${countryCode}`, inline: true },
                ...stats,
            )
            .setImage(images[precent])
            .setTimestamp()
            .setFooter({ text: 'Последнее обновление:', iconURL: 'https://cdn.discordapp.com/emojis/1136918354276388864.gif' });
    },
    errorEmbed() {
        return new EmbedBuilder()
            .setColor(Colors.Red)
            .setImage('https://i.imgur.com/AXI5LbK.png')
            .setThumbnail('https://infinity-tm.ru/files/maps_imgs/none.jpg')
            .setDescription('- Сервер недоступен, возможно, выключен.')
            .setTimestamp()
            .setFooter({ text: 'Последнее обновление:', iconURL: 'https://cdn.discordapp.com/emojis/1136918354276388864.gif' });
    },
};
