import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	Collection,
} from "discord.js";
import {
	ChatInputCommandType,
	MessageCommandType,
	UserCommandType,
} from "../typings/Command";
import glob from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/CommandRegistration";
import { Event } from "./Event";

const promiseGlob = promisify(glob);

export class FClient extends Client {
	commands: Collection<string, ChatInputCommandType> = new Collection();
	messageCommands: Collection<string, MessageCommandType> = new Collection();
	userCommands: Collection<string, UserCommandType> = new Collection();

	constructor() {
		super({ intents: 32767 });
	}

	start() {
		this.registerModules();
		this.login(process.env.botToken);
	}

	private async importFile(filePath: string) {
		return (await import(filePath))?.default;
	}

	private async registerCommands({
		commands,
		guildId,
	}: RegisterCommandsOptions) {
		if (guildId) {
			this.guilds.cache.get(guildId)?.commands.set(commands);
			console.log(`Registering Command | Guild: ${guildId}`);
		} else {
			this.application?.commands.set(commands);
			console.log("Registering Commands | Global");
		}
	}

	private async registerModules() {
		/**
		 * Registering Slash Commands
		 */
		const fCommands: ApplicationCommandDataResolvable[] = [];

		const commandFiles = await promiseGlob(
			`${__dirname}/../commands/*/*{.ts,.js}`
		);
		const messageFiles = await promiseGlob(
			`${__dirname}/../menu/message/*/*{.ts,.js}`
		);
		const userFiles = await promiseGlob(
			`${__dirname}/../menu/user/*/*{.ts,.js}`
		);

		commandFiles.forEach(async (filePath) => {
			const command: ChatInputCommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.commands.set(command.name, command);
			fCommands.push(command);
		});

		messageFiles.forEach(async (filePath) => {
			const command: MessageCommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.messageCommands.set(command.name, command);
			fCommands.push(command);
		});

		userFiles.forEach(async (filePath) => {
			const command: UserCommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.userCommands.set(command.name, command);
			fCommands.push(command);
		});

		this.on("ready", () => {
			this.registerCommands({
				commands: fCommands,
				guildId: process.env.guildId,
			});
		});

		/**
		 * Registering Event
		 */
		const eventFiles = await promiseGlob(`${__dirname}/../events/*{.ts,.js}`);

		eventFiles.forEach(async (filePath) => {
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
	}
}
