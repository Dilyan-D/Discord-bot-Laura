const fs = require('fs');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');
require('dotenv').config();

const cooldowns = new Discord.Collection();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

/* MUSIC PLAYER CODE
------------- */

const { Player, RepeatMode } = require('discord-music-player');
const player = new Player(client, {
    leaveOnEmpty: false,
});
client.player = player;

client.player
    .on('error', (error, queue) => {
        console.error(`MUSIC ERROR IN ${queue.guild.name}:\n\n ${error}`);
    })



/* -------------
*/


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
};

client.once('ready', () => {
    console.log("Bot has been successfully started.");
    client.user.setActivity("Problems? Contact DilyanD.#1452 / onqskonq#9987");
    //client.user.setActivity("I'm currently being developed");
});


client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'lobby');
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}!`).then(msg => {
        msg.react('😍');
    });
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'lobby');
    if (!channel) return;
    channel.send(`Farewell, ${member}!`).then(msg => {
        msg.react('😢');
    });

});


client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const name = client.commands.map(command => command.name);
    const aliases = client.commands.map(command => command.aliases);
    
    let guildQueue;
    if (message.guild)
        guildQueue = client.player.getQueue(message.guild.id);


    // Input verification
    var forbiddenSymbols = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let getOut = 0;
    
    for (let i = 0; i < name.length; i++) {
        if (name[i]) {
            if (message.content.includes(name[i])) getOut = 1;
            if (aliases[i])
                for (let j = 0; j < aliases[i].length; j++)
                    if (message.content.includes(aliases[i][j])) {
                        getOut = 1;
                        break;
                    }
        }
    }
    if (getOut == 0)
        if (forbiddenSymbols.test(message.content.substring(1)) || message.content.substring(1).length == 0) return;


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


    if (!command) return message.reply('You have entered an unknown command. Use `' + prefix + 'help` to see the available commands.')
    if (command.underMaintenance) return message.reply('This command is currently under maintenance due to pending bug fixes/feature implementations. Please try again later! :)');
    if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
        return message.reply('Uh oh! It appears that this command is only server related.').then(msg => {
            msg.react('🤷‍♀️');
        });
    }


    if (command.args && !args.length) {
        let reply = `${message.author}, You didn't provide any arguments!`;

        if (command.usage) {
            reply += `\nCorrect usage: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply).then(message.react('😠'));
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before using \`${prefix}${command.name}\` again.`);
        }

    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args, client, guildQueue);
    }
    catch (error) {
        console.error(error);
        return message.reply('There was an error trying to execute that command!');
    }

});
//client.login(process.env.BOT_TOKEN);
client.login(token);