import { Interaction } from 'discord.js';
import Command from '../types/Command';
import connect from '../../utils/connect/connect';

const { SlashCommandBuilder } = require('@discordjs/builders');

class Connect implements Command {
	data = new SlashCommandBuilder()
		.setName('connect')
		.setDescription('connects the bot to your current voice channel')
		.toJSON();
	execute: (interaction: Interaction) => void = async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const connectedResponse = await connect(interaction);
		if (connectedResponse.success) interaction.reply('connected');
		else interaction.reply(connectedResponse?.error ?? 'an error occurred');
	};
}
const connectCommand = new Connect();
export default connectCommand;
