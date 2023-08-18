<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import PosterImage from './PosterImage.svelte';
	import type { movie } from './+page.server';
	import { page } from '$app/stores';

	export let suggestedMovie: movie;

	let modal: HTMLDialogElement;

	const watched: Promise<boolean> = fetch(`/watched?id=${suggestedMovie.id}`).then((res) =>
		res.json()
	);

	const dispatch = createEventDispatcher();

	onMount(() => {
		modal.showModal();
	});

	$: selectedMovieAlreadySuggested = $page.data.suggestedMovies
		? $page.data.suggestedMovies.map((movie: movie) => movie.id).includes(suggestedMovie.id)
		: false;
</script>

<dialog bind:this={modal} on:close>
	<PosterImage {...suggestedMovie} size="large" />
	<div class="content">
		{#if selectedMovieAlreadySuggested}
			<p>Noen andre har allerede foreslått {suggestedMovie.title}.</p>
			<button on:click={() => modal.close()}>Skynd deg å se den da!</button>
		{:else}
			{#await watched}
				Sjekker om jeg har sett denne...
			{:then haveWatched}
				{#if haveWatched}
					<p>Jeg har allerede sett {suggestedMovie.title}.</p>
					<button on:click={() => modal.close()}>Bra for deg</button>
				{:else}
					<p>Vil du foreslå at jeg ser {suggestedMovie.title}?</p>
					<div class="buttons">
						<button
							on:click={() => {
								modal.close('suggested');
								dispatch('suggested');
							}}>Ja!</button
						>
						<button on:click={() => modal.close()}>Nei</button>
					</div>
				{/if}
			{/await}
		{/if}
	</div>
</dialog>

<style>
	dialog {
		width: 60%;
		border: none;
		border-radius: 0.3rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
</style>
