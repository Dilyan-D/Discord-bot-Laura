module.exports = {
	name: 'beep',
	description: 'A stupid, aimless game with the bot.',
	cooldown: 1,
	args: false,
	guildOnly: false,
	underMaintenance: false,
	execute(message, args) {
		if (message.channel.type !== 'GUILD_TEXT' && message.channel.type !== 'DM') return;
		
		const { sendMessage } = require('../functions.js');

		// Executes if arguments are not specified (cmd is being properly used)
		if (args.length == 0) {
			return message.channel.send('Boop.');
		}
		return sendMessage(message, "This command cannot receive arguments!", 6000); // Executes if arguments have been specified (cmd is being improperly used)
		
	},
};