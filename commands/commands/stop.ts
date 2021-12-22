import { Interaction, VoiceChannel } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Stop implements Command {
	data = new SlashCommandBuilder().setName('stop').setDescription('stops all playing audio').toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const playAudioResponse = AudioManager.stop(interaction.guildId);
		if (!playAudioResponse.success) interaction.reply(playAudioResponse.error ?? 'An Error Occurred');
		else interaction.reply('Stopped Audio');
	};
}
const stop = new Stop();
export default stop;
