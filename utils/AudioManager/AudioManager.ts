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

async function play(interaction: Interaction, linkOrSearchTerm: string, guildId: string): Promise<UtilResponse> {
	if (!Boolean(_findAudioPlayerByGuildId(guildId))) {
		const newGuildAudioPlayer = new GuildAudioPlayer(guildId, _onGuildAudioPlayerDestroy);
		_guildAudioPlayers.push(newGuildAudioPlayer);
	}
	const currentGuildAudioPlayer: GuildAudioPlayer = _findAudioPlayerByGuildId(guildId)!;
	const playResponse = await playAudio(interaction, linkOrSearchTerm, currentGuildAudioPlayer!);
	//even if playing the audio failed we still need to see if we need to add a new audio player to our array
	if (!Boolean(playResponse.success)) return playResponse;
	return { success: true };
}

async function pause(guildId: string): Promise<UtilResponse> {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	const pauseResponse = await pauseAudio(currentGuildAudioPlayer);
	if (!Boolean(pauseResponse.success)) return pauseResponse;
	return { success: true };
}

async function unpause(guildId: string): Promise<UtilResponse> {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	const pauseResponse = await unpauseAudio(currentGuildAudioPlayer);
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

async function skip(guildId: string): Promise<UtilResponse> {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	else return await skipAudio(currentGuildAudioPlayer);
}

async function stop(guildId: string): Promise<UtilResponse> {
	const currentGuildAudioPlayer: GuildAudioPlayer | undefined = _findAudioPlayerByGuildId(guildId);
	if (!currentGuildAudioPlayer)
		return {
			success: false,
			error: 'No audio player in the server',
		};
	else return await stopAudio(currentGuildAudioPlayer);
}

export default { play, pause, unpause, queue, skip, stop };
