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

function _nextSong(guildAudioPlayer: GuildAudioPlayer) {
	try {
		const nextAudio = guildAudioPlayer.getNextQueueAudio();
		if (!Boolean(nextAudio)) return false;
		const stream: Readable | boolean = AudioStreamUtil.getAudioStream(nextAudio!);
		if (!Boolean(stream)) return false;
		const audioResource = createAudioResource(stream as Readable);
		guildAudioPlayer?.audioPlayer?.play(audioResource);
		return true;
	} catch (e) {
		return false;
	}
}

function play(
	interaction: Interaction | Message,
	linkOrFileName: string,
	guildAudioPlayer: GuildAudioPlayer
): PlayResponse {
	if (!ytdl.validateURL(linkOrFileName))
		return {
			success: false,
			error: 'Invalid URL',
		};
	guildAudioPlayer.addAudioToQueue(linkOrFileName);
	//if they don't exist then we need to make new ones
	if (!Boolean(guildAudioPlayer?.connection)) {
		const connectResponse: ConnectResponse = connect(interaction);
		if (!connectResponse.success) return connectResponse;
		guildAudioPlayer.connection = connectResponse.connection;
	}
	if (guildAudioPlayer?.connection?.state?.status === VoiceConnectionStatus.Disconnected)
		guildAudioPlayer?.connection?.rejoin();
	if (guildAudioPlayer?.connection?.state?.status === VoiceConnectionStatus.Destroyed) {
		const connectResponse: ConnectResponse = connect(interaction);
		if (!connectResponse.success) return connectResponse;
		guildAudioPlayer.connection = connectResponse.connection;
	}
	if (!Boolean(guildAudioPlayer?.audioPlayer)) {
		guildAudioPlayer.audioPlayer = createAudioPlayer();
		guildAudioPlayer.audioPlayer.on('error', (error) => {
			console.log('an error occured on the audio player:', error);
			guildAudioPlayer.audioPlayer?.stop();
		});
		guildAudioPlayer.audioPlayer.on(
			AudioPlayerStatus.Idle,
			(oldState: AudioPlayerState, newState: AudioPlayerState) => {
				while (!Boolean(_nextSong(guildAudioPlayer))) {
					if (guildAudioPlayer.isQueueEmpty()) {
						guildAudioPlayer.destroy();
						break;
					}
				}
			}
		);
		guildAudioPlayer.connection!.subscribe(guildAudioPlayer?.audioPlayer);
	}
	if (guildAudioPlayer?.audioPlayer?.state.status === AudioPlayerStatus.Playing)
		return {
			guildAudioPlayer,
			success: true,
		};
	//we shouldn't ever need to reference the audioResource because we are able to overwrite it whenever we want
	while (!Boolean(_nextSong(guildAudioPlayer))) {
		if (guildAudioPlayer.isQueueEmpty()) {
			guildAudioPlayer.destroy();
			return {
				guildAudioPlayer,
				success: false,
				error: 'Failed to play song',
			};
		}
	}
	return {
		guildAudioPlayer,
		success: true,
	};
}

export default play;
