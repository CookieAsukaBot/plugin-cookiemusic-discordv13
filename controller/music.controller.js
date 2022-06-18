const status = require('../helpers/status');
const {getRandomSong} = require('../controller/song.controller');

/**
 * Crea un lista de reproducción
 * 
 * @param {Object} message 
 * @param {Object} bot 
 * @returns retorna queue y getChannel
 */
const startPlaylist = (message, bot) => {
    // Crear lista
    let queue = bot.player.createQueue(message.guild.id, { data: { queueInitMessage: message } });
    let getChannel = message.member.voice.channel;

    // Comprobar usuario
    if (typeof getChannel == null || typeof getChannel == undefined || !getChannel) {
        return status.failed(`**${message.author.username}**, únete al canal de voz para usar este comando.`)
    } else {
        return status.success("SUCCESS", {queue, getChannel});
    }
}

/**
 * 
 * @param {Object} bot 
 * @returns si hay una canción reproduciéndose retorna la queue
 */
const getGuildQueue = async (guild, bot) => {
    let guildQueue = await bot.player.getQueue(guild);

    if (guildQueue?.isPlaying) {
        return status.success("SUCCESS", guildQueue);
    } else {
        return status.failed("No se está reproduciendo ninguna canción ahora mismo.");
    }
}

/**
 * Reproduce una canción
 * 
 * @param {Object} message del usuario
 * @param {Object} queue lista del servidor
 * @param {String} args nombre o url de la canción
 */
const play = async (message, queue, args) => {
    await queue.play(args, {
        requestedBy: `${message.author.id}`
    }).catch(_ => {
        if (!bot.player.getQueue(message.guild.id)) {
                queue.stop();
                return status.failed(`¡**${message.author.username}**, ocurrió un error!`);
            };
        });
}

// Pause
// Stop
// Volumen
// Search
// Skip
// Seek

// Random
const playRandomSong = async (message, queue) => {
    let randomSong = await getRandomSong(message.guild.id); // todo: que funcione a base de la guild
    console.log({randomSong});
    if (!randomSong) return status.failed(`¡${message.author.username}, necesitas de reproducir canciones antes de poder usar este comando!`);
    play(message, queue, randomSong[0].url.toString());
}

module.exports = {
    startPlaylist,
    getGuildQueue,
    play,
    playRandomSong,
}
