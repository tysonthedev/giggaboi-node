import { AudioPlayer, VoiceConnection } from '@discordjs/voice';
import { GuildAudioPlayer } from './types/GuildAudioPlayerTypes';

export default class InternalGuildAudioPlayer implements GuildAudioPlayer {
	guildId: string;
	getNextQueueAudio: () => string | undefined;
	addAudioToQueue: (linkOrFile: string) => void;
	getQueueArray: () => Array<string> | undefined;
	isQueueEmpty: () => boolean;
	clearQueue: () => void;
	destroy: () => void;
	onDestroy: (guildId: string) => void;
	connection?: VoiceConnection;
	audioPlayer?: AudioPlayer;
	private _queue?: Array<string>;

	constructor(guildId: string, onDestroy: (guildId: string) => void) {
		this.guildId = guildId;
		this._queue = [];
		this.getNextQueueAudio = () => {
			return this._queue?.shift();
		};
		this.addAudioToQueue = (linkOrFile: string) => {
			this._queue?.push(linkOrFile);
		};
		this.isQueueEmpty = () => {
			return (this._queue?.length ?? 0) <= 0;
		};
		this.getQueueArray = () => {
			return this._queue;
		};
		this.clearQueue = () => {
			this._queue = [];
		};
		this.onDestroy = onDestroy;
		this.destroy = () => {
			this.connection?.disconnect();
			this.connection?.destroy();
			this.clearQueue();
			this.audioPlayer?.stop();
			delete this.connection;
			delete this.audioPlayer;
			delete this._queue;
			this.onDestroy(this.guildId);
		};
	}
}
