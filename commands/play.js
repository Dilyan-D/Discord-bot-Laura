require('dotenv').config();
const opts = {
	maxResults: 10,
	key: process.env.YT_TOKEN,
	type: 'video'
};
module.exports = {
	name: 'play',
	description: 'Plays YouTube music in a voice channel.',
	cooldown: 5,
	args: true,
	aliases: ['p'],
	usage: '[search criteria or YT link]',
	guildOnly: true,
	underMaintenance: false,
	async execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;
		if (!message.member.voice.channel) return message.reply('You need to be in a voice channel for me to join it!');

		if (message.guild.me.voice) {
			if (message.guild.me.voice.channelId) {
				if (message.guild.me.voice.channel !== message.member.voice.channel) {
					return message.reply("Give me a break! I'm already playing music in another channel.");
				}
			}
		}

		const { MessageEmbed } = require('discord.js');
		const { sendMessage } = require('../functions.js');
		const yt_search = require('youtube-search');

		let embedMusic;

		let urlValidation = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		let ytValidation = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|playlist\?list=|playlist\?.+&list=))((\w|-){11})(?:\S+)?$/;
		const isLink = urlValidation.test(`${args}`);
		const isValidLink = ytValidation.test(`${args}`);

		if (!isLink && !isValidLink) {

			let filter = m => m.author.id === message.author.id;
			let results = await yt_search(args.join(' '), opts).catch(err => console.log(err));

			if (results) {
				let ytResults = results.results;
				let i = 0;
				let titles = ytResults.map(result => {
					i++;
					return "**" + i + ")** " + result.title;
				});

				embedMusic = new MessageEmbed()
					.setTitle('Select which song you want by typing the number')
					.setColor('0ba2d9')
					.setDescription(titles.join("\n"))
					.setFooter('Tip: Type \'c\' to cancel search');

				message.channel.send({ embeds: [embedMusic] }).then(async msg => {

					filter = m => (m.author.id === message.author.id) && m.content >= 1 && m.content <= ytResults.length || (m.content == 'c' || m.content == 'C');
					collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }); msg.delete();

					if (collected.first().content.toLowerCase() === 'c')
						return sendMessage(message, "Cancelling search...", 5000);

					let selected = ytResults[collected.first().content - 1];
					embedMusic = new MessageEmbed()
						.setTitle(`${selected.title}`)
						.setURL(`${selected.link}`)
						.setDescription(`${selected.description}`)
						.setThumbnail(`${selected.thumbnails.default.url}`)
						.setFooter('© Developed by DilyanD. & Wirtty', 'https://i.imgur.com/eb6f4fR.png');


					if (selected.link.includes("list=")) {

						let queue = client.player.createQueue(message.guild.id);
						await queue.join(message.member.voice.channel);

						await queue.playlist(selected.link).catch(_ => {

							if (!guildQueue) {
								queue.stop();
								return sendMessage(message, "There's been an error adding that playlist to the queue!");
							}

						});

						message.channel.send(`🎵   **Playlist has been added to the queue!**   🎵`).then(() => {
							return message.channel.send({ embeds: [embedMusic] });
						});

					} else {

						let queue = client.player.createQueue(message.guild.id);
						await queue.join(message.member.voice.channel);

						await queue.play(selected.link).catch(_ => {

							if (!guildQueue) {
								queue.stop();
								return sendMessage(message, "There's been an error adding that song to the queue!");
							}

						});

						message.channel.send(`🎵   **Song has been added to the queue!**   🎵`).then(() => {
							return message.channel.send({ embeds: [embedMusic] });
						});

					}

				}).catch(() => { // Executes if user fails to pick a song on time
					sendMessage(message, 'Timeout! Cancelling command...', 5000);
				});
			}

		} else if (isLink && isValidLink) {

			if (args.length == 1) {

				if (args[0].includes("list=")) {

					let queue = client.player.createQueue(message.guild.id);
					await queue.join(message.member.voice.channel);

					let song = await queue.playlist(args[0]).catch(_ => {

						if (!guildQueue) {
							queue.stop();
							return sendMessage(message, "There's been an error adding that playlist to the queue!");
						}
					});

					setTimeout(() => {
						embedMusic = new MessageEmbed()
							.setTitle(song.name)
							.setURL(song.songs[0].url)
							.setDescription(song.author + `\n\n**Songs in playlist: ${song.songs.length}**`)
							.setThumbnail(song.songs[0].thumbnail);

						message.channel.send(`🎵   **Playlist has been added to the queue!**   🎵`).then(() => {
							return message.channel.send({ embeds: [embedMusic] });
						});
					}, 1000);

				} else {

					let queue = client.player.createQueue(message.guild.id);
					await queue.join(message.member.voice.channel);

					let song = await queue.play(args[0]).catch(_ => {

						if (!guildQueue) {
							queue.stop();
							return sendMessage(message, "There's been an error adding that song to the queue!");
						}
					});

					embedMusic = new MessageEmbed()
						.setTitle(song.name)
						.setURL(song.url)
						.setDescription(song.author)
						.setThumbnail(song.thumbnail);

					message.channel.send(`🎵   **Song has been added to the queue!**   🎵`).then(() => {
						return message.channel.send({ embeds: [embedMusic] });
					});

				}

			} else return sendMessage(message, "You can input only one command argument! Example: `play <link>`\nNOT: `play <link> <more stuff> <even more stuff>", 8000);

		} else return sendMessage(message, "Command argument must be either a valid YouTube video link or a video name to search for!", 10000);

	},
};
