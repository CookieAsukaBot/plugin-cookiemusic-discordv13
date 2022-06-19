const {lyrics} = require('../controller/music.controller');

module.exports = {
	name: 'lyrics',
    category: 'Música',
	description: 'Muestra la letra de una canción.',
    aliases: ['letra'],
    usage: ['<opcional: nombre de la canción>'],
	async execute (message, args, bot) {
        const guildQueue = await bot.player.getQueue(message.guild.id);
        const Lyrics = await lyrics(guildQueue ? guildQueue.nowPlaying : args.join(' '));

        if (!Lyrics.status) {
            message.channel.send(`**${message.author.username}**, ${Lyrics.message}`);
        } else {
            message.channel.send({
                embeds: Lyrics.data
            });
        }
	}
}
