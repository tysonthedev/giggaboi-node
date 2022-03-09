import { Interaction, Message } from 'discord.js';
import AllCommands from './AllCommands';

async function CommandHandler(interactionOrCommand: Interaction | Message): Promise<void | boolean> {
	if (!interactionOrCommand.isCommand()) return false;
	try {
		if (
			!Boolean(
				interactionOrCommand.guild?.members.cache.get(interactionOrCommand.member.user.id)?.voice?.channel
			)
		)
			return await interactionOrCommand.reply('You are not connected to a voice channel');
		await AllCommands.find((command) => command.data?.name === interactionOrCommand.commandName)?.execute(
			interactionOrCommand
		);
	} catch (error) {
		if (interactionOrCommand.replied)
			await interactionOrCommand.editReply(`An Error occurred while executing a command:${error}`);
		else await interactionOrCommand.reply(`An Error occurred while executing a command:${error}`);
	}
}
export default CommandHandler;
