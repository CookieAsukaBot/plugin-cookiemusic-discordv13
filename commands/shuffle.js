const {shuffle} = require('../controller/music.controller');

module.exports = {
	name: 'shuffle',
    category: 'Música',
	description: 'Las canciones se reproducirán en un orden aleatorio.',
	async execute (message, args, bot) {
        let Shuffle = await shuffle(message.guild.id, bot, message.author.username);

        if (Shuffle.status) {
            message.channel.send({
                embeds: [Shuffle.data]
            });
        } else {
            message.channel.send(Shuffle.message);
        }
	}
}
