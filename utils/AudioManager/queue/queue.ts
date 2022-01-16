import { GuildAudioPlayer } from '../GuildAudioPlayer/types/GuildAudioPlayerTypes';

import { QueueResponse } from './types/QueueResponse';

function queue(guildAudioPlayer: GuildAudioPlayer): QueueResponse {
	if (guildAudioPlayer.getQueueArray())
		return {
			success: true,
			queue: guildAudioPlayer.getQueueArray(),
		};
	else {
		return {
			success: false,
			error: 'No audio in queue',
		};
	}
}

export default queue;
