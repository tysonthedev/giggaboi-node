import UtilResponse from '../../types/UtilResponse';
import ytsr, { Result as SearchResult } from 'ytsr';

const SEARCH_OPTIONS: ytsr.Options = {
	limit: 1,
};

async function getVideoUrl(searchTerm: string): Promise<string> {
	const searchResults = await ytsr(searchTerm, {
		limit: 5,
		safeSearch: false,
	});
	return '';
}
export default { getVideoUrl };
