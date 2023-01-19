import {
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	MessageApplicationCommandData,
	MessageContextMenuCommandInteraction,
	UserApplicationCommandData,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { FClient } from "../structures/Client";

interface ChatInputCommandRunOptions {
	client: FClient;
	interaction: ChatInputCommandInteraction;
}

interface MessageCommandRunOptions {
	client: FClient;
	interaction: MessageContextMenuCommandInteraction;
}

interface UserCommandRunOptions {
	client: FClient;
	interaction: UserContextMenuCommandInteraction;
}

type ChatInputCommandRunFunction = (options: ChatInputCommandRunOptions) => any;

type MessageCommandRunFunction = (options: MessageCommandRunOptions) => any;

type UserCommandRunFunction = (options: UserCommandRunOptions) => any;

export type ChatInputCommandType = {
	cooldown: number;
	nsfw?: boolean;
	ownerOnly?: boolean;
	run: ChatInputCommandRunFunction;
} & ChatInputApplicationCommandData;

export type MessageCommandType = {
	cooldown: number;
	run: MessageCommandRunFunction;
} & MessageApplicationCommandData;

export type UserCommandType = {
	cooldown: number;
	run: UserCommandRunFunction;
} & UserApplicationCommandData;
