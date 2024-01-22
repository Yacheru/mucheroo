const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, userMention } = require('discord.js');
const { channels, icons, transperentImage } = require('../../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Выдать Тайм-Аут')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('Выберите пользователя')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('time')
                .setDescription('Укажите срок выдачи тайм-аута [пример: 1w ; 1d ; 1h ; 10m ; 10s]')
                .setAutocomplete(true)
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Причина Тайм-Аута')
                .addChoices(
                    { name: 'Реклама', value: 'Реклама сторонних сервисов, сайтов, услуг, серверов и т.д.' },
                    { name: 'Любая подозрительная активность', value: 'Подозрительная активность пользователя.' },
                    { name: 'Нарушение правил', value: 'Прочие нарушения правил сервера.' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false),
    async execute (interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') ?? 'Причина не указана.';
        const time = interaction.options.getString('time');

        const timeValues = time.match(/(\d+)([wdhms])/g);
        if (!timeValues) {
            await interaction.reply({ content: 'Указан неверный формат времени.', ephemeral: true });
            return;
        }

        let timeout = 0;
        for (const value of timeValues) {
            const amount = parseInt(value.slice(0, -1));
            const unit = value.slice(-1);
            switch (unit) {
                case 'w':
                    timeout += amount * 7 * 24 * 60 * 60 * 1000;
                    break;
                case 'd':
                    timeout += amount * 24 * 60 * 60 * 1000;
                    break;
                case 'h':
                    timeout += amount * 60 * 60 * 1000;
                    break;
                case 'm':
                    timeout += amount * 60 * 1000;
                    break;
                case 's':
                    timeout += amount * 1000;
                    break;
            }
        };
        if (timeout >= 2_419_200_000) return interaction.reply({ content: 'Не указывайте 28 дней и более!', ephemeral: true })

        const logChannel = interaction.guild.channels.cache.find(channel => channel.name === channels.logschannel);
        const creator = interaction.member;

        const muteEmbed = new EmbedBuilder()
            .setColor('#2f3236')
            .setAuthor({ name: 'Тайм-Аут участника', iconURL: icons['time-out'] })
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                { name: 'Исполнитель:', value: `${creator.displayName}\n(${userMention(creator.id)})`, inline: true },
                { name: 'Участник:', value: `${member.displayName}\n(${userMention(member.id)})`, inline: true }
            )
            .addFields({ name: 'Причина:', value: reason })
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setImage(transperentImage)
            .setTimestamp();
        
        await logChannel.send({ embeds: [muteEmbed] });
        await interaction.reply({content: `Пользователь ${member.displayName} успешно наказан по причине: **${reason}**`, ephemeral: true});
        await member.timeout(timeout);
    },
    async autocomplete (interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = [ 'Одна неделя: 1w', 'Один день: 1d', 'Один час: 1h', 'Тридцать минут: 30m', 'Шестьдесят секунд: 60s' ];
        const filterd = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filterd.map(choice => ({ name: choice, value: choice })),
        );
    },
};