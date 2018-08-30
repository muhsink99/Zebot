// import DiscordJS class
const Discord = require('discord.js');

module.exports = {
    name: 'userinfo',
    description: 'Prints out information of a specified user in an embeded format',
    args: true,
    execute(message, args) {
        // Fetches the first discord user mentioned from the command argument(s). 
        const discordUser = message.mentions.users.first(); 
     
        if (discordUser) {
            // Stores the user's info in variables
            const creationDate = discordUser.createdAt;
            const userID = discordUser.id;
            const userName = discordUser.username; 
            const avatar = discordUser.avatarURL;

            const isBot = () => {
                if (discordUser.bot) {
                    return "Yes!"
                }
                else {
                    return "No."
                }
            }
            
            // Creates the embed message
            const exampleEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setThumbnail(avatar)
                .setAuthor("User information", "https://ih0.redbubble.net/image.240642609.6610/ap,550x550,12x12,1,transparent,t.u3.png")
                .addField("User name: ", userName, true)
                .addField("Creation date: ", creationDate, true)
                .addField("Is this a bot?", isBot(), true)
                .addField("User ID: ", userID)
                .setTimestamp();
            
            // Sends it to the channel where the command was called
            message.channel.send(exampleEmbed);
        }
        else {
            message.reply('Discord user not specified!');
        }
    },
};