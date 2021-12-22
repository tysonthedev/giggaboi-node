import { Interaction } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Unpause implements Command {
	data = new SlashCommandBuilder().setName('unpause').setDescription('unpause current playing audio').toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const pauseResponse = AudioManager.unpause(interaction.guildId);
		if (!pauseResponse.success) interaction.reply(pauseResponse.error ?? 'An Error Occurred');
		else interaction.reply('Audio unpaused');
	};
}
const unpause = new Unpause();
export default unpause;
