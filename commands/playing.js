const {getGuildQueue} = require('../controller/music.controller');
const {getCurrentSong} = require('../utils/embeds');

module.exports = {
	name: 'playing',
    category: 'Música',
	description: 'Info. de la canción que se está reproduciendo.',
    aliases: ['nowplaying', 'currentsong', 'shazam'],
	async execute (message, args, bot) {
        let queue = (await getGuildQueue(message.guild.id, bot)).data;

        if (queue) {
            message.channel.send({
                embeds: [getCurrentSong(queue)]
            });
        } else {
            message.channel.send(`**${message.author.username}**, no hay ninguna canción reproduciéndose.`);
        }
	}
}
