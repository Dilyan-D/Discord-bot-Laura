const Discord = require('discord.js');

module.exports = {
	name: 'server-info',
	description: 'Prints information about the server the command was called in.',
	cooldown: 3,
	args: false,
	aliases: ['serverinfo'],
	guildOnly: true,
	underMaintenance: false,
	execute(message, args) {
		if (message.channel.type !== 'GUILD_TEXT') return;

		const { sendMessage } = require('../functions.js');

		// Executes if arguments are not specified (cmd is being properly used)
		if (args.length == 0) {
			const { MessageEmbed } = require('discord.js');
			
			let createdAt = message.guild.createdAt.toDateString() + '\n' + message.guild.createdAt.toTimeString();
			let joinedAt = message.member.joinedAt.toDateString() + '\n' + message.guild.joinedAt.toTimeString();

			message.guild.fetchOwner().then(owner => {

				const embedSinfo = new MessageEmbed()
					.setColor('#0ba2d9')
					.setTitle(`Server Information - ${message.guild.name}`)
					.setThumbnail(`${message.client.user.avatarURL()}`)
					.addFields(
						{ name: 'Server owner:', value: `${owner.user.tag}` },
						{ name: 'Member count:', value: `${message.guild.memberCount}`, inline: true },
						{ name: 'Verified:', value: `${message.guild.verified}`, inline: true },
					)
					.addField('\u200B', '\u200B')
					.addField('Created at:', `${createdAt}`)
					.addField('You joined at:', `${joinedAt}`)
					.setFooter('© Developed by DilyanD.', 'https://i.imgur.com/eb6f4fR.png');

				return message.channel.send({ embeds: [embedSinfo] });

			});
		} else return sendMessage(message, "This command cannot receive arguments!", 6000); // Executes if arguments have been specified (cmd is being improperly used)
	},
};