import * as v from 'valibot';

export const MovieSchema = v.object({
	poster_path: v.nullable(v.string()),
	title: v.string(),
	id: v.number(),
	release_date: v.optional(v.string()),
	release_year: v.optional(v.number())
});

export const SuggestedMovieSchema = v.object({
	poster_path: v.nullable(v.string()),
	title: v.string(),
	id: v.number(),
	release_date: v.optional(v.string()),
	release_year: v.optional(v.number()),
	votes: v.number()
});

export const StatsSchema = v.object({
	movies: v.object({
		plays: v.number()
	})
});

export const HistorySchema = v.object({
	movie: v.object({
		title: v.string(),
		ids: v.object({
			tmdb: v.number()
		})
	})
});

export const SuggestedMoviesSchema = v.array(SuggestedMovieSchema);
export const HistoryArraySchema = v.array(HistorySchema);
export const SearchResponseSchema = v.object({
	results: v.array(MovieSchema)
});

export type movie = v.InferOutput<typeof MovieSchema>;
export type suggestedMovie = v.InferOutput<typeof SuggestedMovieSchema>;
export type stats = v.InferOutput<typeof StatsSchema>;
export type history = v.InferOutput<typeof HistorySchema>;
export type searchResponse = v.InferOutput<typeof SearchResponseSchema>;
