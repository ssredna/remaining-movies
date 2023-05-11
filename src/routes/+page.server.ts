import {
	VITE_SUPABASE_ANON_KEY,
	VITE_SUPABASE_URL,
	VITE_TMDB_CLIENT_ID,
	VITE_TRAKT_CLIENT_ID
} from '$env/static/private';
import { fail } from '@sveltejs/kit';

interface history {
	movie: {
		title: string;
		ids: {
			tmdb: number;
		};
	};
}

interface stats {
	movies: {
		plays: number;
	};
}

export interface movie {
	poster_path: string;
	title: string;
	id: number;
}

export interface suggestedMovie extends movie {
	votes: number;
}

export const load = async ({ fetch }) => {
	const statsPromise: Promise<stats> = fetch('https://api.trakt.tv/users/ssredna/stats', {
		headers: {
			'Content-Type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': VITE_TRAKT_CLIENT_ID
		}
	}).then((res) => res.json());

	const suggestedMoviesPromise: Promise<suggestedMovie[]> = fetch(
		`${VITE_SUPABASE_URL}/rest/v1/suggested-movies?select=*`,
		{
			headers: {
				apikey: VITE_SUPABASE_ANON_KEY,
				Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`
			}
		}
	).then((res) => res.json());

	const history: history[] = await fetch(
		'https://api.trakt.tv/users/ssredna/history/movies?limit=3',
		{
			headers: {
				'Content-Type': 'application/json',
				'trakt-api-version': '2',
				'trakt-api-key': VITE_TRAKT_CLIENT_ID
			}
		}
	).then((res) => res.json());

	const latestMoviesTMDBData: movie[] = await Promise.all(
		history.map(({ movie: { ids } }) =>
			fetch(`https://api.themoviedb.org/3/movie/${ids.tmdb}?api_key=${VITE_TMDB_CLIENT_ID}`).then(
				(res) => res.json()
			)
		)
	);

	const latestMovies = latestMoviesTMDBData.map(({ poster_path }, i) => ({
		title: history[i].movie.title,
		posterUrl: `https://image.tmdb.org/t/p/w400${poster_path}`
	}));

	const stats = await statsPromise;
	const remainingMovies = 1000 - stats.movies.plays;

	const suggestedMovies = await suggestedMoviesPromise;
	suggestedMovies.sort((movieA, movieB) => movieB.votes - movieA.votes);

	return {
		remainingMovies,
		latestMovies,
		suggestedMovies
	};
};

export const actions = {
	search: async ({ fetch, request }) => {
		const queryFormData = await request.formData();
		const queryString = queryFormData.get('q') as string;
		const url =
			`https://api.themoviedb.org/3/search/movie?api_key=${VITE_TMDB_CLIENT_ID}&query=` +
			encodeURIComponent(queryString);

		const movies: movie[] = await fetch(url)
			.then((res) => res.json())
			.then((res) => res.results);

		return {
			searchResults: movies,
			queryString
		};
	},
	suggest: async ({ fetch, request }) => {
		const suggestionFormData = await request.formData();

		const requestObject: movie = {
			id: Number(suggestionFormData.get('id')),
			title: String(suggestionFormData.get('title')),
			poster_path: String(suggestionFormData.get('poster_path'))
		};

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

		if (watchedIds.includes(requestObject.id)) {
			return fail(409, {
				alreadyWatched: { ...requestObject }
			});
		}

		await fetch(`${VITE_SUPABASE_URL}/rest/v1/suggested-movies`, {
			method: 'POST',
			headers: {
				apikey: VITE_SUPABASE_ANON_KEY,
				Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
				'Content-Type': 'application/json',
				Prefer: 'return=minimal'
			},
			body: JSON.stringify(requestObject)
		});

		return { requestObject };
	},
	vote: async ({ fetch, request }) => {
		const voteFormData = await request.formData();

		await fetch(`${VITE_SUPABASE_URL}/rest/v1/rpc/vote`, {
			method: 'POST',
			headers: {
				apikey: VITE_SUPABASE_ANON_KEY,
				Authorization: `Bearer ${VITE_SUPABASE_ANON_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ tmdb_id: voteFormData.get('id') })
		});
	}
};
