const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const buttons = {
    spotify: {
        label: 'spotify',
        url: (url) => `https://open.spotify.com/user/${url}`,
    },
    steam: {
        label: 'steam',
        url: (url) => `https://steamcommunity.com/profiles/${url}`,
    },
    twitch: {
        label: 'twitch',
        url: (url) => `https://www.twitch.tv/${url}`,
    },
    youtube: {
        label: 'youtube',
        url: (url) => `https://www.youtube.com/channel/${url}`,
    },
    instagram: {
        label: 'instagram',
        url: (url) => `https://www.instagram.com/${url}`,
    },
};

function createButton(type, url) {
    const buttonConfig = buttons[type];
    return new ButtonBuilder()
        .setLabel(buttonConfig.label)
        .setStyle(ButtonStyle.Link)
        .setURL(buttonConfig.url(url));
}

function noConnectsButton() {
    return new ButtonBuilder()
        .setLabel('Подключить')
        .setStyle(ButtonStyle.Link)
        .setURL('https://yacheru.ru/login');
}

module.exports = {
    buttonsCollector: async function(connects) {
        const connectionsActionRow = new ActionRowBuilder();

        if (!connects) return connectionsActionRow.addComponents(noConnectsButton());

        const valuesDict = {
            'spotify': connects.spotify,
            'steam': connects.steam,
            'twitch': connects.twitch,
            'youtube': connects.youtube,
            'instagram': connects.instagram,
        };

        Object.keys(valuesDict).forEach((key) => {
            if (valuesDict[key] !== '0') {
                connectionsActionRow.addComponents(createButton(key, valuesDict[key]));
            }
        });

        return connectionsActionRow;
    },
};
