const { EmbedBuilder, channelMention, Colors, time, userMention } = require('discord.js');
const config = require('../../configs/config.json');

const danger = Colors.Red;
const warn = Colors.Yellow;
const success = Colors.Green;

const templateEmbed = new EmbedBuilder()
    .setImage(config.images.transperentImage)
    .setTimestamp();


module.exports = {
    notInVoice: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(warn)
            .setDescription(`- Для взаимодействия создайте комнату - ${channelMention(config.channels.newChannelCreater)}`);
    },
    notOwner: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Вы не являетесь создателем комнаты!');
    },
    notCorrectUser: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Некорректный пользователь.');
    },
    lockOrOpenRoom: function(message, memberId) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- Вы успешно ${message} комнату пользователю ${userMention(memberId)}`);
    },
    transferRoom: function(memberId) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- Вы успешно передали владение комнатой пользователю ${userMention(memberId)}`);
    },
    noTemplate: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- У вас нет созданного шаблона!');
    },
    createTemplateSuccess: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription('- Ваш шаблон успешно создан!');
    },
    deleteTemplateSuccess: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription('- Ваш шаблон успешно удалён!');
    },
    cancelCreateTemplate: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription('- Вы успешно отменили запрос на создание комнаты!');
    },
    templateChannel: function(move) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- Комната изменена на **${move}**!`);
    },
    haveOrCreateTemplate: function(member, templateRow, voiceChannel) {
        const haveOrCreateEmbed = new EmbedBuilder(templateEmbed)
            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
            .setThumbnail(member.displayAvatarURL());


        if (templateRow) {
            return haveOrCreateEmbed
                .setColor(danger)
                .setDescription('> У вас уже создан шаблон!')
                .addFields(
                    { name: 'Настройки', value: `- Название: **${templateRow.channelName}**\n- Лимит участников: **${templateRow.channelLimit === 0 ? 'Без ограничений' : templateRow.channelLimit}**\n- Битрейт: **${templateRow.channelBitrate}**\n- Дата создания: ${time(new Date(templateRow.createdAt), 'R')}` },
                )
                .setFooter({ text: 'Нажмите на кнопку ниже, чтобы удалить шаблон' });
        }
        else {
            return haveOrCreateEmbed
                .setColor(warn)
                .setDescription('> У вас нет личных шаблонов. Желаете создать?')
                .addFields(
                    { name: 'Настройки:', value: `- Название: **${voiceChannel.name}**\n- Лимит участников: **${voiceChannel.userLimit === 0 ? 'Без ограничений' : voiceChannel.userLimit}**\n- Битрейт: **${voiceChannel.bitrate}**` },
                )
                .setFooter({ text: 'Вы можете предложить другие параметры для хранения в шаблоне - @yacheru' });
        }
    },
    newName: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- ${config.tmpvoiceIcons.name} Название канала успешно изменено!`);
    },
    newLimit: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- ${config.tmpvoiceIcons.limit} Лимит участников успешно изменен!`);
    },
    maxLimit: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription(`- ${config.tmpvoiceIcons.upslot} Лимит участников достиг максимума!`);
    },
    minLimit: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription(`- ${config.tmpvoiceIcons.downslot} Лимит участников достиг минимума!`);
    },
    hideChannel: function(message) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- ${config.tmpvoiceIcons.hide} Комната успешно ${message}!`);
    },
    privateChannel: function(message) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- ${config.tmpvoiceIcons.private} Комната успешно ${message}!`);
    },
    noOpenAdminRoom: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Комнату администратора нельзя открыть публично! Перекиньте пользователя из другого канала или используйте команду </room access:1202279762689806416>');
    },
    infoChannel: function(channel, memberAvatar, ownerId, adminRoom, templateRoom, members) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setTitle(`Комната - ${channel.name}`)
            .setThumbnail(memberAvatar)
            .setFields(
                { name: 'Настройки', value: `- Название: ${channel.name}\n- Лимит участников: ${channel.members.size}/${channel.userLimit}\n- Битрейт: ${channel.bitrate}\n- Создана: ${time(channel.createdAt, 'R')}\n- Создатель: ${userMention(ownerId)}\n- Комната администраторов: ${adminRoom}\n- Шаблонная: ${templateRoom}` },
                { name: 'Участники', value: `${members}` },
            )
            .setTimestamp();
    },
    tempRoomsInfo: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setFields(
                { name: 'Про кнопки:', value: `- ${config.tmpvoiceIcons.upslot} / ${config.tmpvoiceIcons.downslot} - Данные кнопки изменяют лимит вашей комнаты на 1 в + или -.\n- ${config.tmpvoiceIcons.hide} - Данная кнопка скрывает/показывает ваш канал в списке каналов.\n- ${config.tmpvoiceIcons.private} - Данная кнопка открывает/скрывает ваш канал.\n- ${config.tmpvoiceIcons.voice} - Включить или выключить пользователю в вашей комнате микрофон.\n- ${config.tmpvoiceIcons.template} - Создать свой шаблон. Потом его можно применить в меню выбора.\n- ${config.tmpvoiceIcons.limit} - Поможет вам изменить лимит участников комнаты до желаемого.\n- ${config.tmpvoiceIcons.name} - Используйте, если нужно изменить название своей комнаты.\n- ${config.tmpvoiceIcons.info} - Узнать информацию о канале в котором вы находитесь.\n- ${config.tmpvoiceIcons.more} - Вызовет данное осведомительное сообщение вновь.`, inline: false },
                { name: 'Про меню выбора:', value: `- **Шаблоны каналов** - Предустановленные настройки комнаты. Комнату нельзя изменить кнопками.\n - ${config.tmpvoiceIcons.template} Мой шаблон - Применяется собственный шаблон.\n - ${config.tmpvoiceIcons.communicat} Общение - 25 участников, 128 кб/с, открытый канал.\n - ${config.tmpvoiceIcons.cinema} Кинотеатр - Безлимит, 128кб/с, Говорит только создатель.\n- **Качество звука** - Изменяет bitrate (качество) звука в вашей комнате.\n - 24кб/c - Плохое качество звука.\n - 64кб/с - Аналогично личным звонкам.\n - 128кб/с - Лучше личных звонков.\n - 256кб/с - Очень хорошее качество звука.\n - 384кб/с - Наилучшее качество звука.` },
                { name: 'Про команды:', value: '- </room access:1202279762689806416> - Запретите или выдайте права на вход в вашу комнату.\n- </room owner:1202279762689806416> - Передайте владение комнатой другому пользователю.' },
                { name: 'Про каналы:', value: `- ${channelMention(config.channels.newChannelCreater)} - Основной триггерный канал. При заходе в него вы создадите личную комнату.\n- ${channelMention(config.channels.newChannelAdminCreater)} - Триггерный канал для администраторов. Проверки или собрания проходят в этих комнатах.` },
            );
    },
    changeBitrateSuccess: function(bitrate, userBitrate) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- Успешно установлено ${bitrate} (${userBitrate})`);
    },
    notSupportedBitrate: function(boostLevel) {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription(`- Сервер не поддерживает данный уровень битрейта! Необходим - **${boostLevel}** уровень буста.`);
    },
    noUsersInVoice: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Это действие невозможно, потому что в комнате нет никого, кроме вас.');
    },
    searchUserFail: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Не удалось найти пользователя!');
    },
    userNotInVoice: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Пользователь не находится в голосовом канале!');
    },
    muteOrUnmuteUser: function(message, memberId) {
        return new EmbedBuilder(templateEmbed)
            .setColor(success)
            .setDescription(`- Вы успешно ${message}и пользователя ${userMention(memberId)}`);
    },
    notCorrectNumber: function() {
        return new EmbedBuilder(templateEmbed)
            .setColor(danger)
            .setDescription('- Введите целочисленное значение от 0 до 99!');
    },
};
