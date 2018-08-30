module.exports = {
    name: 'random',
    description: 'Outputs a random number between 1 and 999.',
    execute(message, args) {
        message.reply(`\:game_die: You rolled a ${getRandomInt(999)}!`);
    },
};

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}