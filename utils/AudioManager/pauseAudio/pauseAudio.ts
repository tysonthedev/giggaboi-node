import { AudioPlayerStatus } from '@discordjs/voice';

import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import UtilResponse from '../../types/UtilResponse';

async function pause(guildAudioPlayer: GuildAudioPlayer): Promise<UtilResponse> {
	if (!Boolean(guildAudioPlayer?.audioPlayer))
		return {
			success: false,
			error: 'There is currently no audio player',
		};
	if ([AudioPlayerStatus.Paused, AudioPlayerStatus.AutoPaused].includes(guildAudioPlayer.audioPlayer!.state.status))
		return {
			success: false,
			error: 'Audio is already paused',
		};
	if (await guildAudioPlayer.audioPlayer?.pause()) return { success: true };
	else
		return {
			success: false,
			error: 'Audio player failed to pause',
		};
}

export default pause;
