import { Interaction, VoiceChannel } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Skip implements Command {
	data = new SlashCommandBuilder().setName('skip').setDescription('Skips the current playing audio').toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const playAudioResponse = AudioManager.skip(interaction.guildId);
		if (!playAudioResponse.success) interaction.reply(playAudioResponse.error ?? 'An Error Occurred');
		else interaction.reply('Skipped Audio');
	};
}
const skip = new Skip();
export default skip;
