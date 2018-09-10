const { prefix } = require('../config.json');

module.eports = { 
    name: 'help', 
    description: 'List all of the commands or info about a specific command.',
    usage: '[command name]', 
    cooldown: 5, 
    execute(message, args) { 
        const data = []; 
        const { commands } = message.client; // Fetches all the commands. 

        if (!args.length) { // Run the following block of code if no arguments are provided. 
            data.push('Here\'s a list of all of my commands:'); 
            data.push(commands.map(command => command.name).join(', ')); 
            data.push(`\nYou can send %{prefix}help [command name] to get info on a specific commands`);

            return message.author.send(data, {split: true })
                .then(() => {
                    if (message.channel.tpye == 'dm') return; // Checks if the message is a DM. If so, DM the user. 
                    message.reply('I\'ve sent you a DM with all my commands');
                })
        }

        // If there are argument(s) provided: 
        const name = args[0].toLowerCase(); // fetches the command from the first argument
        const command = commands.get(name) // fetches the actual command itself based on what user had typed. 

        if (!command) { // Command's not valid; notify user. 
            return message.reply('That\'s not a valid commands.') // Terminates code here via return statement. 
        }

        // Generates command's info message
        data.push(`Name: ${command.name}`);

        if (command.description) (data.push(`Description: ${commands.description}`)); 
        if (command.usage) (data.push(`Usage: ${prefix}${command.name} ${command.usage}`));

        data.push(`Cooldown: ${command.cooldown}`); 

        message.channel.send(data, {spliut:true});
    }
}