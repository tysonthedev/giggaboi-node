import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import UtilResponse from '../../types/UtilResponse';

async function skip(guildAudioPlayer: GuildAudioPlayer): Promise<UtilResponse> {
	if (!Boolean(guildAudioPlayer?.audioPlayer))
		return {
			success: false,
			error: 'There is currently no audio player',
		};
	if (await guildAudioPlayer.audioPlayer?.stop()) {
		if (guildAudioPlayer.isQueueEmpty()) await guildAudioPlayer.destroy();
		return { success: true };
	} else
		return {
			success: false,
			error: 'Audio player failed to skip',
		};
}

export default skip;
