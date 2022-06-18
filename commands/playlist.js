const {startPlaylist, playlist} = require('../controller/music.controller');
const {getCurrentSong} = require('../utils/embeds');

module.exports = {
	name: 'playlist',
	category: 'Música',
	description: 'Añade una lista de reproducción de YouTube/Spotify/Apple Music.',
	aliases: ['pl'],
	usage: '<nombre de la canción o enlace de YouTube/Spotify/Apple Music>',
	async execute (message, args, bot) {
		let StartPlaylist = startPlaylist(message.guild.id, message.author, message, bot);
		if (StartPlaylist.status == false) return message.channel.send(StartPlaylist.message);
		let {queue, getChannel} = StartPlaylist.data;

		// Comprobar args
		if (args.length < 1) {
			let guildQueue = await bot.player.getQueue(message.guild.id);
			if (guildQueue.isPlaying) return message.channel.send({ embeds: [getCurrentSong(guildQueue)]});

			return message.channel.send(`¡**${message.author.username}**, usa \`${bot.prefix}${this.name} ${this.usage}\` para agregar una lista!`);
		}

		// Unirse
		await queue.join(getChannel);

		// Reproducir
        playlist(message.guild.id, message.author, queue, args.join(' ').trim());
    }
}
