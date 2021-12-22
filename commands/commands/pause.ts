import { Interaction } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Pause implements Command {
	data = new SlashCommandBuilder().setName('pause').setDescription('pauses current playing audio').toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const pauseResponse = AudioManager.pause(interaction.guildId);
		if (!pauseResponse.success) interaction.reply(pauseResponse.error ?? 'An Error Occurred');
		else interaction.reply('Audio paused');
	};
}
const pause = new Pause();
export default pause;
