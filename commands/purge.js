module.exports = {
	name: 'purge',
	description: 'Deletes a specified amount of messages in text channel the command was called in.',
	cooldown: 3,
	args: true,
	aliases: ['delete', 'delmsg', 'deletemsg', 'delmessage', 'deletemessage', 'delete-message', 'delete-msg', 'del'],
	usage: '[number of msgs]',
	guildOnly: true,
	underMaintenance: false,
	execute(message, args) {
		if (message.channel.type !== 'GUILD_TEXT') return;
		const number = Math.abs(args);
		
		// Input verification
		if (Number.isNaN(number)) return message.reply('Command argument must be a whole number and a whole number only!');
		if (args <= 0) return message.reply('Number of messages to purge **must be 1 or more.**');
		if (number >= 100) return message.reply('You can\'t purge more than 99 messages!');

		// Including function sendMessage from functions file
		const { sendMessage } = require('../functions.js');

		// Decide whether or not number is big enough to ask for confirmation
		if (number >= 20) {

			// Confirmation message
			message.reply(`Are you sure you want to delete the last ${args} messages? (Yes/No)`)

			// Listening for user's answer
			const filter = message => message.content.toLowerCase().startsWith('yes') || message.content.toLowerCase().startsWith('no') || message.content.toLowerCase().startsWith('y') || message.content.toLowerCase().startsWith('n');
			message.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] })
				.then(collected => {
					const msg = collected.first().content.toLowerCase();

					// Executes if user confirms deletion
					if (msg == 'yes' || msg == 'y') {

						message.channel.messages.fetch({ limit: number }).then(messages => {

							const lastMessage = messages.last();
							const lastMessageDay = lastMessage.createdAt;
							const messageDay = message.createdAt;

							const DateDifference = parseInt((messageDay.getTime() - lastMessageDay.getTime()) / (24 * 3600 * 1000));

							if (DateDifference < 14) { // Prevents bot from crashing if message(s) is/are older than 14 days.

								try { // Deletes x messages & returns message
									const messagecount = parseInt(`${number}`) + 1;
									message.channel.messages.fetch({ limit: messagecount }).then(messages => message.channel.bulkDelete(messages));

									return sendMessage(message, `You successfully purged last ${messagecount - 1} messages!`, 5000);

								}
								catch (error) {
									console.error(error);
									return sendMessage(message, 'There\'s been an error purging these messages.', 8000);
								}

							} else return message.reply("Unfortunately, Discord allows me to delete only messages that are less than 14 days old.");

						});

					}
					else if (msg == 'no' || msg == 'n') // Executes if user cancels deletion
						return sendMessage(message, 'Cancelling purge...', 5000);
				})
				.catch(() => { // Executes if user fails to answer on time
					sendMessage(message, 'Timeout! Cancelling purge...', 5000);
				});

		} else { // Executes if user entered a number less than 20

			message.channel.messages.fetch({ limit: number }).then(messages => {
				const lastMessage = messages.last();
				const lastMessageDay = lastMessage.createdAt;
				const messageDay = message.createdAt;

				const DateDifference = parseInt((messageDay.getTime() - lastMessageDay.getTime()) / (24 * 3600 * 1000));

				if (DateDifference < 14) { // Prevents bot from crashing if message(s) is/are older than 14 days.

					try { // Deletes x messages & returns message
						const messagecount = parseInt(`${number}`) + 1;
						message.channel.messages.fetch({ limit: messagecount }).then(messages => message.channel.bulkDelete(messages));

						return sendMessage(message, `You successfully purged last ${messagecount - 1} messages!`, 5000);

					}
					catch (error) {
						console.error(error);
						return sendMessage(message, 'There\'s been an error purging these messages.', 8000);
					}

				} else return message.reply("Unfortunately, Discord allows me to delete only messages that are less than 14 days old.");

			});
		}
	},
};
