const {SlashCommandBuilder} = require('@discordjs/builders');
const {pause} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pausa o reanuda la canción.'),
	async execute(interaction, bot) {
        let Pause = await pause(interaction.guildId, bot, interaction.user.username);
        if (!Pause.status) return interaction.reply({
            content: Pause.message,
            ephemeral: true
        });

        return interaction.reply({
            embeds: [Pause.data]
        });
	},
}
