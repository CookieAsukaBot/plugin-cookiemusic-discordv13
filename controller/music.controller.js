const {MessageEmbed} = require('discord.js');
const status = require('../helpers/status');
const {getRandomSong} = require('../controller/song.controller');

/**
 * Crea un lista de reproducción.
 * 
 * @param {String} guild id del servidor
 * @param {Object} user 
 * @param {Object} message 
 * @param {Object} bot 
 * @returns retorna queue y getChannel
 */
const startPlaylist = ( guild, user, message, bot) => {
    // Crear lista
    let queue = bot.player.createQueue(guild, { data: { queueInitMessage: message } });
    let getChannel = message.member.voice.channel;

    // Comprobar usuario
    if (typeof getChannel == null || typeof getChannel == undefined || !getChannel) {
        return status.failed(`**${user.username}**, únete al canal de voz para usar este comando.`)
    } else {
        return status.success("SUCCESS", {queue, getChannel});
    }
}

/**
 * 
 * 
 * @param {String} guild id del servidor
 * @param {*} bot 
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
 * Reproduce una canción.
 * 
 * @param {String} guild id del servidor
 * @param {Object} user 
 * @param {Object} queue 
 * @param {String} args 
 */
const play = async (guild, user, queue, args) => {
    await queue.play(args, {
        requestedBy: `${user.id}`
    }).catch(_ => {
        if (!bot.player.getQueue(guild)) {
                queue.stop();
                return status.failed(`¡**${user.username}**, ocurrió un error!`);
            };
        });
}

// Pause
// Stop
// Volumen
// Search

/**
 * Desorganiza el orden de las canciones de manera aleatoria.
 * 
 * @param {String} guild id del servidor.
 * @param {Object} bot
 * @param {String} username nombre de usuario.
 * @returns retorna un embed su sus-cedió correctamente.
 */
const shuffle = async (guild, bot, username) => {
    let guildQueue = await bot.player.getQueue(guild);
    if (!guildQueue) return status.failed(`**${username}**, no se está reproduciendo ninguna canción ahora mismo.`);

    await guildQueue.shuffle();

    let embed = new MessageEmbed()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: '🔀 Shuffle'
        })
        .setDescription(`Se activó el modo **Shuffle**. ✅`);

    return status.success("SUCCESS", embed);
}

// Skip
// Seek

/**
 * Reproduce una canción aleatoria.
 * 
 * @param {String} guild id del servidor
 * @param {Object} user 
 * @param {Object} queue 
 * @returns 
 */
const playRandomSong = async (guild, user, queue) => {
    let randomSong = await getRandomSong(guild); // todo: que funcione a base de la guild
    console.log({randomSong});
    if (!randomSong) return status.failed(`¡${user.username}, necesitas de reproducir canciones antes de poder usar este comando!`);
    play(guild, user, queue, randomSong[0].url.toString());
}

module.exports = {
    startPlaylist,
    getGuildQueue,
    play,
    shuffle,
    playRandomSong,
}
