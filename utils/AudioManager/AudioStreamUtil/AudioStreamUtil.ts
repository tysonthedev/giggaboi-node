import UtilResponse from '../../types/UtilResponse';
import ytdl from 'ytdl-core';
import { Readable } from 'stream';

const DOWNLOAD_OPTIONS: ytdl.downloadOptions = {
	filter: 'audioonly',
	quality: 'highestaudio',
	highWaterMark: 1048576 * 32,
};

const RETRY_COUNT = 2;

async function _getYtdlStream(link: string): Promise<Readable | boolean> {
	try {
		//there is currently a bug in ytdl for not being able to catch
		//miniget error status code 410. By using ytdl.getInfo
		//you are able to catch and handle it. janky workaround but
		//it works for now
		await ytdl.getInfo(link);
		const stream = ytdl(link, DOWNLOAD_OPTIONS);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (stream.readableLength <= 0) return false;
		return stream;
	} catch (e) {
		console.log('failed to get ytdl stream:', e);
		return false;
	}
}

async function getAudioStream(linkOrSearchTerm: string): Promise<Readable | boolean> {
	let stream: Readable | boolean = false;
	//retry getting the stream 5 times if it still fails then pass back false
	for (let i = 0; i < RETRY_COUNT; i++) {
		if (Boolean(stream)) break;
		stream = await _getYtdlStream(linkOrSearchTerm);
	}
	//if it failed all 5 times then we need to return false
	console.log('returning stream:', stream);
	return stream;
}
export default { getAudioStream };
