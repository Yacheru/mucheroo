const buttonsHandler = require('../../components/ticketSystem/buttons');

const { EmbedBuilder } = require('discord.js');


module.exports = {
    data: {
        name: 'rules',
        description: 'правила',
    },
    execute: (message) => {
        const firstEmbedImage = new EmbedBuilder()
            .setImage('https://cdn.discordapp.com/attachments/1129601347352809532/1146282398502367252/84c944a7005cb58d.png?ex=6745e66c&is=674494ec&hm=ead48d6cc63f92e41ca57e2c7fadf6553952908782a892b11b0dba39e383734a&')
            .setColor(16777215);

        const firstEmbed = new EmbedBuilder()
            .setDescription('**1.1** Заходя на наши сервера или посетив официальный сайт (https://infinity-tm.ru) проекта, вы соглашаетесь с данными правилами и обязуетесь их исполнять.\\n\\n**1.2** Настоящие правила обязан выполнять любой игрок, зашедший на сервер (в т.ч. администраторы, управляющие, кураторы серверов и администраторы игрового портала)\\n\\n**1.3** Незнание Правил не только не освобождает Вас от ответственности за их нарушение, но и само по себе является нарушением.\\n\\n**1.4** Главная администрация имеет право выдать бан/мут за нарушение которое не описано правилами проекта и не соответствует общепринятым нормам. Наказание выдается на свое усмотрение.(К главной администрации относится Главный админ, Куратор проекта, Владелец, Создатель)\\n\\n**1.5** Администратор вправе увеличить срок последнего наказания в 2-3 раза, если нарушитель в течение последних 2 месяцев уже понес максимальное наказание. По истечению указанного периода времени, блокировка выдается со стандартным сроком.\\n\\n**1.6** Главная администрация в праве варьировать срок блокировок по своему усмотрению.\\n\\n**1.7** Муты на оба чата (чат + микрофон) выдаются на все причины, за исключением: спам в микрофон/чат и изменение голоса программами.')
            .setImage('https://cdn.discordapp.com/attachments/1111378209934680087/1113885628132765747/invs.png?ex=6690c294&is=668f7114&hm=ec5e1cd0e1dc2dde0e0c5466bfded026c2e976c0897a6a829a35919f84f8f818&')
            .setColor(16777215);

        const secondEmbedImage = new EmbedBuilder()
            .setColor(16708850)
            .setImage('https://cdn.discordapp.com/attachments/1129601347352809532/1146283104319832074/a58104be2ccbe253.png?ex=6745e714&is=67449594&hm=e4f90fb6897198355bc3aa6bbdcd8a5bb7b27043d2fc453df9cfb344fe8176a9&');

        const secondEmbed = new EmbedBuilder()
            .setDescription('**2.1** Использование любых программ, читов, багов, скриптов и всего того, что даёт преимущество над другими игроками! Также отказ от проверки приравнивается к хранению читов.\\n> Бан от суток до перманентного\\n\\n**2.2** Запрещено хамить, оскорблять других игроков/администраторов как в текстовом, так и в голосовом чате. \\n> Предупреждение -> От 8 – 24 часов Мута -> от 1 – 7-суточного  Бана.\\n\\n**2.3** Запрещается использовать: никнеймы, аватарки с личной информацией человека в своих личных целях, оскорбления, содержание нецензурной лексики в никнеймах и клан тегах, часто менять никнеймы в процессе игры.\\n> Предупреждение -> бан на 6 часов.\\n\\n**2.4** Рекламировать ресурсы, не связанные с игровым порталом infinity-tm.ru (содержание рекламы в текстовых сообщениях, никнеймах, голосовых сообщениях, а так же клановых тегах)\\n> Мут -> Бан 4 часа\\n\\n**2.5** Спамить, флудить, троллить, провоцировать других игроков, администраторов в текстовом и голосовом чате, а также других чатах проекта. Чрезмерное использование мата.\\n> От 3 - 8 часов Мута -> от 1-их – 3 суток  Бана. \\n\\n**2.6** Обход наказания: «Мут» / «Бан» (При выдаче наказания со стороны назначенных Администраторов имеют право указать примечание в отказе покупки размута/разбана.) В противном случае:\\n> Мут/Бан будет выдаваться повторно.\\n\\n**2.7** Слепить, препятствовать и использовать преимущества Привилегии “Vip” (использование инструментов). Касаемо игроков одной команды.\\n> предупреждение -> бан 1 час\\n\\n**2.8** Находится в одной зоне карты более 30 секунд (кемперство). За исключением малых карт, в зонах для установки бомбы.\\n> Предупреждение -> Убийство игрока -> Кик нарушителя -> Бан до 30-ти минут.\\n\\n**2.9** Запрещено оскорбление членов семьи других игроков/администраторов.\\n> от 3 – 14 суток Бана. \\n\\n**2.10** Запрещен любой спор с Администрацией не в документированных и необоснованных целях во время игрового процесса. Спор с администрацией касаемо правил проекта категорически запрещен. Используйте 3.1\\n> От 3-6 часов Мута -> От 1-их (суток) - 7 дней \\n\\n**2.11** Запрещается ПОЛНЫЙ мониторинг действий игроков.\\n> предупреждение -> От 3-6 часов Мута\\n\\n**2.12** Запрещено нарушать работу сервера.\\n> Бан навсегда.\\n\\n**2.13** Запрещается злоупотребление Voteban\'ом.\\n> Бан до 1 дня\\n\\n**2.14** Запрещается включать музыку, издавание раздражающих звуков, по типу использование сторонних программ для изменения голоса, неадекватного поведения. \\n> Предупреждение -> Мут -> От одних суток до перманентного бана.\\n\\n**2.15** На проекте запрещено обсуждение расовой принадлежности, национальности и политики.\\n> Бан от 1 до 7 дней.\\n\\n**2.16** Запрещено игнорирование администраторов, также если вы не услышали предупреждение от админа последует наказание.\\n> Бан от 4-часов до 1-дня.\\n\\n**2.17** Запрещается залазить на невидимые текстуры, использование багов. (Использование двойного прыжка в данных целях-Касательно “Vip” игроков).\\n> Бан от 1 до 7 дней \\n\\n**2.18** Запрещено выяснять конфликты на проекте.\\nПри нежелании одной из сторон участвовать в (Конфликте) ЗАПРЕЩЕНО все выносить за пределы проекта INFINITY в личные сообщения, всех мессенджеров, Steam профиле/сообщениях, беседах и др.\\n> От 8 – 24 часов Мута -> от 1-их – 7-суточного Бана. \\n\\n**2.19** Игрокам запрещено принимать участие в той или иной ситуации в которой они не присутствовали лично, и не являются свидетелем данной ситуации. (в разборе бана участвует: нарушитель, свидетель инцидента у которого есть доказательства нарушения, администратор забанивший нарушителя, Главная администрация сервера, кураторы и вышестоящая администрация)\\n> предупреждение -> бан до 1 дня\\n\\n**2.20** Запрещено принижать женский пол, в случае нарушение игроком одного из пунктов правил проекта по отношению к девушке выдается увеличенный бан.\\n> Бан, мут в двукратном размере в соответствии определенного пункта правил.')
            .setColor(16166819)
            .setImage('https://cdn.discordapp.com/attachments/1111378209934680087/1113885628132765747/invs.png?ex=6690c294&is=668f7114&hm=ec5e1cd0e1dc2dde0e0c5466bfded026c2e976c0897a6a829a35919f84f8f818&');

        const lastEmbed = new EmbedBuilder()
            .setDescription('**3.1** В случае неправомерного поведения администратора, игрок, по своему усмотрению, имеет право написать на него апелляцию на форуме. Апелляция подаётся в течение двух суток с момента выдачи наказания (Для подачи Апелляции предоставляйте ДЕМО-ЗАПИСЬ Нарушения). Обращаться в Соответствующий раздел\\n- [Жалобы на Администраторов](https://infinity-tm.ru/complaints/)\\n- [Заявка на разбан](https://infinity-tm.ru/bans/)\\n\\n\\n**3.2** Максимальный срок подачи апелляции для банов за правило 2.1 составляет 2 часа. По остальным блокировкам — не более 2 суток.\\n')
            .setColor(14702919)
            .setImage('https://cdn.discordapp.com/attachments/1111378209934680087/1113885628132765747/invs.png?ex=6690c294&is=668f7114&hm=ec5e1cd0e1dc2dde0e0c5466bfded026c2e976c0897a6a829a35919f84f8f818&')

        message.delete();
        message.channel.send({
            embeds: [firstEmbedImage, firstEmbed, secondEmbedImage, secondEmbed, lastEmbed],
            components: [buttonsHandler.ticketButtons()],
        });
    },
};
