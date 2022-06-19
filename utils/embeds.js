const {MessageEmbed} = require('discord.js');
const {splitLyrics} = require('./words-utils');

const getCurrentSong = (guildQueue) => {
    const ProgressBar = guildQueue.createProgressBar();
    return embed = new MessageEmbed()
        .setColor(process.env.BOT_COLOR)
        .setAuthor({
            name: '💿 Reproduciendo'
        })
        .setTitle(`${guildQueue.nowPlaying.name}`)
        .setURL(`${guildQueue.nowPlaying.url}`)
        .setThumbnail(`${guildQueue.nowPlaying.thumbnail}`)
        .addField('Pedida por', `<@${guildQueue.nowPlaying.requestedBy}>`)
        .addField('Duración', `[${ProgressBar.bar.replaceAll(' ', '⠀')}] \`${ProgressBar.times}\``);
}

/**
 * 
 * @param {*} lyrics 
 * @param {Object} song opcional: metadatos de la canción.
 * @returns retorna un array de embeds.
 */
const generateLyricsEmbeds = (lyrics, song) => {
    let embeds = [];

    if (lyrics.length >= 1500) {
        let splitted = splitLyrics(lyrics);

        splitted.forEach((msg, index) => {
            if (index >= 1) msg = `...${msg}`;

            let embed = new MessageEmbed()
                .setColor(process.env.BOT_COLOR)
                .setAuthor({
                    name: `📖 Letra (${index + 1}/${splitted.length})`
                })
                .setDescription(msg);
            if (song.url) embed.setURL(`${song.url}`);

            embeds.push(embed);
        });
    } else {
        let embed = new MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: '📖 Letra'
            })
            .setDescription(lyrics);
        if (song.name) embed.setTitle(`${song.name}`);
        if (song.url) embed.setURL(`${song.url}`);

        embeds.push(embed);
    }

    return embeds;
}

module.exports = {
    getCurrentSong,
    generateLyricsEmbeds,
}
