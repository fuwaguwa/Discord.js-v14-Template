import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	EmbedBuilder,
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import ms from "ms";

const Cooldown: Collection<string, number> = new Collection();
const owner = "836215956346634270";

export default new Event("interactionCreate", async (interaction) => {
	if (!interaction.guild) return;
	if (!interaction.isMessageContextMenuCommand()) return;

	const command = client.messageCommands.get(interaction.commandName);
	if (!command)
		return interaction.reply("You have used a non existent command");

	if (command.cooldown) {
		/**
		 * Cooldown Check
		 */
		if (Cooldown.has(`${command.name}${owner}`))
			Cooldown.delete(`${command.name}${owner}`);

		if (Cooldown.has(`${command.name}${interaction.user.id}`)) {
			const cms = Cooldown.get(`${command.name}${interaction.user.id}`);
			const onChillOut = new EmbedBuilder()
				.setTitle("Slow Down!")
				.setColor("Red")
				.setDescription(
					`You are on a \`${ms(cms - Date.now(), { long: true })}\` cooldown.`
				);
			return interaction.reply({ embeds: [onChillOut], ephemeral: true });
		}

		/**
		 * Executing Command
		 */
		command.run({ client, interaction }).catch(async (err) => {
			console.error(err);

			const errorEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`**${err.name}**: ${err.message}`)
				.setFooter({
					text: "Please use the command again or contact support!",
				});
			const button: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel("Support Server")
						.setEmoji({ name: "⚙️" })
						.setURL("https://discord.gg/NFkMxFeEWr")
				);

			interaction.deferred
				? await interaction.editReply({
						embeds: [errorEmbed],
						components: [button],
				  })
				: await interaction.reply({
						embeds: [errorEmbed],
						components: [button],
				  });
		});

		/**
		 * Applying Cooldown
		 */
		Cooldown.set(
			`${command.name}${interaction.user.id}`,
			Date.now() + command.cooldown
		);
		setTimeout(() => {
			Cooldown.delete(`${command.name}${interaction.user.id}`);
		}, command.cooldown);
	}
});
