<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import PosterImage from './PosterImage.svelte';
	import ConfirmSuggestedModal from './ConfirmSuggestedModal.svelte';
	import { searchMovies } from './search.remote';
	import type { movie, suggestedMovie as suggestedMovieType } from './types';

	interface Props {
		suggestedMovies: suggestedMovieType[];
		watchedMovieIds: number[];
		onclose?: HTMLDialogAttributes['onclose'];
	}

	let { suggestedMovies, watchedMovieIds, onclose }: Props = $props();

	let modal = $state() as HTMLDialogElement;

	let debounceTimer: number;
	let searched = $state(false);
	let searchString = $state('');
	let searchQuery = $derived(searchString ? searchMovies(searchString) : null);

	let showConfirmModal = $state(false);
	let suggestedMovie = $state<movie | null>(null);

	function showDialog(dialog: HTMLDialogElement) {
		modal = dialog;
		dialog.showModal();
	}

	function search(value: string) {
		clearTimeout(debounceTimer);
		const query = value.trim();
		searched = false;
		searchString = '';

		if (!query) {
			return;
		}

		debounceTimer = setTimeout(() => {
			searchString = query;
			searched = true;
		}, 250);
	}
</script>

<dialog {@attach showDialog} {onclose}>
	<button class="back-button" aria-label="Go back" onclick={() => modal.close()}></button>

	<form onsubmit={(event) => event.preventDefault()}>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			name="movie-search"
			aria-label="Søk opp film du vil foreslå"
			placeholder="Søk etter film"
			autocomplete="off"
			maxlength="100"
			autofocus
			oninput={(event) => search(event.currentTarget.value)}
		/>
	</form>

	{#if searchQuery?.error}
		<div class="no-result">Søket kunne ikke lastes akkurat nå.</div>
	{:else if searchQuery?.loading}
		<div class="no-result">Søker...</div>
	{:else if searched && searchQuery?.current?.length === 0}
		<div class="no-result">Ingen søkeresultat</div>
	{:else if searchQuery?.current?.length}
		<div class="search-results">
			{#each searchQuery.current as movie (movie.id)}
				<button
					class="result-item"
					onclick={() => {
						suggestedMovie = movie;
						showConfirmModal = true;
					}}
				>
					<PosterImage poster_path={movie.poster_path} title={movie.title} size="small" />
					<div class="result-item-text">
						<span class="result-item-title">
							{movie.title}
						</span>
						{#if movie.release_year}
							{movie.release_year}
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{/if}
</dialog>

{#if showConfirmModal && suggestedMovie}
	<ConfirmSuggestedModal
		{suggestedMovie}
		{suggestedMovies}
		{watchedMovieIds}
		onclose={() => (showConfirmModal = false)}
	/>
{/if}

<style>
	dialog {
		margin-top: 1rem;
		max-height: 90dvh;
		width: calc(100vw - 4rem);
		border: none;
		border-radius: 0.3rem;
		filter: drop-shadow(3px 5px 10px rgba(0, 0, 0, 0.5));
		background-color: rgb(165, 212, 223);
		color: rgb(8, 14, 33);
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.8);
	}

	form {
		display: flex;
		justify-content: center;
	}

	input[type='text'] {
		padding: 0.8rem 1.2rem;
		border: 2px solid rgb(135, 199, 212);
		margin: 1px;
		border-radius: 4px;
		font-size: 1rem;
		width: 100%;
	}

	input[type='text']:focus {
		outline: 1px solid rgb(71, 168, 189);
	}

	.search-results {
		display: grid;
		margin-top: 0.8rem;
		gap: 0.2rem;
		padding: 2px;
		max-height: 70dvh;
		overflow-y: auto;
	}

	@media only screen and (min-width: 900px) {
		dialog {
			margin-top: 4rem;
			max-height: 80%;
			width: calc(100vw - 10rem);
			max-width: 56rem;
		}

		.search-results {
			max-height: 70vh;
		}
	}

	.result-item {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		cursor: pointer;
		border: none;
		background-color: transparent;
		padding: 0.3rem;
		border-radius: 5px;
		text-align: start;
	}

	.result-item:hover {
		background-color: rgb(150, 205, 217);
	}

	.result-item-text {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.result-item-title {
		font-size: medium;
	}

	.back-button {
		margin-top: -0.5rem;
		margin-left: -0.5rem;
		border: none;
		border-radius: 5px;
		background: url(../lib/images/back-icon.svg) no-repeat 50% 50%;
		background-size: 1.2rem 1.2rem;
		height: 1.8rem;
		aspect-ratio: 1;
		cursor: pointer;
	}

	.back-button:hover {
		background-color: rgb(195, 227, 233);
	}
</style>
