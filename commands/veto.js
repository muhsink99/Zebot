const YTDL = require('ytdl-core');
const music = require('./music.js');

module.exports = {
    name: 'veto',
    description: 'Immediately skip a song. (ADMIN only)',
    execute(message, args) {
        if (message.guild.voiceConnection) {
            if (message.member.roles.find("name", "Yes") || message.member.roles.find("name", "Medjed")
                || message.member.roles.find("name", "Music Bot")) { // Check if the user has any of these roles. If so, attempt to skip the song immediately without votes.
                music.skip(message, true);
            }
            else {
                message.reply('You do not have the permissions for that command.');
            }
        }
        else {
            message.reply('I must be in a voice channel to do that!');
        }
    }
};