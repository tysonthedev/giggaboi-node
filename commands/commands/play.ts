import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Play implements Command {
	data = new SlashCommandBuilder()
		.setName('play')
		.setDescription('plays audio using a search term or link')
		.addStringOption((option) =>
			option
				.setName('linkorsearchterm')
				.setDescription('the search term or link for the video')
				.setRequired(true)
		)
		.toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const linkOrSearchTerm = interactionOrCommand.options.getString('linkorsearchterm');
		if (!Boolean(linkOrSearchTerm))
			return await interactionOrCommand.reply('no link or search term in command argument');
		await interactionOrCommand.deferReply();
		const playAudioResponse = await AudioManager.play(
			interactionOrCommand,
			linkOrSearchTerm!,
			interactionOrCommand.guildId
		);
	};
}
const play = new Play();
export default play;
