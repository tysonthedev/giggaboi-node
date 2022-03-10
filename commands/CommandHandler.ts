import { Interaction, Message } from 'discord.js';
import AllCommands from './AllCommands';

async function CommandHandler(interactionOrCommand: Interaction | Message): Promise<void | boolean> {
	if (!interactionOrCommand.isCommand()) return false;
	try {
		const command = AllCommands.find((command) => command.data?.name === interactionOrCommand.commandName);
		if (command?.requireVoiceChannel)
			if (
				Boolean(command?.requireVoiceChannel) &&
				!Boolean(
					interactionOrCommand.guild?.members.cache.get(interactionOrCommand.member.user.id)?.voice
						?.channel
				)
			)
				return await interactionOrCommand.reply('You are not connected to a voice channel');
		await command?.execute(interactionOrCommand);
	} catch (error) {
		if (interactionOrCommand.replied)
			await interactionOrCommand.editReply(`An Error occurred while executing a command:${error}`);
		else await interactionOrCommand.reply(`An Error occurred while executing a command:${error}`);
	}
}
export default CommandHandler;
