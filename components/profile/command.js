const buttonCollector = require('./buttons');
const embedCollector = require('./embed');

const { connections } = require('../../database/models/webApplication');


module.exports = {
    profileCommand: async function(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const member = interaction.options.getMember('member') ?? interaction.member;

        const connectionsRow = await connections.findByPk(member.id);

        const buttonsComponents = await buttonCollector.buttonsCollector(connectionsRow);
        const embedComponents = await embedCollector.profileEmbed(member, connectionsRow);

        return await interaction.editReply({ content: '', embeds: [embedComponents], components: [buttonsComponents], ephemeral: true });
    },
};
