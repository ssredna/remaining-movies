import { VITE_TRAKT_CLIENT_ID } from '$env/static/private';
import { fetchJson } from '$lib/server/fetch';
import { HistoryArraySchema } from '$lib/server/schemas';
import { json } from '@sveltejs/kit';

export async function GET({ url, fetch }) {
	const movieId = Number(url.searchParams.get('id')) ?? '';

	const watchedHistory = await fetchJson(
		fetch,
		'https://api.trakt.tv/users/ssredna/watched/movies',
		{
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'anesh.no',
				'trakt-api-version': '2',
				'trakt-api-key': VITE_TRAKT_CLIENT_ID
			}
		},
		'Trakt watched history',
		HistoryArraySchema
	);

	const watchedIds = watchedHistory.map((historyItem) => historyItem.movie.ids.tmdb);

	return watchedIds.includes(movieId) ? json(true) : json(false);
}
