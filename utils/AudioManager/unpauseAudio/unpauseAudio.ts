import { Interaction } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';

import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import UtilResponse from '../../types/UtilResponse';

async function unpause(guildAudioPlayer: GuildAudioPlayer): Promise<UtilResponse> {
	if (!Boolean(guildAudioPlayer?.audioPlayer))
		return {
			success: false,
			error: 'There is currently no audio player',
		};
	if (
		[AudioPlayerStatus.Playing, AudioPlayerStatus.Buffering, AudioPlayerStatus.Idle].includes(
			guildAudioPlayer.audioPlayer!.state.status
		)
	)
		return {
			success: false,
			error: 'Audio is not paused',
		};
	if (await guildAudioPlayer.audioPlayer?.unpause()) return { success: true };
	else
		return {
			success: false,
			error: 'Audio player failed to unpause',
		};
}

export default unpause;
