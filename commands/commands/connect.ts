import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
import connect from '../../utils/connect/connect';

const { SlashCommandBuilder } = require('@discordjs/builders');

class Connect implements Command {
	data = new SlashCommandBuilder()
		.setName('connect')
		.setDescription('connects the bot to your current voice channel')
		.toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		const connectedResponse = await connect(interactionOrCommand);
		if (connectedResponse.success) interactionOrCommand.reply('connected');
		else interactionOrCommand.reply(connectedResponse?.error ?? 'an error occurred');
	};
}
const connectCommand = new Connect();
export default connectCommand;
