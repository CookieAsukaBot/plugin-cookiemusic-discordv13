const {SlashCommandBuilder} = require('@discordjs/builders');
const {skip} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Salta la canción que se está reproduciendo.'),
	async execute(interaction, bot) {
        let Skip = await skip(interaction.guildId, bot, interaction.user.username);
        if (!Skip.status) return interaction.reply({
            content: Skip.message,
            ephemeral: true
        });

        return interaction.reply({
            embeds: [Skip.data]
        });
	},
}
