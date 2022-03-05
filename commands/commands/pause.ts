import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Pause implements Command {
	data = new SlashCommandBuilder().setName('pause').setDescription('pauses current playing audio').toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const pauseResponse = AudioManager.pause(interactionOrCommand.guildId);
		if (!pauseResponse.success) interactionOrCommand.reply(pauseResponse.error ?? 'An Error Occurred');
		else interactionOrCommand.reply('Audio paused');
	};
}
const pause = new Pause();
export default pause;
