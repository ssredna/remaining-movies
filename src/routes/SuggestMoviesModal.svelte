<script lang="ts">
	import { onMount } from 'svelte';
	import PosterImage from './PosterImage.svelte';
	import { searchResults } from '../stores/searchResults';
	import ConfirmSuggestedModal from './ConfirmSuggestedModal.svelte';
	import type { movie } from './+page.server';

	let modal: HTMLDialogElement;

	let debounceTimer: number;
	let searched = false;

	let showConfirmModal = false;
	let suggestedMovie: movie;

	onMount(() => {
		modal.showModal();
	});

	async function search(searchString: string) {
		clearTimeout(debounceTimer);

		if (!searchString) {
			searched = false;
			return;
		}

		debounceTimer = setTimeout(() => {
			fetch(`/search?q=${searchString}`)
				.then((res) => res.json())
				.then((res) => {
					searched = true;
					searchResults.set(res);
				});
		}, 250);
	}
</script>

<dialog bind:this={modal} on:close>
	<button class="back-button" aria-label="Go back" on:click={() => modal.close()} />

	<form>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			type="text"
			name="movie-search"
			aria-label="Søk opp film du vil foreslå"
			placeholder="Søk etter film"
			autocomplete="off"
			autofocus
			on:input={(event) => search(event.currentTarget.value)}
		/>
	</form>

	{#if searched && $searchResults.length === 0}
		<div class="no-result">Ingen søkeresultat</div>
	{:else if $searchResults.length}
		<div class="search-results">
			{#each $searchResults as movie}
				<button
					class="result-item"
					on:click={() => {
						suggestedMovie = movie;
						showConfirmModal = true;
					}}
				>
					<PosterImage {...movie} size="small" />
					<p class="result-item-text">
						{movie.title}
					</p>
				</button>
			{/each}
		</div>
	{/if}
</dialog>

{#if showConfirmModal}
	<ConfirmSuggestedModal {suggestedMovie} on:close={() => (showConfirmModal = false)} />
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
