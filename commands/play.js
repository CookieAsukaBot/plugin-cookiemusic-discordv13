const {startPlaylist, play, playRandomSong} = require('../controller/music.controller');
const {getCurrentSong} = require('../utils/embeds');

module.exports = {
	name: 'play',
	category: 'Música',
	description: 'Reproduce una canción de YouTube/Spotify/Apple Music.',
	aliases: ['p'],
	usage: '<nombre de la canción o enlace de YouTube, Spotify o Apple Music>',
	async execute (message, args, bot) {
		let StartPlaylist = startPlaylist(message.guild.id, message.author, message, bot);
		if (StartPlaylist.status == false) return message.channel.send(StartPlaylist.message);
		let {queue, getChannel} = StartPlaylist.data;

		// Comprobar args
		if (args.length < 1) {
			let guildQueue = await bot.player.getQueue(message.guild.id);
			if (guildQueue.isPlaying) return message.channel.send({ embeds: [getCurrentSong(guildQueue)]});

			return message.channel.send(`¡**${message.author.username}**, usa \`${bot.prefix}${this.name} ${this.usage}\` para agregar una canción a la lista!`);
		}

		// Unirse
		await queue.join(getChannel);

		// Reproducir
		// Comprobar random
		if (args[0].toLowerCase() == "random") {
			playRandomSong(message.guild.id, message.author, queue);
		} else {
			play(message.guild.id, message.author, queue, args.join(' ').trim());
		}
    }
}
