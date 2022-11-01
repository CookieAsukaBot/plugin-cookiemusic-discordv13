const {SlashCommandBuilder} = require('@discordjs/builders');
const {getGuildQueue,volumen} = require('../controller/music.controller');
const {MessageEmbed} = require('discord.js');
const Config = require('../controller/config.controller');
const clamp = require('../utils/clamp');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volumen')
		.setDescription('Cambia o muestra el volumen actual del servidor.')
        .addStringOption(option =>
            option.setName('input')
                .setDescription("Ingresa un valor del 1 al 100 para asignar el volumen.")),
	async execute(interaction, bot) {
        let queue = (await getGuildQueue(interaction.guildId, bot)).data;
        let args = interaction.options.getString('input');
        let hasValue = clamp(parseInt(args), 0, 100);

        if (queue) {

            let statusName, statusDescription;
            let embed = new MessageEmbed()
                .setColor(process.env.BOT_COLOR)
                .setAuthor({
                    name: statusName
                })
                .setDescription(statusDescription);

            if (hasValue && hasValue != NaN) { // Mejorar comprobación de NaN
                // Actualizar local
                await queue.setVolume(hasValue);
                // Actualizar DB
                await Config.setVolumen(interaction.guildId, hasValue);

                statusName = `🔼 Cambiando volumen`;
                statusDescription = `El volumen se asignó a **${hasValue}**. ✅`;
            } else {
                // Responder con el volúmen actual
                let config = (await Config.getConfig(interaction.guildId)).data;

                statusName = `🧻 Mostrando volumen`;
                statusDescription = `El volumen se encuentra en **${config.volumen}**.`;
            }

            return interaction.reply({
                embeds: [embed]
            });
        } else {
            // return interaction.reply("");
        }
	},
}
