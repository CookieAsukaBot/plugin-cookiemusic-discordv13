const {MessageEmbed} = require('discord.js');
const {getGuildQueue} = require('../controller/music.controller');

module.exports = {
	name: 'stop',
    category: 'Música',
	description: 'Detiene la lista de reproducción.',
	aliases: ['disconnect', 'detener'],
	async execute (message, args, bot) {
        let queue = (await getGuildQueue(message.guild.id, bot)).data;

        let embed = new MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: '💥 Expulsado'
            })
            .setDescription(`La lista se termina, **${message.author.username}** me sacó. 💢`);

        if (queue) {
            await queue.stop();
            message.channel.send({
                embeds: [embed]
            });
        }
	}
}
