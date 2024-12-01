const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, userMention } = require('discord.js');
const { Warns } = require('../database/models/mucherooDB');
const { icons } = require('../configs/config.json');


module.exports = {
	warnTakeSelect: function(interaction, warnsrow, memberid) {
		if (Object.keys(warnsrow).length === 0) {
			return new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('CustomID')
					.setPlaceholder('У пользователя нет предупреждений')
					.setDisabled(true)
					.addOptions(new StringSelectMenuOptionBuilder()
						.setLabel('label')
						.setValue('emptyvalue')));
		}
		else {
			return new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('warnTakeSelect')
					.setPlaceholder('Выберите предупреждение')
					.setOptions(...Object.values(warnsrow)
						.map((warn) => ({
							label: `${Object.keys(warnsrow).find((key) => warnsrow[key] === warn)} [${warn[1]}]`,
							value: `${[memberid, Object.keys(warnsrow).find((key) => warnsrow[key] === warn)]}`,
							description: `${interaction.guild.members.cache.get(warn[0]).displayName} • ${new Date(warn[2]).toLocaleString()}`,
							emoji: icons.warn,
						})),
					),
			);
		}
	}, warnTakeSelectCallback: async function(interaction) {
		const [memberId, warnKey] = interaction.values[0].split(',');

		const warnRow = await Warns.findOne({ where: { userID: memberId } });

		delete warnRow.warns[warnKey];

		await Warns.update({ warns: { ...warnRow.warns } }, { where: { userID: memberId } });

		interaction.update({
			content: `Вы успешно удалили предупреждение ${warnKey} пользователя ${userMention(memberId)}`,
			components: [this.warnTakeSelect(interaction, warnRow.warns, memberId)],
		});
	},
};
