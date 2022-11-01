const {MessageEmbed} = require('discord.js');
const {Utils} = require('discord-music-player');
const {startPlaylist, play, volumen} = require('../controller/music.controller');

let config = {
    resultCount: 9,
    time: 50, // segundos
}

let footer = `__Escribe el **número** de la canción que quieres...__\nTienes **${config.time}** ⏳ segundos para elegir una canción.`;

module.exports = {
    name: 'search',
    category: 'Música',
    description: 'Busca una canción, después selecionala (de la lista).',
    aliases: ['buscar'],
    usage: ['<nombre de la canción>'],
	async execute (message, args, bot) {
		let StartPlaylist = startPlaylist(message.guild.id, message.author, message, bot);
		if (StartPlaylist.status == false) return message.channel.send(StartPlaylist.message);
		let {queue, getChannel} = StartPlaylist.data;

        // Buscar
        if (!args.length) return message.channel.send(`**${message.author.username}**, escribe el nombre de una canción.`);
        let results = await Utils.search(args.join(' '), { requestedBy: `${message.author.id}`}, queue, config.resultCount)
            .catch(() => {}) || [];

        // Input
        let input = await new Promise((res, rej) => {
            if (!results.length) return rej("No se se encontró ningún resultado.");

            let parsed = results
                .map((song, index) => `**${index + 1}**. [**${song.name}**](${song.url}) de *${song.author}*`)
                .join('\n');

            let embed = new MessageEmbed()
                .setColor(process.env.BOT_COLOR)
                .setTitle('🔎 Resultados de la búsqueda')
                .setDescription(`${parsed}\n\n${footer}`);

            return message.channel.send({
                    embeds: [embed]
                })
                .then(msg => {
                    let collector = msg.channel.createMessageCollector({
                        filter: m => (m.author.id == message.author.id) && (parseInt(m.content) - 1 in results),
                        time: config.time * 1000,
                        maxProcessed: 1
                    });

                    // Esperando mensaje
                    return new Promise((res, rej) => {
                        collector.on('collect', m => (collector.removeAllListeners(), res(m)));
                        collector.on('end', () => rej(''))
                    })
                        .then(res)
                        .catch(rej);
                });
            })
        .catch(err => {
            if (err) throw err
            return {}
        });

        let song = results[parseInt(input.content) - 1];

        if (song) {
		    await queue.join(getChannel);
            await play(message.guild.id, message.author, queue, song.url, bot);
            await volumen(message.guild.id, bot);
        }
	}
}
