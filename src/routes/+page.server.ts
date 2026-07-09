import {
	VITE_SUPABASE_ANON_KEY,
	VITE_SUPABASE_URL,
	VITE_TMDB_CLIENT_ID,
	VITE_TRAKT_CLIENT_ID
} from '$env/static/private';
import { fetchJson, fetchOk } from '$lib/server/fetch';
import {
	HistoryArraySchema,
	MovieSchema,
	StatsSchema,
	SuggestedMoviesSchema,
	type history,
	type movie,
	type suggestedMovie
} from '$lib/server/schemas';
import { fail } from '@sveltejs/kit';

export type { history, movie, suggestedMovie };

const traktHeaders = {
	'Content-Type': 'application/json',
	'User-Agent': 'anesh.no',
	'trakt-api-version': '2',
	'trakt-api-key': VITE_TRAKT_CLIENT_ID
};

export const load = async ({ fetch }) => {
	const [stats, suggestedMovies, watchedHistory, latestHistory] = await Promise.all([
		fetchJson(
			fetch,
			'https://api.trakt.tv/users/ssredna/stats',
			{
				headers: traktHeaders
			},
			'Trakt stats',
			StatsSchema
		),
		fetchJson(
			fetch,
			`${VITE_SUPABASE_URL}/rest/v1/suggested-movies?select=*`,
			{
				headers: {
					apikey: VITE_SUPABASE_ANON_KEY,
					Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`
				}
			},
			'Supabase suggested movies',
			SuggestedMoviesSchema
		),
		fetchJson(
			fetch,
			'https://api.trakt.tv/users/ssredna/watched/movies',
			{
				headers: traktHeaders
			},
			'Trakt watched history',
			HistoryArraySchema
		),
		fetchJson(
			fetch,
			'https://api.trakt.tv/users/ssredna/history/movies?limit=3',
			{
				headers: traktHeaders
			},
			'Trakt latest history',
			HistoryArraySchema
		)
	]);

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

	const latestMovies = latestMoviesTMDBData.map(({ poster_path }, i) => ({
		title: latestHistory[i].movie.title,
		posterUrl: `https://image.tmdb.org/t/p/w400${poster_path}`
	}));

	const numberOfWatchedMovies = stats.movies.plays;
	const watchedHistoryIds = watchedHistory.map((historyItem) => historyItem.movie.ids.tmdb);

	const unwatchedSuggestedMovies = suggestedMovies.filter(
		(movie) => !watchedHistoryIds.includes(movie.id)
	);
	unwatchedSuggestedMovies.sort((movieA, movieB) => movieB.votes - movieA.votes);

	return {
		numberOfWatchedMovies,
		latestMovies,
		suggestedMovies: unwatchedSuggestedMovies
	};
};

export const actions = {
	suggest: async ({ fetch, request }) => {
		const suggestionFormData = await request.formData();

		const requestObject: movie = {
			id: Number(suggestionFormData.get('id')),
			title: String(suggestionFormData.get('title')),
			poster_path: String(suggestionFormData.get('poster_path'))
		};

		const watchedHistory = await fetchJson(
			fetch,
			'https://api.trakt.tv/users/ssredna/watched/movies',
			{
				headers: traktHeaders
			},
			'Trakt watched history',
			HistoryArraySchema
		);
		const watchedIds = watchedHistory.map((historyItem) => historyItem.movie.ids.tmdb);

		if (watchedIds.includes(requestObject.id)) {
			return fail(409, {
				alreadyWatched: { ...requestObject }
			});
		}

		await fetchOk(
			fetch,
			`${VITE_SUPABASE_URL}/rest/v1/suggested-movies`,
			{
				method: 'POST',
				headers: {
					apikey: VITE_SUPABASE_ANON_KEY,
					Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
					'Content-Type': 'application/json',
					Prefer: 'return=minimal'
				},
				body: JSON.stringify(requestObject)
			},
			'Supabase suggest movie'
		);

		return { successfullySuggestedMovieId: requestObject.id };
	},
	vote: async ({ fetch, request }) => {
		const voteFormData = await request.formData();

		await fetchOk(
			fetch,
			`${VITE_SUPABASE_URL}/rest/v1/rpc/vote`,
			{
				method: 'POST',
				headers: {
					apikey: VITE_SUPABASE_ANON_KEY,
					Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ tmdb_id: voteFormData.get('id') })
			},
			'Supabase vote'
		);
	}
};
