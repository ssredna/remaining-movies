import { VITE_TMDB_CLIENT_ID } from '$env/static/private';
import { fetchJson } from '$lib/server/fetch';
import { HistoryArraySchema, MovieSchema, StatsSchema } from '$lib/server/schemas';
import { traktHeaders } from '$lib/server/trakt';
import { getRequestEvent, query } from '$app/server';
import type { movie } from './types';

export const getWatchedStats = query(async () => {
	const { fetch } = getRequestEvent();
	const stats = await fetchJson(
		fetch,
		'https://api.trakt.tv/users/ssredna/stats',
		{
			headers: traktHeaders
		},
		'Trakt stats',
		StatsSchema
	);

	return stats.movies.plays;
});

export const getLatestMovies = query(async () => {
	const { fetch } = getRequestEvent();
	const latestHistory = await fetchJson(
		fetch,
		'https://api.trakt.tv/users/ssredna/history/movies?limit=3',
		{
			headers: traktHeaders
		},
		'Trakt latest history',
		HistoryArraySchema
	);

	const latestMoviesTMDBData: movie[] = await Promise.all(
		latestHistory.map(({ movie: { ids } }) =>
			fetchJson(
				fetch,
				`https://api.themoviedb.org/3/movie/${ids.tmdb}?api_key=${VITE_TMDB_CLIENT_ID}`,
				undefined,
				'TMDB movie',
				MovieSchema
			)
		)
	);

	return latestMoviesTMDBData.map(({ poster_path }, i) => ({
		title: latestHistory[i].movie.title,
		posterUrl: `https://image.tmdb.org/t/p/w400${poster_path}`
	}));
});
