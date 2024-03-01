const { voiceActivity } = require('../../database/models/mucherooDB');
const { time } = require('discord.js');


function pluralize(number, single, few, many) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return single;
    }
    else if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
        return few;
    }
    else {
        return many;
    }
}


module.exports = {
    formatTime: function(seconds) {
        if (seconds < 0) return 'Время не может быть отрицательным';

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        const daysStr = days > 0 ? `${days} ${pluralize(days, 'день', 'дня', 'дней')}` : '';
        const hoursStr = hours > 0 ? `${hours} ${pluralize(hours, 'час', 'часа', 'часов')}` : '';
        const minutesStr = minutes > 0 ? `${minutes} ${pluralize(minutes, 'минута', 'минуты', 'минут')}` : '';

        const parts = [daysStr, hoursStr, minutesStr].filter(Boolean);
        return parts.join(' ');
    },

    voiceActivityTime: async function(memberid) {
        const voiceActivityRow = await voiceActivity.findOne({ where: { userID: memberid } });

        let day = '0 ч. 0 мин.';
        let week = '0 ч. 0 мин.';
        let all = '0 ч. 0 мин.';

        if (voiceActivityRow) {
            day = `${Math.floor(voiceActivityRow.today / 3600)} ч. ${Math.floor(voiceActivityRow.today % 3600 / 60)} мин.`;
            week = `${Math.floor(voiceActivityRow.week / 3600)} ч. ${Math.floor(voiceActivityRow.week % 3600 / 60)} мин.`;
            all = `${Math.floor(voiceActivityRow.all / 3600)} ч. ${Math.floor(voiceActivityRow.all % 3600 / 60)} мин.`;
        }

        return { 'day': day, 'week': week, 'all': all };
    },

    getFormattedTime: function(inputTimestamp) {
        const roundedTimestamp = Math.round(inputTimestamp / 1000);
        const dayTime = time(roundedTimestamp, 'd');
        const rTime = time(roundedTimestamp, 'R');

        return `${dayTime} (${rTime})`;
    },
};
