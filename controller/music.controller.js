const {MessageEmbed} = require('discord.js');
const lyricsFinder = require('lyrics-finder');
const status = require('../helpers/status');
const {getRandomSong} = require('../controller/song.controller');
const Config = require('../controller/config.controller'); // import just necesary
const {generateLyricsEmbeds} = require('../utils/embeds');

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
 * @param {Object} bot 
 */
const play = async (guild, user, queue, args, bot) => {
    await queue.play(args, {
        requestedBy: `${user.id}`
    }).catch(_ => {
        if (!bot?.player.getQueue(guild)) { // bug: hay crashes con esto | poner una playlist, poner un mal url
                queue.stop();
            }
        });
}

/**
 * Reproduce una lista.
 * 
 * @param {String} guild id del servidor
 * @param {Object} user 
 * @param {Object} queue 
 * @param {String} args
 * @param {Object} bot  
 */
const playlist = async (guild, user, queue, args, bot) => {
    await queue.playlist(args, {
        requestedBy: `${user.id}`
    }).catch(_ => {
        if (!bot?.player.getQueue(guild)) {
                queue.stop();;
            }
        });
}

/**
 * Pausa o reanuda la canción.
 * 
 * @param {String} guild id del servidor.
 * @param {Object} bot
 * @param {String} username nombre del usuario.
 * @returns 
 */
const pause = async (guild, bot, username) => {
    let guildQueue = await bot.player.getQueue(guild);
    if (!guildQueue) return status.failed(`**${username}**, no se está reproduciendo ninguna canción ahora mismo.`);

    await guildQueue.setPaused(guildQueue.paused = !guildQueue.paused);
    let statusName, statusDescription;

    if (guildQueue.paused) {
        statusName = "⏸ Pause";
        statusDescription = `Se **pausó** la canción. ✅`;
    } else {
        statusName = "▶ Reanudado";
        statusDescription = `Se **reanudó** la canción. ✅`;
    }

    let embed = new MessageEmbed()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: statusName
        })
        .setDescription(statusDescription);

    return status.success("SUCCESS", embed);
}

/**
 * Desorganiza el orden de las canciones de manera aleatoria.
 * 
 * @param {String} guild id del servidor.
 * @param {Object} bot
 * @param {String} username nombre del usuario.
 * @returns retorna un embed si sus-cedió correctamente.
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

/**
 * Salta la canción que se está reproduciendo.
 * 
 * @param {String} guild id del servidor.
 * @param {Object} bot
 * @param {String} username nombre del usuario.
 * @returns retorna un embed si suscedió correctamente.
 */
const skip = async (guild, bot, username) => {
    let guildQueue = await bot.player.getQueue(guild);
    if (!guildQueue) return status.failed(`**${username}**, no se está reproduciendo ninguna canción ahora mismo.`);

    await guildQueue.skip();

    let embed = new MessageEmbed()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: '⏩ Saltada'
        })
        .setDescription(`Se **saltó** la canción. ✅`);
    
    return status.success("SUCCESS", embed);
}

/**
 * Muestra la letra de una canción.
 * 
 * @param {*} song nombre de la canción o el objecto.
 * @returns retorna un array de embeds si sucedió correctamente.
 */
const lyrics = async (song) => {
    if (!song || song.length <= 0) return status.failed("ingresa el nombre de la canción.");

    let response = await lyricsFinder(song);

    if (response) {
        return status.success("SUCCESS", generateLyricsEmbeds(response, song));
    } else {
        return status.failed("no se encontró la letra de esta canción.");
    }
}

/**
 * Asigna el volumen del bot.
 * 
 * @param {String} guild ID del servidor
 * @param {Object} bot 
 */
const volumen = async (guild, bot) => {
    let config = (await Config.getConfig(guild)).data;
    let guildQueue = await bot.player.getQueue(guild);
    await guildQueue.setVolume(config.volumen);
    return status.success("SUCCESS", config);
}

// Queue
const queue = (songs) => {
}

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
    let randomSong = await getRandomSong(guild);
    if (!randomSong) return status.failed(`¡${user.username}, necesitas de reproducir canciones antes de poder usar este comando!`);
    play(guild, user, queue, randomSong[0].metadata.url);
}

module.exports = {
    startPlaylist,
    getGuildQueue,
    play,
    playlist,
    pause,
    shuffle,
    skip,
    lyrics,
    volumen,
    playRandomSong,
}
