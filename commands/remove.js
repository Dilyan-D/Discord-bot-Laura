module.exports = {
	name: 'remove',
	description: "Makes the bot remove a song from the music player's queue.",
	cooldown: 2,
	args: true,
	usage: '[song number]',
	aliases: ['r', 'rem'],
	guildOnly: true,
	underMaintenance: false,
	execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;

		// Check if bot is playing music & if user is in the same voice channel as the bot
		if (!guildQueue) return message.reply('I must be currently playing music in the server first!')
		if (message.member.voice.channel !== message.guild.me.voice.channel) return message.reply('You need to be inside my voice channel in order to make me skip a song!').then(message.react('🤦‍♀️'));


		const number = Math.abs(args);
		// Input verification
		if (Number.isNaN(number)) return message.reply('Command argument must be a whole number and a whole number only!');
		if (args <= 0) return message.reply('Number of messages to purge **must be 1 or more.**');
		if (number > guildQueue.songs.length) return message.reply(`No song with ID number ${number} exists in queue!`);

		const { MessageEmbed } = require('discord.js');

		if ((guildQueue.songs[number - 1] == guildQueue.nowPlaying) && guildQueue.songs.length == 1) {

			guildQueue.skip();
			return message.reply("You've removed the last song in the queue. Leaving voice channel...");

		} else if (guildQueue.songs[number - 1] == guildQueue.nowPlaying) {

			embedSkip = new MessageEmbed()
				.setTitle(guildQueue.nowPlaying.name)
				.setURL(guildQueue.nowPlaying.url)
				.setDescription(guildQueue.nowPlaying.author)
				.setThumbnail(guildQueue.nowPlaying.thumbnail);

			message.channel.send("🎵   **YOU'VE SKIPPED THE CURRENTLY PLAYING SONG!**   🎵");
			message.channel.send({ embeds: [embedSkip] });

			guildQueue.skip(guildQueue.songs[number - 1]);

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
			let embedRemovedSong = new MessageEmbed()
				.setTitle(guildQueue.songs[number - 1].name)
				.setURL(guildQueue.songs[number - 1].url)
				.setDescription(guildQueue.songs[number - 1].author)
				.setThumbnail(guildQueue.songs[number - 1].thumbnail);

			guildQueue.remove(parseInt(number - 1));


			message.channel.send("🎵   **YOU'VE REMOVED A SONG FROM THE QUEUE:**   🎵");
			return message.channel.send({ embeds: [embedRemovedSong] });
		}
	},
};