import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Skip implements Command {
	data = new SlashCommandBuilder().setName('skip').setDescription('Skips the current playing audio').toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const playAudioResponse = AudioManager.skip(interactionOrCommand.guildId);
		if (!playAudioResponse.success) interactionOrCommand.reply(playAudioResponse.error ?? 'An Error Occurred');
		else interactionOrCommand.reply('Skipped Audio');
	};
}
const skip = new Skip();
export default skip;
