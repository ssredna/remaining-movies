import { VITE_TRAKT_CLIENT_ID } from '$env/static/private';

export const load = async ({ fetch }) => {
	const res = await fetch('https://api.trakt.tv/users/ssredna/stats', {
		headers: {
			'Content-Type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': VITE_TRAKT_CLIENT_ID
		}
	});
	const stats = await res.json();
	const remainingMovies = 1000 - stats.movies.plays;

	return {
		remainingMovies
	};
};
