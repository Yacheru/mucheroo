const selectMenuHandler = require('../../../handlers/selectMenuHandler');

const { Warns } = require('../../../database/models/mucherooDB');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { v4: uuidv4 } = require('uuid');


module.exports = {
	deferred: false,
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Управления предупреждениями.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('give')
				.setDescription('Выдать предупреждение пользователю')
				.addUserOption((option) =>
					option
						.setName('member')
						.setDescription('Укажите пользователя')
						.setRequired(true))
				.addStringOption((option) =>
					option
						.setName('reason')
						.setDescription('Укажите причину выдачи')))
		.addSubcommand((subcommand) =>
			subcommand
				.setName('take')
				.setDescription('Снять предупреждение с пользователя')
				.addUserOption((option) =>
					option
						.setName('member')
						.setDescription('Укажите пользователя')
						.setRequired(true)))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		const command = interaction.options.getSubcommand();
		const member = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') ?? 'Причина не указана';

		if (member.user.bot) return interaction.reply({ content: 'Не указывайте ботов!', ephemeral: true });

		const now = Date.now();
		const key = `#${uuidv4()}`.slice(0, 6);
		const warnRow = await Warns.findOne({ where: { userID: member.id } });

		switch (command) {
		case 'give':
			if (warnRow) {
				const newData = { [key]: [interaction.member.id, reason, now] };
				await Warns.update({ warns: { ...warnRow.warns, ...newData } }, { where: { userID: member.id } });
			}
			else {
				await Warns.create({ userID: member.id, warns: { [key]: [interaction.member.id, reason, now] } });
			}

			return interaction.reply({ content: `Вы успешно выдали предупреждение ${member.displayName} c причиной ${reason} и ID: ${key}`, ephemeral: true });

		case 'take':
			if (warnRow) {
				return interaction.reply({ components: [selectMenuHandler.warnTakeSelect(interaction, warnRow.warns, member.id)], ephemeral: true });
			}
			else {
				return interaction.reply({ content: `У пользователя ${member.displayName} нет предупреждений`, ephemeral: true });
			}
		}
	},
};
