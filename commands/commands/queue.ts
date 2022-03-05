import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import AudioManager from '../../utils/AudioManager/AudioManager';
import { SlashCommandBuilder } from '@discordjs/builders';

class Queue implements Command {
	data = new SlashCommandBuilder().setName('queue').setDescription('See the current queue').toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const queueResponse = AudioManager.queue(interactionOrCommand.guildId);
		if (!queueResponse.success) interactionOrCommand.reply(queueResponse.error ?? 'An Error Occurred');
		else interactionOrCommand.reply('Queue\n' + queueResponse.queue?.join('\n'));
	};
}
const queue = new Queue();
export default queue;
