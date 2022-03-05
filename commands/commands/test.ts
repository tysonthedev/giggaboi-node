import { Interaction, Message } from 'discord.js';
import Command from '../types/Command';
const { SlashCommandBuilder } = require('@discordjs/builders');

class Test implements Command {
	data = new SlashCommandBuilder().setName('test').setDescription('this is a test command').toJSON();
	execute: (interactionOrCommand: Interaction | Message) => void = async (
		interactionOrCommand: Interaction | Message
	) => {
		if (!interactionOrCommand.isCommand()) return;
		interactionOrCommand.reply("this is the test command's reply");
	};
}
const test = new Test();
export default test;
