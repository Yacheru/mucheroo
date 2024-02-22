const { EmbedBuilder, time, channelMention } = require('discord.js');
const SteamID = require('steamid');

const { voiceState, warns } = require('../../database/models/mucherooDB');
const { lvlBase } = require('../../database/models/level_ranks');

const { formatTime, voiceActivityTime, getFormattedTime } = require('./funcs');
const { roles } = require('../../config.json');

module.exports = {
    profileEmbed: async function(member, connectionsRow) {
        const connectLink = '[Подключить](https://yacheru.ru/login)';
        const isAdmin = member.roles.cache.has(roles.admin) ? 'Да' : 'Нет';

        const warnsRow = await warns.findOne({ where: { userID: member.id } });
        const voiceStateRow = await voiceState.findOne({ where: { userID: member.id } });

        let stats = '- Общий онлайн: ';
        if (connectionsRow && connectionsRow.steam !== '0') {
            const steamID = new SteamID(connectionsRow.steam).getSteam2RenderedID(true);
            const lvlBaseRow = await lvlBase.findOne({ where: { steam: steamID } });
            stats += lvlBaseRow ? `${formatTime(lvlBaseRow.playtime)}\n- Последние посещение: ${time(Math.round(lvlBaseRow.lastconnect), 'd')} (${time(Math.round(lvlBaseRow.lastconnect), 'R')})` : 'Не найден в статистике\n- Последние посещение: Не найден в статистике';
        }
        else {
            stats += `${connectLink}\n- Последние посещение: ${connectLink}`;
        }

        const warnsCount = warnsRow ? Object.keys(warnsRow.warns).length : 0;
        const guildJoinedAt = getFormattedTime(member.joinedTimestamp);
        const accCreatedAt = getFormattedTime(member.user.createdTimestamp);
        const lastActivity = voiceStateRow ? `${getFormattedTime(voiceStateRow.joinedAt)} (${channelMention(voiceStateRow.channelID)})` : 'Отсутствует';

        const voiceActivity = await voiceActivityTime(member.id);

        return new EmbedBuilder()
            .setAuthor({ name: `${member.displayName} (${member.id})`, iconURL: member.displayAvatarURL() })
            .setFields(
                { name: 'Предупреждения', value: `- Количество: ${warnsCount}` },
                { name: 'Активность', value: `- Присоединился: ${guildJoinedAt}\n- Аккаунт создан: ${accCreatedAt}` },
                { name: 'INFINITY статистика', value: `- Администратор: ${isAdmin}\n${stats}` },
                { name: 'Голосовая активность', value: `- Последняя: ${lastActivity}` },
                { name: '> **Сутки:**', value: `\`\`\`${voiceActivity.day}\`\`\``, inline: true },
                { name: '> **Неделя:**', value: `\`\`\`${voiceActivity.week}\`\`\``, inline: true },
                { name: '> **Всё время:**', value: `\`\`\`${voiceActivity.all}\`\`\``, inline: true },
            )
            .setThumbnail(member.displayAvatarURL())
            .setFooter({ text: 'Соц. Сети пользователя по кнопкам' })
            .setTimestamp();
    },
};
