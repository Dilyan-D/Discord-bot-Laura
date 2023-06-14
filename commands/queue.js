module.exports = {
	name: 'queue',
	description: "Shows loaded songs into the music queue.",
	cooldown: 2,
	args: false,
	aliases: ['q'],
	guildOnly: true,
	underMaintenance: false,
	execute(message, args, client, guildQueue) {
		if (message.channel.type !== 'GUILD_TEXT') return;
		if (!guildQueue) return message.reply('I must be currently playing music in the server first!')

		const { sendMessage } = require('../functions.js');
		const { MessageEmbed } = require('discord.js');
		
		// Executes if arguments are not specified (cmd is being properly used)
		if (args.length == 0) {
			let queueDuration = 0;

			for (let i = 0; i < guildQueue.songs.length; i++){ // Calculation of queue duration
				let initVal = guildQueue.songs[i].duration; // Gets current song's duration (value is string)
				initVal = initVal.split(':'); // Splits string into an array, containing minutes & seconds

				const minutes = parseInt(initVal[0], 10); // Parses minutes string element into integer
				const seconds = parseInt(initVal[1], 10); // Parses seconds string element into integer

				const songDuration = ( minutes * 60 ) + seconds; // Calculates current song's duration (value is now integer)
				queueDuration += songDuration; // Adds current song's duration into total queue duration
			}
			
			let minutes = Math.floor(queueDuration / 60); // Gets full minutes from queue duration
			let seconds = queueDuration % 60; // Gets remaining seconds (those who are less than 60)

			if (minutes < 10){ // Puts a '0' in front of minute if it's single digit
				minutes = minutes.toString();
				minutes = '0' + minutes;
			}
			if (seconds < 10){ // Puts a '0' in front of second if it's single digit
				seconds = seconds.toString();
				seconds = '0' + seconds;
			}

			let embedQueue = new MessageEmbed()
				.setTitle('**Music Queue**')
				.setDescription(`Total queue time: ${minutes}:${seconds}`)
				.setThumbnail('https://cdn.discordapp.com/avatars/701882938090061844/e7f7f12ddc75476c3048ebe50bb46377.png')
				.setColor('#0099ff')
				.setFooter('© Developed by DilyanD. and Wirtty.');

			for (let i = 0; i < guildQueue.songs.length; i++) // Adds a field into the embed for every song in queue
				embedQueue.addField(
					`[${i + 1}] ${guildQueue.songs[i].name}`,
					`${guildQueue.songs[i].author}`
				);

			return message.channel.send({ embeds: [embedQueue] }); // Finally sends the embed, presenting all the information to the user

		} else return sendMessage(message, "This command cannot receive arguments!", 6000); // Executes if arguments have been specified (cmd is being improperly used)

	},
};
