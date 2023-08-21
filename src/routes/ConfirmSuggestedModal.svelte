<script lang="ts">
	import { onMount } from 'svelte';
	import PosterImage from './PosterImage.svelte';
	import type { movie } from './+page.server';
	import { page } from '$app/stores';
	import FancyButton from './FancyButton.svelte';

	export let suggestedMovie: movie;

	let modal: HTMLDialogElement;

	const watched: Promise<boolean> = fetch(`/watched?id=${suggestedMovie.id}`).then((res) =>
		res.json()
	);

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
				Sjekker om jeg har sett {suggestedMovie.title}...
			{:then haveWatched}
				{#if haveWatched}
					<p>Jeg har allerede sett {suggestedMovie.title}.</p>
					<button on:click={() => modal.close()}>Bra for deg</button>
				{:else}
					<p>Jeg har ikke sett {suggestedMovie.title}. Vil du foreslå at jeg ser den?</p>
					<form method="POST" action="?/suggest" class="buttons">
						<input type="hidden" name="id" value={suggestedMovie?.id} />
						<input type="hidden" name="title" value={suggestedMovie?.title} />
						<input type="hidden" name="poster_path" value={suggestedMovie?.poster_path} />
						<FancyButton submitButton --width="45%">Ja!</FancyButton>
						<button on:click|preventDefault={() => modal.close()}>Nei</button>
					</form>
				{/if}
			{/await}
		{/if}
	</div>
</dialog>

<style>
	dialog {
		width: 80%;
		border: none;
		border-radius: 0.3rem;
		background-color: rgb(165, 212, 223);
		color: rgb(8, 14, 33);
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}

	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	@media only screen and (min-width: 900px) {
		dialog {
			width: 50%;
		}

		.content {
			gap: 3rem;
		}
	}

	.buttons {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}

	button {
		min-width: 45%;
		padding: 1rem;
		border-radius: 5px;
		background-color: rgb(240, 248, 249);
		border: none;
		cursor: pointer;
	}

	button:hover {
		background-color: rgb(195, 227, 233);
	}
</style>
