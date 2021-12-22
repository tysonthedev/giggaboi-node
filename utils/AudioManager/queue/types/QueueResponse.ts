import UtilResponse from '../../../types/UtilResponse';

export interface QueueResponse extends UtilResponse {
	queue?: Array<string>;
}
