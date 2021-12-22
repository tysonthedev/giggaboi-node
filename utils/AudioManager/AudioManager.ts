import { Interaction } from 'discord.js';
import playAudio from './playAudio/playAudio';
import pauseAudio from './pauseAudio/pauseAudio';
import unpauseAudio from './unpauseAudio/unpauseAudio';
import skipAudio from './skipAudio/skipAudio';
import stopAudio from './stopAudio/stopAudio';
import getQueue from './queue/queue';
import GuildAudioPlayer from './GuildAudioPlayer/GuildAudioPlayer';
import UtilResponse from '../types/UtilResponse';
import { QueueResponse } from './queue/types/QueueResponse';

const _guildAudioPlayers: Array<GuildAudioPlayer> = [];

function _onGuildAudioPlayerDestroy(guildId: string) {
	_guildAudioPlayers.splice(
		_guildAudioPlayers.findIndex((guildAudioPlayer) => guildAudioPlayer.guildId === guildId),
		1
	);
}

function _findAudioPlayerByGuildId(guildId: string): GuildAudioPlayer | undefined {
	if (_guildAudioPlayers.length <= 0) return undefined;
	return _guildAudioPlayers.find((guildAudioPlayer) => guildAudioPlayer.guildId === guildId);
}

function play(interaction: Interaction, linkOrFileName: string, guildId: string): UtilResponse {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	let newGuildAudioPlayer = new GuildAudioPlayer(guildId, _onGuildAudioPlayerDestroy);
	const playResponse = playAudio(interaction, linkOrFileName, currentGuildAudioPlayer ?? newGuildAudioPlayer!);
	//even if playing the audio failed we still need to see if we need to add a new audio player to our array
	if (Boolean(playResponse.guildAudioPlayer) && !Boolean(currentGuildAudioPlayer))
		_guildAudioPlayers.push(playResponse.guildAudioPlayer!);
	if (!Boolean(playResponse.success)) return playResponse;
	return { success: true };
}

function pause(guildId: string): UtilResponse {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	const pauseResponse = pauseAudio(currentGuildAudioPlayer);
	if (!Boolean(pauseResponse.success)) return pauseResponse;
	return { success: true };
}

function unpause(guildId: string): UtilResponse {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	const pauseResponse = unpauseAudio(currentGuildAudioPlayer);
	if (!Boolean(pauseResponse.success)) return pauseResponse;
	return { success: true };
}

function queue(guildId: string): QueueResponse {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio in the queue',
		};
	else return getQueue(currentGuildAudioPlayer);
}

function skip(guildId: string): UtilResponse {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	else return skipAudio(currentGuildAudioPlayer);
}

function stop(guildId: string): UtilResponse {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	else return stopAudio(currentGuildAudioPlayer);
}

export default { play, pause, unpause, queue, skip, stop };