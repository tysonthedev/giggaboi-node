import UtilResponse from '../../types/UtilResponse';
import ytdl from 'ytdl-core';
import { Readable } from 'stream';

const DOWNLOAD_OPTIONS: ytdl.downloadOptions = {
	filter: 'audioonly',
	quality: 'highestaudio',
	highWaterMark: 1048576 * 32,
};

const RETRY_COUNT = 5;

function _getYtdlStream(link: string): Readable | boolean {
	const stream = ytdl(link, DOWNLOAD_OPTIONS).on('error', (error: Error) => {
		console.log('error occurred on ytdl:', error);
		return false;
	});
	return stream;
}

function getAudioStream(linkOrFileName: string): Readable | boolean {
	let stream: Readable | boolean = false;
	//retry getting the stream 5 times if it still fails then pass back false
	for (let i = 0; i < RETRY_COUNT; i++) {
		if (Boolean(stream)) break;
		stream = _getYtdlStream(linkOrFileName);
	}
	return stream;
}
export default { getAudioStream };
