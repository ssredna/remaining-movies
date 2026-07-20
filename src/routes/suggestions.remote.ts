import {
	VITE_SUPABASE_ANON_KEY,
	VITE_SUPABASE_URL,
	VITE_TMDB_CLIENT_ID
} from '$env/static/private';
import { fetchJson, fetchOk } from '$lib/server/fetch';
import { MovieSchema, SuggestedMoviesSchema } from '$lib/server/schemas';
import { fetchWatchedMovieIds } from '$lib/server/trakt';
import { invalid } from '@sveltejs/kit';
import { form, getRequestEvent, query } from '$app/server';
import * as v from 'valibot';

const IdSchema = v.pipe(v.string(), v.transform(Number), v.integer(), v.minValue(1));

const VoteSchema = v.object({
	id: IdSchema
});

const SuggestionSchema = v.object({
	id: IdSchema
});

export const getSuggestions = query(async () => {
	const { fetch } = getRequestEvent();
	const [suggestedMovies, watchedMovieIds] = await Promise.all([
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
		fetchWatchedMovieIds(fetch)
	]);

	const unwatchedSuggestedMovies = suggestedMovies.filter(
		(movie) => !watchedMovieIds.includes(movie.id)
	);

	return {
		suggestedMovies: unwatchedSuggestedMovies.sort((movieA, movieB) => movieB.votes - movieA.votes),
		watchedMovieIds
	};
});

export const voteForMovie = form(VoteSchema, async ({ id }) => {
	const { fetch } = getRequestEvent();

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
			body: JSON.stringify({ tmdb_id: id })
		},
		'Supabase vote'
	);

	void getSuggestions().refresh();
});

export const suggestMovie = form(SuggestionSchema, async ({ id }, issue) => {
	const { fetch } = getRequestEvent();
	const watchedMovieIds = await fetchWatchedMovieIds(fetch);

	if (watchedMovieIds.includes(id)) {
		invalid(issue.id('Jeg har allerede sett denne filmen.'));
	}

	const movie = await fetchJson(
		fetch,
		`https://api.themoviedb.org/3/movie/${id}?api_key=${VITE_TMDB_CLIENT_ID}`,
		undefined,
		'TMDB movie',
		MovieSchema
	);
	const suggestion = {
		id: movie.id,
		title: movie.title,
		poster_path: movie.poster_path
	};

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
			body: JSON.stringify(suggestion)
		},
		'Supabase suggest movie'
	);

	void getSuggestions().refresh();

	return { successfullySuggestedMovieId: id };
});
