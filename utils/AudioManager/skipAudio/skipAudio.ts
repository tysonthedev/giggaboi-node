import { Interaction } from 'discord.js';
import { AudioPlayerStatus } from '@discordjs/voice';

import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import UtilResponse from '../../types/UtilResponse';

function skip(guildAudioPlayer: GuildAudioPlayer): UtilResponse {
	if (!Boolean(guildAudioPlayer?.audioPlayer))
		return {
			success: false,
			error: 'There is currently no audio player',
		};
	if (guildAudioPlayer.audioPlayer?.stop()) {
		if (guildAudioPlayer.isQueueEmpty()) guildAudioPlayer.destroy();
		return { success: true };
	} else
		return {
			success: false,
			error: 'Audio player failed to skip',
		};
}

export default skip;
