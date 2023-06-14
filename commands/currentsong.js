module.exports = {
	name: 'currentsong',
	description: 'Shows the currently playing song.',
	cooldown: 2,
	args: false,
	aliases: ['curr', 'now', 'nowplaying'],
	guildOnly: true,
	underMaintenance: false,
	execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;

		// Check if bot is playing music
		if (!guildQueue) return message.reply('I must be currently playing music in the server first!')

		const { sendMessage } = require('../functions.js');

		// Executes if arguments are not specified (cmd is being properly used)
		if (args.length == 0) {
			const { MessageEmbed } = require('discord.js');

			let embedNowPlaying = new MessageEmbed()
				.setTitle(guildQueue.nowPlaying.name)
				.setURL(guildQueue.nowPlaying.url)
				.setDescription(guildQueue.nowPlaying.author)
				.setThumbnail(guildQueue.nowPlaying.thumbnail);

			message.channel.send("🎵   **CURRENTLY PLAYING SONG:**   🎵");
			return message.channel.send({ embeds: [embedNowPlaying] });
		} else return sendMessage(message, "This command cannot receive arguments!", 6000); // Executes if arguments have been specified (cmd is being improperly used)
		
		
	},
};