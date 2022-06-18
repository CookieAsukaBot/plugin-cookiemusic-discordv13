const {SlashCommandBuilder} = require('@discordjs/builders');
const {startPlaylist, playlist} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Añade una lista de reproducción de YouTube/Spotify/Apple Music.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Enlace de YouTube, Spotify o Apple Music.")
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
        playlist(interaction.guildId, interaction.user, queue, args);

        return interaction.reply({
            content: `¡Tu lista será agregada!`,
            ephemeral: true
        })
	},
}
