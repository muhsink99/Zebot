const YTDL = require('ytdl-core');
const music = require('./music.js');

module.exports = {
    cooldown: 60,
    name: 'skip',
    description: 'Attempts to skip a song currently being played.',
    execute(message, args) {
        if (message.guild.voiceConnection) {
            music.skip(message, false);
        }
        else {
            message.reply('I must be in a voice channel to do that!');
        }
    },
};