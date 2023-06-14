module.exports = {
	name: 'pause',
	description: 'Makes the bot pause the playing of music.',
	cooldown: 3,
	args: true,
	aliases: ['pa'],
	usage: '[0/false/1/true]',
	guildOnly: true,
	underMaintenance: false,
	execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;

		// Check if bot is playing music, is in a voice channel & user is in that voice channel
		if (!guildQueue) return message.reply('I must be currently playing music in the server first!')
		if (!message.guild.me.voice) return message.reply('I need to be in a voice channel first before I can leave one! ;)').then(message.react('🤦‍♀️'));
		if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You need to be inside my voice channel in order to make me leave it!').then(message.react('🤦‍♀️'));

		const { sendMessage } = require('../functions.js');

		// Executes code if user wants to pause the bot
		if ( args.length == 1 && (args[0] === 'true' || args[0] === '1') ) {

			if (!guildQueue.connection.paused) { // Executes code if bot is already set to playing
				guildQueue.setPaused(true);
				return message.reply("Music player's status changed to: **PAUSED**");
			}
			else return sendMessage(message, "Music player's status is already set to paused!", 6000); // Executes if bot is not already set to playing

		} else if ( args.length == 1 && (args[0] === 'false' || args[0] === '0') ) { // Executes code if user wants to unpause the bot

			if (guildQueue.connection.paused) { // Executes code if bot is already set to paused
				guildQueue.setPaused(false);
				return message.reply("Music player's status changed to: **PLAYING**");
			}
			else return sendMessage(message, "Music player's status is already set to playing!", 6000); // Executes if bot is not already set to paused

		}

		// Returns message in case user gave invalid argument
		return sendMessage(message, "This command can only take `true` / `1` or `false` / `0` as an argument!", 12000);
	},
};
