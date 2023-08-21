<script lang="ts">
	import { browser } from '$app/environment';
	import type { suggestedMovie } from './+page.server';
	import PosterImage from './PosterImage.svelte';

	export let movie: suggestedMovie;

	function handleVoteClick(id: number) {
		if (browser) {
			localStorage.setItem(String(id), '1');
		}
	}

	function haveVotedForMovie(id: number) {
		if (browser && localStorage.getItem(String(id))) {
			return true;
		}
		return false;
	}
</script>

<form method="post" action="?/vote" class="suggestion-item">
	<input type="hidden" name="id" value={movie.id} />
	<PosterImage poster_path={movie.poster_path} title={movie.title} size="small" />
	<div class="suggestion-item-text">
		<span class="suggestion-item-title">{movie.title}</span>
		<br />
		<span class="suggestion-item-votes">
			{movie.votes}
			{movie.votes > 1 ? 'stemmer' : 'stemme'}
		</span>
	</div>
	<button
		aria-label="Stem på film"
		class="vote-button"
		on:click={() => handleVoteClick(movie.id)}
		disabled={haveVotedForMovie(movie.id)}
	/>
</form>

<style>
	.suggestion-item {
		background-color: rgb(246, 234, 121);
		box-sizing: border-box;
		display: grid;
		grid-template-columns: auto 1fr 2rem;
		gap: 0.5rem;
		align-items: center;
		padding: 0.3rem;
		border: 0;
		width: 100%;
	}

	.suggestion-item-text {
		color: rgb(150, 54, 70);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.suggestion-item-title {
		font-size: 1rem;
		margin: 0;
	}

	.suggestion-item-votes {
		font-size: 0.8rem;
		margin: 0;
	}

	.vote-button {
		border: none;
		background: url(../lib/images/vote-Icon.svg) no-repeat 50% 50%;
		background-size: 1.2rem 1.2rem;
		height: 1.8rem;
		aspect-ratio: 1;
		cursor: pointer;
		opacity: 0.85;
		transition: opacity 0.2s;
		background-color: rgb(30, 56, 136);
		border-radius: 4px;
	}

	.vote-button:hover {
		opacity: 1;
	}

	.vote-button:disabled {
		opacity: 0.3;
	}

	@media only screen and (min-width: 900px) {
		.suggestion-item-title {
			font-size: 1.1rem;
			margin: 0;
		}

		.vote-button {
			opacity: 0.7;
		}
	}
</style>
