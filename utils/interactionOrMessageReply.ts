import GiggaBoiNodeClient from '../GiggaBoiNodeClient';
import { Interaction, Message } from 'discord.js';

/*
PURPOSE
This message is intended to basically be a safe way that does all of the proper
checks before sending a reply, editing a reply, or sending a new message directly
to a channel

Usage and things to keep in mind
if you pass in a channelId it will always send a new message to the channel and
return back to you a message object discord.js. You can then pass that same
message object back into this function to edit it. Typescript does not currently
have send in it's types on channel but it is there in regular javascript which is 
why an any type is used.
*/
export default async function (
	//we allow string or null as the channelId can be null from an interaction
	interactionOrMessage: Message | Interaction | null,
	channelId: string | null,
	message: string
): Promise<Message | null> {
	if (Boolean(channelId)) {
		const channel: any = await GiggaBoiNodeClient.channels.fetch(channelId!);
		if (!Boolean(channel?.send)) {
			throw new Error(`send is not a method on this channel or the channel was not found: ${channelId}`);
		}
		return (await channel?.send(message)) as Message;
	}
	//we will always reply if there hasn't been a reply to the chat
	if (interactionOrMessage?.isCommand()) {
		if (!interactionOrMessage.replied && !interactionOrMessage.deferred) {
			await interactionOrMessage.reply(message);
		} else {
			await interactionOrMessage.editReply(message);
		}
	}
	return null;
}
