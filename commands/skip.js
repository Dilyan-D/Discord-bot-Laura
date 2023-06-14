module.exports = {
	name: 'skip',
	description: 'Makes the bot skip the currently playing song.',
	cooldown: 2,
	args: false,
	aliases: ['sk'],
	guildOnly: true,
	underMaintenance: false,
	execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;

		// Check if bot is playing music & if user is in the same voice channel as the bot
		if (!guildQueue) return message.reply('I must be currently playing music in the server first!')
		if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You need to be inside my voice channel in order to make me skip a song!').then(message.react('🤦‍♀️'));

		const { sendMessage } = require('../functions.js');

		// Executes if arguments are not specified (cmd is being properly used)
		if (args.length == 0) {

			const { MessageEmbed } = require('discord.js');
			let embedSkip;

			if (guildQueue.songs.length !== 1) {

				embedSkip = new MessageEmbed()
					.setTitle(guildQueue.nowPlaying.name)
					.setURL(guildQueue.nowPlaying.url)
					.setDescription(guildQueue.nowPlaying.author)
					.setThumbnail(guildQueue.nowPlaying.thumbnail);

				message.channel.send("🎵   **YOU'VE SKIPPED THE CURRENTLY PLAYING SONG!**   🎵");
				message.channel.send({ embeds: [embedSkip] });

				guildQueue.skip();

				setTimeout(() => {

					embedSkip = new MessageEmbed()
						.setTitle(guildQueue.nowPlaying.name)
						.setURL(guildQueue.nowPlaying.url)
						.setDescription(guildQueue.nowPlaying.author)
						.setThumbnail(guildQueue.nowPlaying.thumbnail);

					message.channel.send("    **NOW PLAYING:**    ");
					return message.channel.send({ embeds: [embedSkip] });

				}, 1000);

			} else {

				guildQueue.skip();
				return message.reply("You've skipped the last song in the queue. Leaving voice channel...");

			}
		} else return sendMessage(message, "This command cannot receive arguments!", 6000); // Executes if arguments have been specified (cmd is being improperly used)

		
	},
};