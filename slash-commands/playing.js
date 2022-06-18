const {SlashCommandBuilder} = require('@discordjs/builders');
const {getGuildQueue} = require('../controller/music.controller');
const {getCurrentSong} = require('../utils/embeds');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playing')
		.setDescription('Info. de la canción que se está reproduciendo.'),
	async execute(interaction, bot) {
        let queue = (await getGuildQueue(interaction.guildId, bot)).data;

        if (queue) {            
            return interaction.reply({
                embeds: [getCurrentSong(queue)]
            });
        } else {
            return interaction.reply(`**${interaction.user.username}**, no hay ninguna canción reproduciéndose.`);
        }
	},
}
