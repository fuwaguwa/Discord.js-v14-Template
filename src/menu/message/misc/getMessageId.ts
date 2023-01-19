import { ApplicationCommandType, EmbedBuilder, TextChannel } from "discord.js";
import { MessageCommand } from "../../../structures/Command";

export default new MessageCommand({
	name: "Get Message ID",
	cooldown: 5000,
	type: ApplicationCommandType.Message,
	run: async ({ interaction }) => {
		const idEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(
				`Message ID: **${interaction.options.data[0].message.id}**`
			);

		await interaction.reply({ embeds: [idEmbed] });
	},
});
