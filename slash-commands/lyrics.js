const {SlashCommandBuilder} = require('@discordjs/builders');
const {lyrics} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lyrics')
		.setDescription('Muestra la letra una canción.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Ingresa el nombre de la canción.")
                .setRequired(false)),
	async execute(interaction, bot) {
        const guildQueue = await bot.player.getQueue(interaction.guildId);
        const Lyrics = await lyrics(guildQueue ? guildQueue.nowPlaying : interaction.options.getString('input'));

        if (!Lyrics.status) {
            interaction.reply(`**${interaction.user.username}**, ${Lyrics.message}`);
        } else {
            interaction.reply({
                embeds: Lyrics.data
            });
        }
	},
}
