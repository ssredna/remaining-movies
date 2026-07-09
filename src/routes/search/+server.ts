import { VITE_TMDB_CLIENT_ID } from '$env/static/private';
import { fetchJson } from '$lib/server/fetch';
import { SearchResponseSchema } from '$lib/server/schemas';
import { json } from '@sveltejs/kit';

export async function GET({ url, fetch }) {
	const searchString = url.searchParams.get('q') ?? '';

	const tmdbQuery =
		`https://api.themoviedb.org/3/search/movie?api_key=${VITE_TMDB_CLIENT_ID}&query=` +
		encodeURIComponent(searchString);

	const { results: movies } = await fetchJson(
		fetch,
		tmdbQuery,
		undefined,
		'TMDB search',
		SearchResponseSchema
	);

	const moviesWithReleaseYear = movies.map((movie) => ({
		...movie,
		release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
	}));

	return json(moviesWithReleaseYear);
}
