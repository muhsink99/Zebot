module.exports = {
    name: 'random',
    description: 'Outputs a random number between 1 and 999.',
    execute(message, args) {
        if (message.channel.id == '499561959423868938') {
            message.reply(`\:game_die: You rolled a ${getRandomInt(999)}!`);
        } else {
            message.reply('You must be in the random channel to use this command!');
        }
    },
};

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}