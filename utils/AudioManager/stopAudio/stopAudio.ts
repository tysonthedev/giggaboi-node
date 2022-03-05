import { AudioPlayerStatus } from '@discordjs/voice';

import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import UtilResponse from '../../types/UtilResponse';

async function skip(guildAudioPlayer: GuildAudioPlayer): Promise<UtilResponse> {
	if (!Boolean(guildAudioPlayer?.audioPlayer))
		return {
			success: false,
			error: 'There is currently no audio player',
		};
	if (guildAudioPlayer?.getQueueArray()?.length ?? 0 > 0) guildAudioPlayer.clearQueue();

	if (guildAudioPlayer.audioPlayer?.state.status !== AudioPlayerStatus.Idle)
		if (await guildAudioPlayer.audioPlayer?.stop) {
			await guildAudioPlayer.destroy();
			return { success: true };
		} else
			return {
				success: false,
				error: 'Audio player failed to stop',
			};
	else return { success: true };
}

export default skip;
