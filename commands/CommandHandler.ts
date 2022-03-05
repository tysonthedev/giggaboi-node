import { Interaction, Message } from 'discord.js';
import AllCommands from './AllCommands';

async function CommandHandler(interactionOrCommand: Interaction | Message): Promise<void | boolean> {
	if (!interactionOrCommand.isCommand()) return false;
	try {
		await AllCommands.find((command) => command.data?.name === interactionOrCommand.commandName)?.execute(
			interactionOrCommand
		);
	} catch (error) {
		interactionOrCommand.reply(`An Error occurred while executing a command:${error}`);
	}
}
export default CommandHandler;
