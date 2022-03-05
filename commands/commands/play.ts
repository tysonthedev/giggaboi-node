import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Play implements Command {
	data = new SlashCommandBuilder()
		.setName('play')
		.setDescription('plays audio using a local file name or link')
		.addStringOption((option) => option.setName('link').setDescription('the link to the video').setRequired(true))
		.toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const linkOrSearchTerm = interactionOrCommand.options.getString('link');
		if (!Boolean(linkOrSearchTerm)) return interactionOrCommand.reply('no link in command argument');
		const playAudioResponse = AudioManager.play(
			interactionOrCommand,
			linkOrSearchTerm!,
			interactionOrCommand.guildId
		);
		if (!playAudioResponse.success) interactionOrCommand.reply(playAudioResponse.error ?? 'An Error Occurred');
		else interactionOrCommand.reply('Audio started playing!');
	};
}
const play = new Play();
export default play;
