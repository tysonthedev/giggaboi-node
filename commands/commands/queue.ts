import { Interaction } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Queue implements Command {
	data = new SlashCommandBuilder().setName('queue').setDescription('See the current queue').toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const queueResponse = AudioManager.queue(interaction.guildId);
		if (!queueResponse.success) interaction.reply(queueResponse.error ?? 'An Error Occurred');
		else interaction.reply('Queue\n' + queueResponse.queue?.join('\n'));
	};
}
const queue = new Queue();
export default queue;
