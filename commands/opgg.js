module.exports = {
    name: 'opgg',
    description: 'Displays the OPGG of a specified user.',
    args: true,
    execute(message, args) {
        const summonerName = args[0];
        message.channel.send(`http://euw.op.gg/summoner/userName=${summonerName}`);
    },
};