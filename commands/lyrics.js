const {lyrics} = require('../controller/music.controller');
const delay = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'lyrics',
    category: 'Música',
	description: 'Muestra la letra de una canción.',
    aliases: ['letra'],
    usage: ['<opcional: nombre de la canción>'],
    cooldown: 10,
	async execute (message, args, bot) {
        const guildQueue = await bot.player.getQueue(message.guild.id);
        const Lyrics = await lyrics(guildQueue ? guildQueue.nowPlaying : args.join(' '));

        if (!Lyrics.status) {
            message.channel.send(`**${message.author.username}**, ${Lyrics.message}`);
        } else {
            if (Array.isArray(Lyrics.data)) {

                Lyrics.data.forEach(async embed => {
                    message.channel.send({
                        embeds: [embed]
                    });
                    await delay(1000);
                });

            } else {
                message.channel.send(Lyrics.data);
            }
        }
	}
}
