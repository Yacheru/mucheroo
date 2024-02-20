const { Events } = require('discord.js');
const { checkNewState, checkOldState } = require('../../components/voiceRooms/voiceManager');

module.exports = {
	name: Events.VoiceStateUpdate,
	async execute(oldState, newState) {
        const member = newState.member;
		const oldChannel = oldState.channel;
		const newChannel = newState.channel;

		if (newChannel) {
			await checkNewState(newChannel, member);
		}
		if (oldChannel) {
			await checkOldState(oldChannel);
		}
    },
};
