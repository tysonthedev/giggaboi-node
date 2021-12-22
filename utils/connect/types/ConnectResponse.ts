import { VoiceConnection } from '@discordjs/voice';
import UtilResponse from '../../types/UtilResponse';

export default interface ConnectResponse extends UtilResponse {
	connection?: VoiceConnection;
}
