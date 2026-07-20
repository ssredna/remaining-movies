import { VITE_TRAKT_CLIENT_ID } from '$env/static/private';
import { fetchJson } from '$lib/server/fetch';
import { HistoryArraySchema } from '$lib/server/schemas';

type ServerFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export const traktHeaders = {
	'Content-Type': 'application/json',
	'User-Agent': 'anesh.no',
	'trakt-api-version': '2',
	'trakt-api-key': VITE_TRAKT_CLIENT_ID
};

export async function fetchWatchedMovieIds(fetch: ServerFetch) {
	const watchedHistory = await fetchJson(
		fetch,
		'https://api.trakt.tv/users/ssredna/watched/movies',
		{
			headers: traktHeaders
		},
		'Trakt watched history',
		HistoryArraySchema
	);

	return watchedHistory.map((historyItem) => historyItem.movie.ids.tmdb);
}
