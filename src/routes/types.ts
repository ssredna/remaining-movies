export interface movie {
	poster_path: string | null;
	title: string;
	id: number;
	release_date?: string;
	release_year?: number;
}

export interface suggestedMovie extends movie {
	votes: number;
}

export interface history {
	movie: {
		title: string;
		ids: {
			tmdb: number;
		};
	};
}
