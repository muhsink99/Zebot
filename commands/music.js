const YTDL = require('ytdl-core');
const Discord = require('discord.js');
const humanizeDuration = require('humanize-duration')
const async = require('async');
const youtubeUrl = require('youtube-url');

var servers = {}; 
var skipCount = 0; 
const skipLimit = 3; 
var defaultVolume = 0.05; // 5% volume

function startUp(message, args) {
    const voiceChannel = message.member.voiceChannel;
    // Grabs the first argument and stores it. 
    const videoUrl = args[0]; 

    // Checks if the video URL is valid or not. If not, return.
    if (!checkValid(videoUrl)) {
        message.reply('This youtube URL is invalid, please try agian.'); 
        return; 
    }

    // Creates an empty queue for the songs if it doesn't exist. 
    if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
    };

    var server = servers[message.guild.id]; 

    // Add video to the queue 
    server.queue.push(videoUrl);

    // If the bot is not in a voice channel, join the channel that the user is in
    // and play music. 
    if (!message.guild.voiceConnection) {
        voiceChannel.join().
            then(connection => {
                play(connection, message)
        })
    }
     
    if (server.queue.length > 0 && server.dispatcher) {
        messageUrl(`\:zzz: Current position in queue: ${server.queue.length}`, message, videoUrl);
    }
}

function play (connection, message) {
    var server = servers[message.guild.id];

    // Play the music, set volume to 0.03 (3% of original volume).
    server.dispatcher = connection.playStream(YTDL(server.queue[0])); 
    server.dispatcher.setVolume(defaultVolume);

    // Outputs that the music is now playing 
    messageUrl("Now playing:", message, server.queue[0]);
    
    // Remove the music from the queue, shifts queue to the left. 
    server.queue.shift(); 

    // When the music stream ends... 
    server.dispatcher.on("end", () => {
        skipCount = 0; 
        if (server.queue[0]) { // Checks if there's still a song in the queue. If so, play the next song.
            play(connection, message);
        }
        else { // There are no more songs in the queue so disconnect from the voice channel. 
            servers = {}; 
            connection.disconnect(); 
        }
    });
}

// Leave the voice channel
function leave (message) {
    var server = servers[message.guild.id]; 

    server.queue = []; 
    server.dispatcher.end(); 
}

// Attempt to skip a song
function skip (message, veto) {
    var server = servers[message.guild.id]; // Connects to current queue of songs

    if (veto === false) {
        skipCount += 1;
    }
    else if (veto === true) {
        skipCount = skipLimit; 
    }

    if (skipCount < skipLimit) { // Checks if the desired vote count hasn't been met. 
        message.channel.send(`${skipCount}/${skipLimit} votes to skip current song`); 
    }
    else if (skipCount >= skipLimit) { // Desired vote count has been reached; end current stream. 
        message.channel.send('\:white_check_mark: Vote successful! Skipping song.');
        server.dispatcher.end(); 
    }
}

// Prints information of the video's information to the Discord user. 
function messageUrl(title, message, url) {
    YTDL.getInfo(url, function(err, info) {
        const formattedDuration = humanizeDuration(info.length_seconds * 1000); // Multipled by 1000 to convert to ms

        message.channel.send({embed: {
                content: `${title}`,
                color: 3447003,
                title: `${title}`,
                url: `${url}`,
              fields: [
                {
                  name: ":musical_note: Song name",
                  value: `${info.title}`
                },
                {
                  name: ":clock1: Duration",
                  value: `${formattedDuration}`
                }
              ]
            }});
    });
}

// Returns a delay 
function delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
}

// Delayed callback for queue'd song(s)
async function delayedQueue(message, song) {
    var server = servers[message.guild.id];

    await delay(); // wait for the delay to finish 

    return new Promise(function(resolve, reject) {
        YTDL.getInfo(song, function(err, info){ // Print the song in the current iteration
            if (err) {
                reject(err);
            }
            else {
                resolve(`${server.queue.indexOf(song) + 1}: \:musical_note: ${info.title}`);
            }
        });
    });
}

// Prints out a list of queued songs, if any. 
async function printQueue (message) {
    var server = servers[message.guild.id];
    let embedMsg = new Discord.RichEmbed()
        .setTitle(`\:zzz: Currently queued songs:`);

    if (!server.queue[0]) { // Checks if the queue is empty... 
        message.reply('There are currently no songs in the queue.'); 
    }
    else {
        for (const song of server.queue) {
            const songText = await delayedQueue(message, song)
            embedMsg
                .addField(songText, "_________________________________________", false); // Add each song to the embed message in synchronous fashoin 
        }
        message.channel.send(embedMsg); // Send the list of queued songs to the user
    }
}

// Returns whether the youtube URL is valid or not. 
function checkValid (url) {
    return youtubeUrl.valid(url);
}

module.exports = {
    startUp, 
    play,
    skip, 
    printQueue,
    leave
}