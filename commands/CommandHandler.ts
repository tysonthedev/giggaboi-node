import { Interaction } from 'discord.js';
import AllCommands from './AllCommands';

function CommandHandler(interaction: Interaction): void | boolean {
	if (!interaction.isCommand()) return false;
	try {
		AllCommands.find((value) => value.data?.name === interaction.commandName)?.execute(interaction);
	} catch (error) {
		interaction.reply(`An Error occurred while executing a command:${error}`);
	}
}
export default CommandHandler;
