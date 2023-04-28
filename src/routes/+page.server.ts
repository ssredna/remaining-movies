import { VITE_TMDB_CLIENT_ID, VITE_TRAKT_CLIENT_ID } from '$env/static/private';

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

interface movie {
	poster_path: string;
}

export const load = async ({ fetch }) => {
	const statsPromise: Promise<stats> = fetch('https://api.trakt.tv/users/ssredna/stats', {
		headers: {
			'Content-Type': 'application/json',
			'trakt-api-version': '2',
			'trakt-api-key': VITE_TRAKT_CLIENT_ID
		}
	}).then((res) => res.json());

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

	const movies = latestMoviesTMDBData.map(({ poster_path }, i) => ({
		title: history[i].movie.title,
		posterUrl: `https://image.tmdb.org/t/p/w400${poster_path}`
	}));

	const stats = await statsPromise;
	const remainingMovies = 1000 - stats.movies.plays;

	return {
		remainingMovies,
		movies
	};
};
