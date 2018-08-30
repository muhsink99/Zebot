const fs = require('fs');

// require the discord.js module 
const Discord = require('discord.js'); 

// create a config object
const { prefix, token } = require('./config.json');

// create a new Discord client 
const client = new Discord.Client(); 
client.commands = new Discord.Collection(); 

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// Creates a collection of user cooldowns 
const cooldowns = new Discord.Collection(); 

// When the client is ready, run this code; 
// This event will trigger whenever your bot: 
//  - finishes logging in
//  - reconnects after disconnecting
client.on('ready', () => {
    console.log('Ready!');
})

// login to Discord via app's token
client.login(token);

client.on('message', message => {
    // Terminate early if the command doesn't start with the specified prefix / is sent by a bot. 
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Takes the message and splits it into an array by spaces 
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    // Records the command in a variable and sets it to lower case
    const commandName = args.shift().toLowerCase();

    // Holds the actual command itself. 
    const command = client.commands.get(commandName);

    if (!client.commands.has(commandName)) return;
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) { // Checks if the command has a 'usage' property
            reply += `\nThe proper usage would be: \'${prefix}${command.name} ${command.usage}`;
        }

        return message.channel.send(reply);
    }

    // Handle cooldowns of users. 
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now(); 
    const timestamps = cooldowns.get(command.name); // recieve timestamps of all cooldowns
    const cooldownAmount = (command.cooldown || 3) * 1000; // Convert from seconds to milliseconds. Set 3 seconds as default value. 

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now); 
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        console.log('setting up new cooldown');
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount; // Set timestamp for when user is able to input command again 

        if (now < expirationTime) { // Check if the command is on cooldown.
            const timeLeft = (expirationTime - now) / 1000; // Calculate remaining cooldown, convert back to seconds. 
            return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds(s)`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    console.log(`attempt to execute ${command.name}`);
    // Attempt to execute a command. If there's a rune-time error, notify the user. 
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})