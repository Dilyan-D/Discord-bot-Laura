const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows all available bot commands.',
    cooldown: 3,
    args: false,
    aliases: ['commands', 'cmds'],
    usage: '[command name]',
    guildOnly: false,
    underMaintenance: false,
    execute(message, args) {
        if (message.channel.type !== 'GUILD_TEXT' && message.channel.type !== 'DM') return;
        let data = '';
        const { commands } = message.client;
        const { sendMessage } = require('../functions.js');

        if (!args.length) {

            const embedHelp = new MessageEmbed()
                .setTitle('**Here\'s a list of all my commands:**')
                .setThumbnail('https://cdn.discordapp.com/avatars/701882938090061844/e7f7f12ddc75476c3048ebe50bb46377.png')
                .setColor('#0099ff')
                .setFooter('© Developed by DilyanD. and Wirtty.');

            const com = commands.map(command => command.name);
            const desc = commands.map(command => command.description);
            const underMaint = commands.map(command => command.underMaintenance);

            for (let i = 0; i < com.length; i++) {
                let text = "";

                if (underMaint[i]) {
                    text = '(under maintenance)'
                }

                embedHelp.addFields({ name: `${com[i]} ${text}`, value: desc[i] });
            }

            return message.channel.send({ embeds: [embedHelp] });

        } else if (args.length == 1){

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply('You have entered an unknown command. Use `' + prefix + 'help` to see the available commands.');
            }

            data += `**Command name:** ${command.name}\n`;

            if (command.aliases) data += `**You can also use:** ${command.aliases.join(', ')}\n`;
            if (command.description) data += `**Description:** ${command.description}\n`;
            if (command.usage) data += '**Usage:** `' + `${prefix}${command.name} ${command.usage}` + '`\n';

            if (command.cooldown) {
                if (command.cooldown == 1) data += `**Cooldown:** ${command.cooldown} second\n`;
                else data += `**Cooldown:** ${command.cooldown} seconds\n`;

            } else data += `**Cooldown:** 3 second(s)\n`;

            if (command.underMaintenance == true) data += `**Status:** Under maintenance`;
            else data += `**Status:** Functional`;

            return message.channel.send(data.toString());

        } else return sendMessage(message, "This command can receive only one argument!", 6000); // Executes if more than 1 argument has been specified (cmd is being improperly used)

    },
};
