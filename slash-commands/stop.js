const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {getGuildQueue} = require('../controller/music.controller');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Detiene la lista de reproducción.'),
	async execute(interaction, bot) {
        let queue = (await getGuildQueue(interaction.guildId, bot)).data;

        let embed = new MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setAuthor({
                name: '💥 Expulsado'
            })
            .setDescription(`La lista se termina, **${interaction.user.username}** me sacó. 💢`);

        if (queue) {
            await queue.stop();
            return interaction.reply({
                embeds: [embed]
            });
        } else {
            return interaction.reply({
                content: `¡No se está reproduciendo nada ahora mismo!`,
                ephemeral: true
            });
        }
	},
}
