import { AudioPlayer, VoiceConnection } from '@discordjs/voice';

export interface GuildAudioPlayer {
	guildId: string;
	getNextQueueAudio: () => string | undefined;
	addAudioToQueue: (linkOrSearchTerm: string) => void;
	isQueueEmpty: () => boolean;
	getQueueArray: () => Array<string> | undefined;
	clearQueue: () => void;
	onDestroy: (guildId: string) => void;
	destroy: () => void;
	connection?: VoiceConnection;
	audioPlayer?: AudioPlayer;
}
