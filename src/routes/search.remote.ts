import { VITE_TMDB_CLIENT_ID } from '$env/static/private';
import { fetchJson } from '$lib/server/fetch';
import { SearchResponseSchema } from '$lib/server/schemas';
import { getRequestEvent, query } from '$app/server';
import * as v from 'valibot';

const SearchSchema = v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(100));

export const searchMovies = query(SearchSchema, async (searchString) => {
	const { fetch } = getRequestEvent();
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

	return movies.map((movie) => ({
		...movie,
		release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
	}));
});
