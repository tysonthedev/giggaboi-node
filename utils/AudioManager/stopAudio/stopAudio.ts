import { AudioPlayerStatus } from '@discordjs/voice';

import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import UtilResponse from '../../types/UtilResponse';

function skip(guildAudioPlayer: GuildAudioPlayer): UtilResponse {
	if (!Boolean(guildAudioPlayer?.audioPlayer))
		return {
			success: false,
			error: 'There is currently no audio player',
		};
	if (guildAudioPlayer?.getQueueArray()?.length ?? 0 > 0) guildAudioPlayer.clearQueue();

	if (guildAudioPlayer.audioPlayer?.state.status !== AudioPlayerStatus.Idle)
		if (guildAudioPlayer.audioPlayer?.stop) {
			guildAudioPlayer.destroy();
			return { success: true };
		} else
			return {
				success: false,
				error: 'Audio player failed to stop',
			};
	else return { success: true };
}

export default skip;
