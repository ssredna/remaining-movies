<script lang="ts">
	import type { movie } from './+page.server';
	import PosterImage from './PosterImage.svelte';
	import SuggestButton from './SuggestButton.svelte';

	export let searchResults: movie[] | undefined;
	export let queriedString: string | undefined;
	export let suggestedMovieIds: number[];
	export let alreadyWatched: movie | undefined;

	let isFocused = true;
	let selectedMovie: movie | undefined;
	let tap: boolean = false;

	$: isSelectedMovieSuggested = selectedMovie
		? suggestedMovieIds.includes(selectedMovie.id)
		: false;

	function handleSelectMovie(movie: movie) {
		selectedMovie = movie;
		isFocused = false;
	}

	function handleDropdownFocusLoss({ relatedTarget }: FocusEvent) {
		if (relatedTarget instanceof HTMLElement && relatedTarget.classList.contains('result-item'))
			return;

		isFocused = false;
	}
</script>

<div class="container">
	<form method="POST" action="?/search" role="search">
		<h2>Foreslå film nr 1000:</h2>
		<input
			type="search"
			name="q"
			aria-label="Søk opp film du vil foreslå"
			placeholder="Søk etter film"
			value={queriedString ?? ''}
			required
			autofocus={!!searchResults}
			autocomplete="off"
			on:focusout={handleDropdownFocusLoss}
			on:focusin={() => (isFocused = true)}
		/>
	</form>

	{#if searchResults}
		<div class="search-results" class:isFocused>
			{#each searchResults as movie}
				<button
					class="result-item"
					on:click={() => handleSelectMovie(movie)}
					on:touchstart={() => (tap = true)}
					on:touchmove={() => (tap = false)}
					on:touchend={() => {
						if (tap) {
							handleSelectMovie(movie);
						}
						tap = false;
					}}
				>
					<PosterImage {...movie} size="small" />
					<div class="result-item-text">
						{movie.title}
					</div>
				</button>
			{/each}
		</div>
	{/if}

	<div class="suggestion-item">
		{#if selectedMovie}
			<PosterImage {...selectedMovie} size="medium" />
			<div class="suggestion-item-text">
				{selectedMovie.title}
			</div>
		{:else if alreadyWatched}
			<PosterImage {...alreadyWatched} size="medium" />
			<div class="suggestion-item-text">Jeg har allerede sett {alreadyWatched.title}</div>
		{/if}
	</div>

	<form method="POST" action="?/suggest">
		<input type="hidden" name="id" value={selectedMovie?.id} />
		<input type="hidden" name="title" value={selectedMovie?.title} />
		<input type="hidden" name="poster_path" value={selectedMovie?.poster_path} />
		<SuggestButton
			value={isSelectedMovieSuggested ? 'Den er allerede foreslått' : 'Foreslå film'}
			disabled={!selectedMovie || isSelectedMovieSuggested}
		/>
	</form>
</div>

<style>
	.container {
		position: relative;
	}

	h2 {
		color: rgb(150, 54, 70);
		font-size: 1.5rem;
	}

	input {
		width: 100%;
	}

	input[type='search'] {
		padding: 12px 20px;
		border-radius: 8px;
		background: rgb(240, 248, 249);
		border-width: 2px;
		border: 2px solid rgb(135, 199, 212);
		font-size: 1rem;
	}

	input[type='search']:focus {
		outline: 1px solid rgb(71, 168, 189);
	}

	.search-results {
		position: absolute;
		z-index: 1;
		width: 100%;
		max-height: 20rem;
		padding: 2px;
		border-radius: 5px;
		box-sizing: border-box;
		background-color: rgb(165, 212, 223);
		box-shadow: 2px 2px 2px rgb(0, 0, 0, 0.5);
		visibility: hidden;
		overflow-y: auto;
	}

	@media only screen and (min-width: 900px) {
		.search-results {
			max-height: 35rem;
		}
	}

	.search-results.isFocused {
		visibility: visible;
	}

	.result-item {
		background-color: rgb(165, 212, 223);
		z-index: 2;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.3rem;
		border: 0;
		width: 100%;
		cursor: pointer;
		border-radius: 5px;
	}

	.result-item:hover {
		background-color: rgb(150, 205, 217);
	}

	.result-item:focus {
		outline: 2px solid rgb(71, 168, 189);
		border-radius: 4px;
	}

	.suggestion-item {
		background-color: rgb(255, 176, 112);
		height: 150px;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.4rem;
		margin: 0.5rem 0;
		border-radius: 8px;
	}

	.result-item-text {
		color: rgb(75, 27, 35);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.suggestion-item-text {
		color: rgb(150, 54, 70);
		font-size: 1.3rem;
	}
</style>
