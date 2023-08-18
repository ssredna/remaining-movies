import { VITE_TRAKT_CLIENT_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { history } from '../+page.server.js';

export async function GET({ url }) {
	const movieId = Number(url.searchParams.get('id')) ?? '';

	const watchedHistory: history[] = await fetch(
		'https://api.trakt.tv/users/ssredna/watched/movies',
		{
			headers: {
				'Content-Type': 'application/json',
				'trakt-api-version': '2',
				'trakt-api-key': VITE_TRAKT_CLIENT_ID
			}
		}
	).then((res) => res.json());

	const watchedIds = watchedHistory.map((historyItem) => historyItem.movie.ids.tmdb);

	return watchedIds.includes(movieId) ? json(true) : json(false);
}
