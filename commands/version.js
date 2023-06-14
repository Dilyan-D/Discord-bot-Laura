module.exports = {
	name: 'version',
	description: 'Shows the current [L]aura Bot version.',
	cooldown: 3,
	args: false,
	aliases: ['botversion', 'botver', 'ver', 'v'],
	usage: '[optional: changelog/log]',
	guildOnly: false,
	underMaintenance: false,
	execute(message, args) {

		/*	CHANGELOG TEMPLATE & EXPLANATION

			{ name: '<CATEGORY>', value: '<ITEM & EXPLANATION>' },
			{ name: '<CATEGORY>', value: '<ITEM & EXPLANATION>' },
			{ name: '<CATEGORY>', value: '<ITEM & EXPLANATION>' }

			CATEGORY: New Features (NF), Bug Fixes (BF), Performance Improvements (PI), Other (OTHER), Known Bugs (KB)
			ITEM & EXPLANATION: Thing that was fixed/added/improved/modified + explanation.
												
			EXAMPLE: 
			Category: Bug Fixes
			Item & Explanation: Entering things like '??', '?!!', etc. no longer triggers the bot.


			WRITE CHANGELOG IN THIS ORDER:
				1. New Features
				2. Bug Fixes
				3. Performance Improvements
				4. Other
				5. Known Bugs
			notice: if a category is not necessary, skip it.

		*/

		if (message.channel.type !== 'GUILD_TEXT' && message.channel.type !== 'DM') return;

		const { botVersion } = require('../config.json');

		if (!args.length) {

			return message.channel.send('My current version is: **' + `${botVersion}` + '**\nDo `?version changelog` for more details.');

		} else if (args.length == 1)
			if (args[0].toLowerCase() == 'changelog' || args[0].toLowerCase() == 'log') {

				const { BF, NF, PI, OTHER, KB, prefix } = require('../config.json');
				const { MessageEmbed } = require('discord.js');
				const embedChangelog = new MessageEmbed()
					.setTitle(`**CHANGELOG - Version ${botVersion}**`)
					.setThumbnail('https://cdn.discordapp.com/avatars/701882938090061844/e7f7f12ddc75476c3048ebe50bb46377.png')
					.setColor('#0099ff')
					.setFooter('© Developed by DilyanD. and Wirtty.')
					.addFields(

						{
							name: NF, value:
								"- MEMES!! Everyone loves memes, right? You can now store memes inside [L]aura bot's database & display them with a simple command YOU get to pick!" +
								"\nDo `" + prefix + "help meme` to learn more!" +
								"\n\n- You can now see total queue duration in command `" + prefix + "queue`'s embed."
						},
						{ name: '\u200B', value: '\u200B' },
						{
							name: BF, value:
								"- Fixed a bug where [L]aura bot wouldn't remove a meme from meme list under certain conditions."
						},
						{ name: '\u200B', value: '\u200B' },
						{
							name: KB, value:
								"- Bot will only display 25 songs in the music queue upon executing the `" + prefix + "queue` command." +
								"\n\n- Bot may also crash upon executing the `" + prefix + "queue` command if there are many songs loaded into the queue."
						}
					);

				return message.channel.send({ embeds: [embedChangelog] });
			} else return message.reply('This command can only take `changelog` or `log` as an argument!');

		
	},
};