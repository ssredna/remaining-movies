export function smallPosterUrlFromPosterPath(posterPath: string) {
	return `https://image.tmdb.org/t/p/w92${posterPath}`;
}

export function mediumPosterUrlFromPosterPath(posterPath: string) {
	return `https://image.tmdb.org/t/p/w154${posterPath}`;
}

export function largePosterUrlFromPosterPath(posterPath: string) {
	return `https://image.tmdb.org/t/p/w500${posterPath}`;
}
