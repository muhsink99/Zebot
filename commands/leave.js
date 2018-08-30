const music = require('./music.js');

module.exports = {
        name: 'leave',
        description: 'Forces the bot to leave the voice channel',
        execute(message, args) {
            if (message.guild.voiceConnection) {
                music.leave(message);
            }
            else {
                message.reply("I must be in a voice channel to leave!");
            }
    }
}