module.exports = {
	name: 'say',
	description: 'Makes the bot say whatever you specify as an argument.',
	cooldown: 1,
	args: true,
	usage: '[text to say]',
	guildOnly: false,
	underMaintenance: false,
	execute(message, args) {
		if (message.channel.type !== 'GUILD_TEXT' && message.channel.type !== 'DM') return;

		let input = "";
		for (let i = 0; i < args.length; i++)
			input += args[i] + " ";

		return message.channel.send(input);
	},
};