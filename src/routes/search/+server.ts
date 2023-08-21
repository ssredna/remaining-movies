import { VITE_TMDB_CLIENT_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { movie } from '../+page.server';

export async function GET({ url }) {
	const searchString = url.searchParams.get('q') ?? '';

	const tmdbQuery =
		`https://api.themoviedb.org/3/search/movie?api_key=${VITE_TMDB_CLIENT_ID}&query=` +
		encodeURIComponent(searchString);

	const movies: movie[] = await fetch(tmdbQuery)
		.then((res) => res.json())
		.then((res) => res.results);

	const moviesWithReleaseYear = movies.map((movie) => ({
		...movie,
		release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : undefined
	}));

	return json(moviesWithReleaseYear);
}
