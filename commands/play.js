const YTDL = require('ytdl-core');
const music = require('./music.js');

module.exports = {
    cooldown: 5,
    name: 'play',
    description: 'Plays a youtube stream!',
    args: true,
    usage: '<url>',
    execute(message, args) {
        if (message.member.voiceChannel) { // Checks if the user is in a voice channel. If true, then..
            music.startUp(message, args);
        }
        else if (!message.member.voiceChannel) { // User is not in a voice channel.
            message.channel.send('You\'re not in a voice channel currently.'); 
        }
    }
};