import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Unpause implements Command {
	data = new SlashCommandBuilder().setName('unpause').setDescription('unpause current playing audio').toJSON();
	requireVoiceChannel = true;
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const pauseResponse = await AudioManager.unpause(interactionOrCommand.guildId);
		if (!pauseResponse.success) interactionOrCommand.reply(pauseResponse.error ?? 'An Error Occurred');
		else interactionOrCommand.reply('Audio unpaused');
	};
}
const unpause = new Unpause();
export default unpause;
