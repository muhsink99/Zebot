module.exports = {
    name: 'pong',
    description: 'Pong!',
    execute(message, args) {
        if (args.length == 0) {
            message.channel.send('Ping.');
        }
        else {
            message.reply('fk u');
        }
    },
};