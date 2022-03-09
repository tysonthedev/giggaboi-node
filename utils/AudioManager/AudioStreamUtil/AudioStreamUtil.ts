import ytdl from 'ytdl-core';
import { Readable } from 'stream';
import timeOut from '../../timeOut';
import { Interaction, Message } from 'discord.js';
import interactionOrMessageReply from '../../interactionOrMessageReply';

const DOWNLOAD_OPTIONS: ytdl.downloadOptions = {
	filter: 'audioonly',
	quality: 'highestaudio',
	highWaterMark: 1048576 * 32,
};

const NON_TIME_OUT_ERROR = 'other_error';

const TRY_COUNT = 5;

const TIME_OUT_TIME = 5000;

async function _getStreamPromise(link: string): Promise<Readable | boolean | string> {
	//there is currently a bug in ytdl for not being able to catch
	//miniget error status code 410. By using ytdl.getInfo
	//you are able to catch and handle it. janky workaround but
	//it works for now
	return new Promise(async function (resolve, reject) {
		try {
			await ytdl.getInfo(link);
			const stream = ytdl(link, DOWNLOAD_OPTIONS);
			//wait for 1 second to try and make sure the audio player has enough of a buffer
			await new Promise((timeOutResolve) => setTimeout(timeOutResolve, 1000));
			if (stream.readableLength <= 0) return false;
			resolve(stream);
		} catch (e) {
			//if an error occurs in here that means it was not a time out error
			//as a Promise.any is used to determine if it's a timeout
			resolve(NON_TIME_OUT_ERROR);
		}
	});
}

async function _getYtdlStream(link: string): Promise<Readable | boolean | string> {
	try {
		const streamData = await timeOut(TIME_OUT_TIME, _getStreamPromise(link));
		return streamData;
	} catch (e) {
		return false;
	}
}

async function getAudioStream(
	linkOrSearchTerm: string,
	interactionOrMessage: Message | Interaction
): Promise<Readable | boolean> {
	let stream: Readable | boolean | string = false;
	//retry getting the stream RETRY_COUNT times if it still fails then pass back false
	//typescript does not have the send method at all. so we are making this an any to allow
	//sending a message
	let retryMessage: Message | null = null;
	//this is used to make sure that if the song was queued that we send a new message rather than editing
	//a message that was sent a long time ago
	const useInteractionOrMessage = interactionOrMessage.isCommand() && !Boolean(interactionOrMessage.replied);

	for (let i = 0; i < TRY_COUNT; i++) {
		stream = await _getYtdlStream(linkOrSearchTerm);
		if (stream === NON_TIME_OUT_ERROR) {
			retryMessage = await interactionOrMessageReply(
				retryMessage ?? useInteractionOrMessage ? interactionOrMessage : null,
				useInteractionOrMessage ? null : interactionOrMessage.channelId,
				`Failed to play song: ${linkOrSearchTerm}`
			);
			return false;
		}
		if (Boolean(stream)) break;
		if (i <= 0) continue;
		retryMessage = await interactionOrMessageReply(
			retryMessage ?? useInteractionOrMessage ? interactionOrMessage : null,
			useInteractionOrMessage ? null : interactionOrMessage.channelId,
			`Retry ${i}/${TRY_COUNT - 1} to play ${linkOrSearchTerm}`
		);
	}
	if (Boolean(stream))
		interactionOrMessageReply(
			retryMessage ?? useInteractionOrMessage ? interactionOrMessage : null,
			useInteractionOrMessage ? null : interactionOrMessage.channelId,
			`Playing ${linkOrSearchTerm}`
		);
	else
		interactionOrMessageReply(
			retryMessage ?? useInteractionOrMessage ? interactionOrMessage : null,
			useInteractionOrMessage ? null : interactionOrMessage.channelId,
			`Failed to play ${linkOrSearchTerm}`
		);
	//if it failed all 5 times or there is a stream then return it
	return stream as Readable | boolean;
}
export default { getAudioStream };
