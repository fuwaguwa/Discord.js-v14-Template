import { EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "ping",
	cooldown: 3000,
	description: "Bot's ping",
	run: async ({ interaction, client }) => {
		const pingEmbed: EmbedBuilder = new EmbedBuilder()
			.setTitle("Pong 🏓")
			.setColor("#2f3136")
			.setDescription(
				`Latency: ${
					Date.now() - interaction.createdTimestamp
				}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`
			);
		await interaction.reply({ embeds: [pingEmbed] });
	},
});
