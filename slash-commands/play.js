const {SlashCommandBuilder} = require('@discordjs/builders');
const {startPlaylist, play, playRandomSong} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Reproduce una canción.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Nombre de la canción o URL de YouTube/Spotify/Apple Music.")
                .setRequired(true)),
	async execute(interaction, bot) {
        let StartPlaylist = startPlaylist(interaction.guildId, interaction.user, interaction, bot);
        if (StartPlaylist.status == false) return interaction.reply({
            content: StartPlaylist.message,
            ephemeral: true
        });
        let {queue, getChannel} = StartPlaylist.data;
        let args = interaction.options.getString('input');

        // Unirse
        await queue.join(getChannel);

        // Reproducir
        // Comprobar random
        if (args.toLowerCase() == "random") {
            playRandomSong(interaction.guildId, interaction.user, queue);
        } else {
            play(interaction.guildId, interaction.user, queue, args);
        }

        return interaction.reply({
            content: `¡Tu canción se agregó a la lista!`,
            ephemeral: true
        })
	},
}
