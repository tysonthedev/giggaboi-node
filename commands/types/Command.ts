import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types';
import { Interaction, Message } from 'discord.js';

export default interface Command {
	data: RESTPostAPIApplicationCommandsJSONBody;
	requireVoiceChannel?: boolean;
	execute: (interactionOrMessage: Interaction | Message) => void;
}
