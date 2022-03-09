import { Interaction, Message } from 'discord.js';
import {
	AudioPlayerState,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';

import PlayResponse from './types/PlayResponse';
import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';
import ConnectResponse from '../../connect/types/ConnectResponse';

import AudioStreamUtil from '../AudioStreamUtil/AudioStreamUtil';
import connect from '../../connect/connect';
import { Readable } from 'node:stream';
import youtubeSearchUtil from '../youtubeSearchUtil/youtubeSearchUtil';
import interactionOrMessageReply from '../../interactionOrMessageReply';

async function _nextSong(guildAudioPlayer: GuildAudioPlayer, interactionOrMessage: Interaction | Message) {
	try {
		const nextAudio = guildAudioPlayer.getNextQueueAudio();
		if (!Boolean(nextAudio)) return false;
		const stream: Readable | boolean = await AudioStreamUtil.getAudioStream(nextAudio!, interactionOrMessage);
		if (!Boolean(stream)) return false;
		const audioResource = await createAudioResource(stream as Readable);
		await guildAudioPlayer?.audioPlayer?.play(audioResource);
		return true;
	} catch (e) {
		return false;
	}
}

async function play(
	interactionOrMessage: Interaction | Message,
	linkOrSearchTerm: string,
	guildAudioPlayer: GuildAudioPlayer
): Promise<PlayResponse> {
	let url: string = linkOrSearchTerm;
	if (!ytdl.validateURL(linkOrSearchTerm)) {
		url = (await youtubeSearchUtil.getVideoUrl(linkOrSearchTerm)) ?? '';
		if (url === '')
			return {
				success: false,
				error: 'Invalid URL/search term',
			};
	}
	guildAudioPlayer.addAudioToQueue(url);
	//if they don't exist then we need to make new ones
	if (!Boolean(guildAudioPlayer?.connection)) {
		const connectResponse: ConnectResponse = await connect(interactionOrMessage);
		if (!connectResponse.success) return connectResponse;
		guildAudioPlayer.connection = connectResponse.connection;
	}
	if (guildAudioPlayer?.connection?.state?.status === VoiceConnectionStatus.Disconnected)
		await guildAudioPlayer?.connection?.rejoin();
	if (guildAudioPlayer?.connection?.state?.status === VoiceConnectionStatus.Destroyed) {
		const connectResponse: ConnectResponse = await connect(interactionOrMessage);
		if (!connectResponse.success) return connectResponse;
		guildAudioPlayer.connection = connectResponse.connection;
	}
	if (!Boolean(guildAudioPlayer?.audioPlayer)) {
		guildAudioPlayer.audioPlayer = await createAudioPlayer();
		guildAudioPlayer.audioPlayer.on(
			AudioPlayerStatus.Idle,
			async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
				while (!Boolean(await _nextSong(guildAudioPlayer, interactionOrMessage))) {
					if (guildAudioPlayer.isQueueEmpty()) {
						await guildAudioPlayer.destroy();
						break;
					}
				}
			}
		);
		await guildAudioPlayer.connection!.subscribe(guildAudioPlayer?.audioPlayer);
	}
	if (guildAudioPlayer?.audioPlayer?.state.status === AudioPlayerStatus.Playing) {
		if (!interactionOrMessage.isCommand())
			return {
				success: false,
				error: 'interactionOrMessage is not a command',
			};
		interactionOrMessageReply(interactionOrMessage, null, 'Song added to queue');
		return {
			guildAudioPlayer,
			success: true,
		};
	}
	//we shouldn't ever need to reference the audioResource because we are able to overwrite it whenever we want
	while (!Boolean(await _nextSong(guildAudioPlayer, interactionOrMessage))) {
		if (guildAudioPlayer.isQueueEmpty()) {
			await guildAudioPlayer.destroy();
			return {
				guildAudioPlayer,
				success: false,
				error: 'Failed to play song',
			};
		}
	}
	return {
		guildAudioPlayer,
		successMessage: 'Song started playing',
		success: true,
	};
}

export default play;
