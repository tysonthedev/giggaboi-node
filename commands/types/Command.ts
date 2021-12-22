import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { ApplicationCommandOptionType, Interaction } from 'discord.js';

export default interface Command {
	data: RESTPostAPIApplicationCommandsJSONBody;
	execute: (interaction: Interaction) => void;
}
