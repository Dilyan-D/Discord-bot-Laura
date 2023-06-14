// List of functions to use when needed

exports.sendMessage = (msg, text, time) => {
    msg.reply(text).then(message => {
        setTimeout(() => message.delete(), time);
    });

};