<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import type { movie } from './+page.server';

	export let searchResults: movie[] | undefined;

	function posterUrlFromPosterPath(posterPath: string) {
		return `https://image.tmdb.org/t/p/w92${posterPath}`;
	}
</script>

<form method="POST" action="?/search">
	<h2>Foreslå film nr 1000</h2>
	<input type="search" name="q" />
</form>

{#if searchResults}
	{#each searchResults as movie}
		<div class="result-item">
			<div>
				<object
					data={posterUrlFromPosterPath(movie.poster_path)}
					type="image/jpeg"
					class="poster"
					title={movie.title}
				>
					<img src={noImage} alt="Name" class="poster" />
				</object>
			</div>
			<div class="result-item-text">
				{@html movie.title}
			</div>
		</div>
	{/each}
{/if}

<style>
	h2 {
		color: rgb(150, 54, 70);
		font-size: 1.5rem;
	}

	input {
		width: 100%;
	}

	.result-item {
		background-color: rgb(165, 212, 223);
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.3rem;
	}

	.result-item-text {
		color: rgb(75, 27, 35);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.poster {
		height: 75px;
	}
</style>
