const {MessageEmbed} = require('discord.js');

/**
 * Genera un embed con el color de el bot.
 */
const generateEmbed = () => {
    return new MessageEmbed().setColor(process.env.BOT_COLOR);
}

module.exports = (bot) => {
    bot.player
        .on('channelEmpty', async (queue) => {
            let embed = generateEmbed();
            embed.setAuthor({
                name: '💥 Fin de la lista'
            })
            embed.setDescription(`Todos se salieron del canal de voz. 💢`);
            await queue.data.queueInitMessage.channel.send({
                embeds: [embed]
            });
        })
        .on('songAdd', async (queue, song) => {
            let embed = generateEmbed();
            embed.setAuthor({
                name: '🎶 Lista',
                url: song.url
            });
            embed.setDescription(`Se agregó **${song.name}** \`(${song.duration})\` a la lista. ✅`);
            await queue.data.queueInitMessage.channel.send({
                embeds: [embed]
            });
        })
        .on('playlistAdd', async (queue, playlist) => {
            let embed = generateEmbed();
            embed.setAuthor({
                name: '🎶 Lista'
            });
            embed.setURL(playlist.url)
            embed.setDescription(`Se agregó la lista **[${playlist.name} de ${playlist.author}](${playlist.url})** con **${playlist.songs.length}** canciones. ✅`);
            await queue.data.queueInitMessage.channel.send({
                embeds: [embed]
            });
        })
        .on('queueEnd', async (queue) => {
            let embed = generateEmbed();
            embed.setAuthor({
                name: '📀 Música'
            });
            embed.setDescription(`Se acabaron las canciones de la lista. 💔`);
            await queue.data.queueInitMessage.channel.send({
                embeds: [embed]
            });
        })
        .on('songChanged', async (queue, newSong, oldSong) => {
            let embed = generateEmbed();
            embed.setAuthor({
                name: '🎶 Nueva canción'
            });
            embed.setDescription(`Ahora reproduciendo **${newSong.name}** \`(${newSong.duration})\`. 💞`);
            await queue.data.queueInitMessage.channel.send({
                embeds: [embed]
            });
        })
        .on('clientDisconnect', async (queue) => {
            let embed = generateEmbed();
            embed.setAuthor({
                name: '💥 Expulsado'
            });
            embed.setDescription(`La lista se termina, alguien me sacó. 💢`);
            await queue.data.queueInitMessage.channel.send({
                embeds: [embed]
            });
        })
        .on('error', (error, queue) => {
            console.log({
                error
            });
            // console.log({
            //     plugin: `${name} (${version})`,
            //     error
            // });
        });
}
