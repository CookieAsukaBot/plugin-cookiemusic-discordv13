const path = require('node:path');
const { Player } = require('discord-music-player');

module.exports = {
    name: 'Music',
    version: '0.0.1',
    description: 'Plugin de música oficial.',
    dependencies: ['discord-music-player', '@discordjs/opus', 'opusscript', 'lyrics-finder'],
    enabled: true,
    async plugin (bot) {
        // Cargar comandos
        require('../../events/commands')(bot, path.join(__dirname, 'commands'));
        // require('../../events/commands')(bot, path.join(__dirname, 'slash-commands'), true);

        // Reproductor
        const player = new Player(bot, {
            leaveOnEmpty: true,
            leaveOnEnd: false
        });

        // Eventos
        bot.player = player;
        require('./events/player')(bot);
    }
}
