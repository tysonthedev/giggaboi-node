import ytsr from 'ytsr';

const SEARCH_OPTIONS: ytsr.Options = {
	limit: 1,
	safeSearch: false,
};

async function getVideoUrl(searchTerm: string): Promise<string | null> {
	const filter = await ytsr.getFilters(searchTerm);
	const filter1 = filter.get('Type')?.get('Video');
	if (!Boolean(filter1?.url)) return null;
	const searchResults = await ytsr(filter1!.url!, SEARCH_OPTIONS);
	const itemResult: any = searchResults?.items;
	return itemResult?.[0]?.url ?? null;
}
export default { getVideoUrl };
