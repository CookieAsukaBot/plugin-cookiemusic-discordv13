const {SlashCommandBuilder} = require('@discordjs/builders');
const {shuffle} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Las canciones se reproducirán en un orden aleatorio.'),
	async execute(interaction, bot) {
        let Shuffle = await shuffle(interaction.guildId, bot, interaction.user.username);
        if (!Shuffle.status) return interaction.reply({
            content: Shuffle.message,
            ephemeral: true
        });

        return interaction.reply({
            embeds: [Shuffle.data]
        });
	},
}
