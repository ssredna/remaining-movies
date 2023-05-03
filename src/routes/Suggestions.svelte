<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import { mediumPosterUrlFromPosterPath, smallPosterUrlFromPosterPath } from '$lib/utils';
	import type { movie } from './+page.server';

	export let searchResults: movie[] | undefined;

	let isFocused = true;
	let selectedMovie: movie | undefined;

	function handleDropdownFocusLoss({ relatedTarget }: FocusEvent) {
		if (relatedTarget instanceof HTMLElement && relatedTarget.classList.contains('result-item'))
			return;

		isFocused = false;
	}
</script>

<div class="container">
	<form method="POST" action="?/search">
		<h2>Foreslå film nr 1000</h2>
		<input
			type="search"
			name="q"
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
					on:click={() => {
						selectedMovie = movie;
						isFocused = false;
					}}
				>
					<div>
						<object
							data={smallPosterUrlFromPosterPath(movie.poster_path)}
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
				</button>
			{/each}
		</div>
	{/if}

	<div class="suggestion-item">
		{#if selectedMovie}
			<div>
				<object
					data={mediumPosterUrlFromPosterPath(selectedMovie.poster_path)}
					type="image/jpeg"
					class="suggestion-poster"
					title={selectedMovie.title}
				>
					<img src={noImage} alt="Name" class="suggestion-poster" />
				</object>
			</div>
			<div class="suggestion-item-text">
				{@html selectedMovie.title}
			</div>
		{/if}
	</div>

	<form method="POST" action="?/suggest">
		<input type="hidden" name="id" value={selectedMovie?.id} />
		<input type="hidden" name="title" value={selectedMovie?.title} />
		<input type="hidden" name="poster_path" value={selectedMovie?.poster_path} />
		<input type="submit" value="Foreslå film" disabled={!selectedMovie} />
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
		border-radius: 0.5rem;
		background: rgb(225, 241, 244);
		border-width: 2px;
		border: 2px solid rgb(71, 168, 189);
		font-size: 1rem;
	}

	input[type='search']:focus {
		outline: 1px solid rgb(71, 168, 189);
	}

	.search-results {
		position: absolute;
		width: 100%;
		visibility: hidden;
		height: 30rem;
		overflow-y: scroll;
		border-radius: 5px;
		box-shadow: 2px 2px 2px rgb(0, 0, 0, 0.5);
		background-color: rgb(165, 212, 223);
		padding: 2px;
	}

	.search-results.isFocused {
		visibility: visible;
	}

	.result-item {
		background-color: rgb(165, 212, 223);
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
		outline: 2px solid rgb(61, 148, 164);
		border-radius: 4px;
	}

	.suggestion-item {
		background-color: rgb(255, 176, 112);
		height: 150px;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.3rem;
		margin: 0.5rem 0;
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
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.poster {
		height: 75px;
	}

	.suggestion-poster {
		height: 150px;
	}
</style>
