const YTDL = require('ytdl-core');
const music = require('./music.js');

module.exports = {
    name: 'queue',
    description: 'Displays all the songs currently queued.',
    execute(message, args) {
        if (message.guild.voiceConnection) {
            music.printQueue(message);
        }
        else {
            message.reply('I must be in a voice channel to do that!');
        }
    },
};