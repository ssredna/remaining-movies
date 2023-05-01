<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import type { movie } from './+page.server';

	export let searchResults: movie[] | undefined;

	function posterUrlFromPosterPath(posterPath: string) {
		return `https://image.tmdb.org/t/p/w92${posterPath}`;
	}
</script>

<form method="POST" action="?/search">
	<label class="h2-label">
		Foreslå film nr 1000 <br />
		<input type="search" name="q" />
	</label>
</form>

{#if searchResults}
	{#each searchResults as movie}
		<div>
			<object
				data={posterUrlFromPosterPath(movie.poster_path)}
				type="image/jpeg"
				class="poster"
				title={movie.title}
			>
				<img src={noImage} alt="Name" class="poster" />
			</object>
			{@html movie.title}
		</div>
	{/each}
{/if}

<style>
	.h2-label {
		color: rgb(150, 54, 70);
		font-size: 1.5rem;
	}

	.poster {
		height: 75px;
	}
</style>
