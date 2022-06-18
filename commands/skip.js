const {skip} = require('../controller/music.controller');

module.exports = {
	name: 'skip',
    category: 'Música',
	description: 'Salta la canción que se está reproduciendo.',
	async execute (message, args, bot) {
        let Skip = await skip(message.guild.id, bot, message.author.username);
        if (!Skip.status) return message.channel.send(Skip.message);

        message.channel.send({
            embeds: [Skip.data]
        });
	}
}
