import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Stop implements Command {
	data = new SlashCommandBuilder().setName('stop').setDescription('stops all playing audio').toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const playAudioResponse = await AudioManager.stop(interactionOrCommand.guildId);
		if (!playAudioResponse.success) interactionOrCommand.reply(playAudioResponse.error ?? 'An Error Occurred');
		else interactionOrCommand.reply('Stopped Audio');
	};
}
const stop = new Stop();
export default stop;
