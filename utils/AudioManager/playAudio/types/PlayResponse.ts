import UtilResponse from '../../../types/UtilResponse';
import { GuildAudioPlayer } from '../../GuildAudioPlayer/types/GuildAudioPlayerTypes';

export default interface PlayResponse extends UtilResponse {
	guildAudioPlayer?: GuildAudioPlayer;
}
