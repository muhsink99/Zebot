module.exports = {
    name: 'github',
    description: 'Provides users with a link to the git repo.',
    execute(message, args) {
        message.channel.send("Here's a link to my repository: https://github.com/muhsink99/Zebot");
    },
};
