const {MessageEmbed} = require('discord.js');

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

module.exports = {
    getCurrentSong,
}
