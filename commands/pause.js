const {pause} = require('../controller/music.controller');

module.exports = {
	name: 'pause',
    category: 'Música',
	description: 'Pausa o reanuda la canción.',
    aliases: ['resume', 'reanudar', 'pausar'],
	async execute (message, args, bot) {
        let Pause = await pause(message.guild.id, bot, message.author.username);
        if (!Pause.status) return message.channel.send(Pause.message);

        message.channel.send({
            embeds: [Pause.data]
        });
	}
}
