import { Interaction, VoiceChannel } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Play implements Command {
	data = new SlashCommandBuilder()
		.setName('play')
		.setDescription('plays audio using a local file name or link')
		.addStringOption((option) => option.setName('link').setDescription('the link to the video').setRequired(true))
		.toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const linkToVideo = interaction.options.getString('link');
		if (!Boolean(linkToVideo)) return interaction.reply('no link in command argument');
		const playAudioResponse = AudioManager.play(interaction, linkToVideo!, interaction.guildId);
		if (!playAudioResponse.success) interaction.reply(playAudioResponse.error ?? 'An Error Occurred');
		else interaction.reply('Audio started playing!');
	};
}
const play = new Play();
export default play;
