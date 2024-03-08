const SteamID = require('steamid');

const { EmbedBuilder, time, channelMention } = require('discord.js');
const { voiceState, warns } = require('../../database/models/mucherooDB');
const { formatTime, voiceActivityTime, timestampFormatted } = require('./funcs');
const { lvlBase } = require('../../database/models/level_ranks');
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
            stats += lvlBaseRow ? `${formatTime(lvlBaseRow.playtime)}\n- Последние посещение: ${timestampFormatted(lvlBaseRow.lastconnect, true)}` : 'Не найден в статистике\n- Последние посещение: Не найден в статистике';
        }
        else {
            stats += `${connectLink}\n- Последние посещение: ${connectLink}`;
        }

        const warnsCount = warnsRow ? Object.keys(warnsRow.warns).length : 0;
        const guildJoinedAt = timestampFormatted(member.joinedTimestamp, false);
        const accCreatedAt = timestampFormatted(member.user.createdTimestamp, false);
        const lastActivity = voiceStateRow ? `${timestampFormatted(voiceStateRow.joinedAt, false)} (${channelMention(voiceStateRow.channelID)})` : 'Отсутствует';

        const voiceActivity = await voiceActivityTime(member.id);

        return new EmbedBuilder()
            .setAuthor({ name: `${member.displayName} (${member.id})`, iconURL: member.displayAvatarURL() })
            .setFields(
                { name: 'Предупреждения', value: `- Количество: ${warnsCount}` },
                { name: 'Информация', value: `- Присоединился: ${guildJoinedAt}\n- Аккаунт создан: ${accCreatedAt}` },
                { name: 'INFINITY ', value: `- Администратор: ${isAdmin}\n${stats}` },
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
