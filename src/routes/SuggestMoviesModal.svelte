<script lang="ts">
	import { onMount } from 'svelte';
	import PosterImage from './PosterImage.svelte';
	import { searchResults } from '../stores/searchResults';

	let modal: HTMLDialogElement;

	let debounceTimer: number;

	onMount(() => {
		modal.showModal();
	});

	async function search(searchString: string) {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			fetch(`/search?q=${searchString}`)
				.then((res) => res.json())
				.then((res) => searchResults.set(res));
		}, 500);
	}
</script>

<dialog bind:this={modal} on:close>
	<form>
		<input
			type="text"
			name="movie-search"
			aria-label="Søk opp film du vil foreslå"
			placeholder="Søk etter film"
			on:input={(event) => search(event.currentTarget.value)}
		/>
	</form>

	<div class="search-results">
		{#if $searchResults.length === 0}
			<div class="no-result">Ingen søkeresultat</div>
		{:else}
			{#each $searchResults as movie}
				<button class="result-item">
					<PosterImage {...movie} size="small" />
					<div class="result-item-text">
						{movie.title}
					</div>
				</button>
			{/each}
		{/if}
	</div>
</dialog>

<style>
	dialog {
		margin-top: 4rem;
		width: calc(100vw - 10rem);
		max-width: 56rem;
		border: none;
		border-radius: 0.3rem;
		filter: drop-shadow(3px 5px 10px rgba(0, 0, 0, 0.5));
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
		border-radius: 4px;
		font-size: 1rem;
		width: calc(90%);
	}

	input[type='text']:focus {
		outline: 1px solid rgb(71, 168, 189);
	}
</style>
