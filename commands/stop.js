module.exports = {
	name: 'stop',
	description: 'Makes the bot leave her voice channel & clear the music queue.',
	cooldown: 3,
	args: false,
	aliases: ['s', 'clear', 'clearqueue', 'clearq', 'c'],
	guildOnly: true,
	underMaintenance: false,
	execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;

		// Check if bot is playing music, is in a voice channel & user is in that voice channel
		if (!guildQueue) return message.reply('I must be currently playing music in the server first!')
		if (!message.guild.me.voice) return message.reply('I need to be in a voice channel first before I can leave one! ;)').then(message.react('🤦‍♀️'));
		if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You need to be inside my voice channel in order to make me leave it!').then(message.react('🤦‍♀️'));

		const { sendMessage } = require('../functions.js');

		// Executes if arguments are not specified (cmd is being properly used)
		if (args.length == 0) {

			// Confirmation message
			message.reply("Are you sure you want me to leave the channel & clear the queue? (Yes/No)");

			// Listening for user's answer
			const filter = message => message.content.toLowerCase().startsWith('yes') || message.content.toLowerCase().startsWith('no') || message.content.toLowerCase().startsWith('y') || message.content.toLowerCase().startsWith('n');
			message.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] })
				.then(collected => {
					const msg = collected.first().content.toLowerCase();

					// Executes if user confirms deletion
					if (msg == 'yes' || msg == 'y') {

						guildQueue.stop();
						return sendMessage(message, "Clearing queue & leaving voice channel...", 5000);

					}
					else if (msg == 'no' || msg == 'n') // Executes if user cancels deletion
						return sendMessage(message, 'Cancelling command...', 4000);
				})
				.catch(err => { // Executes if user fails to answer on time
					return sendMessage(message, 'Timeout! Cancelling command...', 5000);
				});

		} else return sendMessage(message, "This command cannot receive arguments!", 6000); // Executes if arguments have been specified (cmd is being improperly used)

	},

};
