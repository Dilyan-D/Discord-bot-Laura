module.exports = {
	name: 'meme',
	description: 'Makes the bot add/remove a meme link.',
	cooldown: 2,
	aliases: ['m'],
	args: true,
	usage: '[add/remove] [meme name]` **OR** `[view]` **OR** `[meme name]',
	guildOnly: true,
	underMaintenance: false,
	execute(message, args) {
		if (message.channel.type !== 'GUILD_TEXT' && message.channel.type !== 'DM') return;

		const { sendMessage } = require('../functions.js');
		const { prefix } = require('../config.json');
		const fs = require('fs');

		// Fuction to check if storage file is empty
		function isFileEmpty(fileName, ignoreWhitespace = true) {
			return new Promise((resolve, reject) => {
				fs.readFile(fileName, (err, data) => {
					if (err) {
						reject(err);
						return;
					}

					resolve((!ignoreWhitespace && data.length == 0) || (ignoreWhitespace && !!String(data).match(/^\s*$/)))
				});
			})
		};


		switch (args[0].toLowerCase()) {

			case 'add': { // Executes if user entered 'add' as the first argument

				switch (args.length) {
					case 2: { // Executes if the user entered 2 arguments, as 2 are needed 

						isFileEmpty('memes.json').then((isEmpty) => { // Finds out whether or not file is empty and stores result in variable

							if (args[1] != 'add' && args[1] != 'remove') { // Checks if user entered a forbidden meme name (add or remove)
								const urlValidation = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;

								if (args[1].length <= 20 && !urlValidation.test(args[1])) { // Checks if user entered max. 20 characters as a name & name is not a link

									if (isEmpty) { // Executes if file is empty

										message.channel.send(
											"**~ YOU ARE NOW ADDING A MEME ~**" +
											"\n  - You have 15 seconds to send the link." +
											"\n  - Input will be ignored if not a link (only one)." +
											"\n  - Please use shortest links possible." +
											"\nDo not input anything for 15 secs if you'd like to cancel."
										).then(initialMsg => {

											const filter = message => urlValidation.test(message.content.toLowerCase()); // Filters messages that are not a link or are more than 1 link
											message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
												.then(collected => {

													const msg = collected.first().content;

													let obj = {
														memes: []
													};

													obj.memes.push({ cmd: args[1], link: msg }); // Pushes given meme name & link inside object
													const json = JSON.stringify(obj); // Creates a variable to prepare for writing to file

													fs.writeFile('memes.json', json, (err) => { // Initiating write to file operation
														if (err) { // Executes if an error has occured during writing to file
															console.error(err);
															initialMsg.delete();
															return sendMessage(message, "There's been an error creating that command!", 6000);
														}
														else {
															initialMsg.delete();
															return message.reply("You've successfully added the `" + args[1] + "` meme into my database!"); // Executes if write operation is successful
														}

													});
												})
												.catch(err => { // Executes if user fails to answer on time
													console.log(err);
													initialMsg.delete();
													return sendMessage(message, 'Timeout! Cancelling command...', 5000);
												});

										});

									} else { // Executes if database is not empty

										fs.readFile('memes.json', 'utf8', function readFileCallback(err, data) { // Initiating read from file operation

											if (err) { // Executes if an error has occured during reading from file
												console.error(err);
												return sendMessage(message, "There's been an error reading from database!", 6000);
											} else {

												let obj = JSON.parse(data); // Parses info from file to object variable

												for (let i = 0; i < obj.memes.length; i++)
													if (obj.memes[i].cmd == args[1]) // Makes sure user cannot add a duplicate meme cmd
														return sendMessage(message, "A meme with the same name has already been added into the database!", 8000);


												message.channel.send(
													"**~ YOU ARE NOW ADDING A MEME ~**" +
													"\n  - You have 15 seconds to send the link." +
													"\n  - Input will be ignored if not a link (only one)." +
													"\n  - Please use shortest links possible." +
													"\nDo not input anything for 15 secs if you'd like to cancel."
												).then(initialMsg => {

													const filter = message => urlValidation.test(message.content.toLowerCase()); // Filters messages that are not a link or are more than 1 link
													message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
														.then(collected => {
															const msg = collected.first().content;

															obj.memes.push({ cmd: args[1], link: msg }); // Pushes given meme name & link inside object
															const json = JSON.stringify(obj); // Creates a variable to prepare for writing to file
															fs.writeFile('memes.json', json, (error) => { // Initiating write to file operation
																if (error) { // Executes if an error has occured during writing to file
																	console.error(error);
																	initialMsg.delete();
																	return sendMessage(message, "There's been an error creating that command!", 6000);
																}
																else {
																	initialMsg.delete();
																	return message.reply("You've successfully added the `" + args[1] + "` meme into my database!"); // Executes if write operation is successful
																}

															});
														})
														.catch(err => { // Executes if user fails to answer on time
															console.log(err);
															initialMsg.delete();
															return sendMessage(message, 'Timeout! Cancelling command...', 5000);
														});
												});

											}
										});
									}

								} else return sendMessage(message, "Meme name can have a maximum of 20 characters & cannot be a link!", 7000);



							} else return sendMessage(message, "Meme name cannot be `add` or `remove`. Please pick a different name!", 10000);

						});

						break;
					}
					default: return sendMessage(message, "This command must receive exactly 2 arguments!\nCorrect usage: `" + prefix + "meme add [meme name]`", 20000);
				}

				break;
			}

			case 'remove': { // Executes if user entered 'remove' as the first argument

				switch (args.length) {
					case 2: { // Executes if the user entered 2 arguments, as 2 are needed 

						isFileEmpty('memes.json').then((isEmpty) => { // Finds out whether or not file is empty and stores result in variable

							if (!isEmpty) { // Executes if file is NOT empty

								fs.readFile('memes.json', 'utf8', function readFileCallback(err, data) { // Initiating read from file operation
									if (err) {
										console.error(err); // Executes if an error has occured during reading from file
										return sendMessage(message, "There's been an error reading from database!", 6000);
									} else {

										let obj = JSON.parse(data); // Parses info from file to object variable
										let matchFound = false;

										for (let i = 0; i < obj.memes.length; i++)
											if (obj.memes[i].cmd == args[1]) { // Makes sure user specified a meme that exists
												delete obj.memes[i]; // Deletes specified meme from object
												matchFound = true; // Sets flag that a match has been found
											}

										if (!matchFound)
											return sendMessage(message, "Meme `" + args[1] + "` does not exist in database! Do `" + prefix + "m view` to see available memes!", 10000);//10000);

										const filteredObj = obj.memes.filter(x => x !== null); // Filters object so that it has no null values (otherwise values that have been deleted are set to 'null' instead of disappearing)
										let json = JSON.stringify(filteredObj); // Creates a variable to prepare for writing to file
										json = '{"memes":' + json + '}'; // Concatinates missing parts of object

										fs.writeFile('memes.json', json, (error) => { // Initiating write to file operation
											if (error) { // Executes if an error has occured during writing to file
												console.error(error);
												return sendMessage(message, "There's been an error writing to database!", 6000);
											}
											else return message.reply("You've successfully removed meme `" + args[1] + "` from my database!");

										});

									}
								});

							} else return sendMessage(message, "You need to add some memes into the database first!\nTo add a meme use: `" + prefix + "meme add [meme name]`", 10000);

						});

						break;
					}

					default: return sendMessage(message, "This command must receive exactly 2 arguments!\nCorrect usage: `" + prefix + "meme remove [meme name]`", 20000);
				}

				break;
			}

			case 'view': { // Executes if user entered 'view' as the first argument

				switch (args.length) {
					case 1: { // Executes if the user entered 1 argument, as 1 is needed 

						isFileEmpty('memes.json').then((isEmpty) => { // Finds out whether or not file is empty and stores result in variable

							if (!isEmpty) { // Executes if file is NOT empty

								fs.readFile('memes.json', 'utf8', function readFileCallback(err, data) { // Initiating read from file operation
									if (err) {
										console.error(err); // Executes if an error has occured during reading from file
										return sendMessage(message, "There's been an error reading from database!", 6000);
									} else {
										let obj = JSON.parse(data); // Parses info from file to object variable

										if (obj.memes.length > 0) { // Executes if object is not empty
											const { MessageEmbed } = require('discord.js');

											let embedMemes = new MessageEmbed()
												.setTitle(`Meme List | Amount: ${obj.memes.length}`)
												.setThumbnail('https://cdn.discordapp.com/avatars/701882938090061844/e7f7f12ddc75476c3048ebe50bb46377.png')
												.setColor('#0099ff')
												.setFooter('© Developed by DilyanD. and Wirtty.');

											for (let i = 0; i < obj.memes.length; i++)
												embedMemes.addField(obj.memes[i].cmd, obj.memes[i].link, true)

											return message.channel.send({ embeds: [embedMemes] });

										} else return sendMessage(message, "You need to add some memes into the database first!\nTo add a meme use: `" + prefix + "meme add [meme name]`", 10000);
									}
								});
							} else return sendMessage(message, "You need to add some memes into the database first!\nTo add a meme use: `" + prefix + "meme add [meme name]`", 10000);

						});

						break;
					}

					default: return sendMessage(message, "This command must receive only 1 argument!\nCorrect usage: `" + prefix + "meme view`", 10000);
				}

				break;
			}

			default: { // Executes if user entered anything other than 'add', 'remove' or 'view'; Treats argument as meme command

				switch (args.length) {
					case 1: {

						isFileEmpty('memes.json').then((isEmpty) => { // Finds out whether or not file is empty and stores result in variable

							if (!isEmpty) { // Executes if file is NOT empty

								fs.readFile('memes.json', 'utf8', function readFileCallback(err, data) { // Initiating read from file operation
									if (err) {
										console.error(err); // Executes if an error has occured during reading from file
										return sendMessage(message, "There's been an error reading from database!", 6000);
									} else {
										let obj = JSON.parse(data);

										if (obj.memes.length > 0) { // Executes if object is not empty

											for (let i = 0; i < obj.memes.length; i++) {
												if (args[0] == obj.memes[i].cmd) // Checks memes list for a matching meme
													return message.channel.send(obj.memes[i].link); // Sends specified meme's link in chat
												else if (i + 1 == obj.memes.length)
													return sendMessage(message, "Meme `" + args[0] + "` does not exist in database! Do `" + prefix + "m view` to see available memes!", 10000);
											}
										} else return sendMessage(message, "You need to add some memes into the database first!\nTo add a meme use: `" + prefix + "meme add [meme name]`", 10000);
									}
								});
							} else return sendMessage(message, "You need to add some memes into the database first!\nTo add a meme use: `" + prefix + "meme add [meme name]`", 10000);

						});
						break;
					}
					default: return sendMessage(message, "This command must receive only 1 argument!\nCorrect usage: `" + prefix + "meme [meme name]`", 12000);

				}

				break;
			}

		};
	},
};