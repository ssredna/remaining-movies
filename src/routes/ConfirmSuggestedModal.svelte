<script lang="ts">
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import PosterImage from './PosterImage.svelte';
	import { suggestMovie } from './suggestions.remote';
	import type { movie, suggestedMovie as suggestedMovieType } from './types';
	import FancyButton from './FancyButton.svelte';

	interface Props {
		suggestedMovie: movie;
		suggestedMovies: suggestedMovieType[];
		watchedMovieIds: number[];
		onclose?: HTMLDialogAttributes['onclose'];
	}

	let { suggestedMovie, suggestedMovies, watchedMovieIds, onclose }: Props = $props();

	let modal = $state() as HTMLDialogElement;
	let suggestForm = $derived(suggestMovie.for(String(suggestedMovie.id)));

	function showDialog(dialog: HTMLDialogElement) {
		modal = dialog;
		dialog.showModal();
	}

	let selectedMovieAlreadySuggested = $derived(
		suggestedMovies.map((movie) => movie.id).includes(suggestedMovie.id)
	);
	let haveWatched = $derived(watchedMovieIds.includes(suggestedMovie.id));
</script>

<dialog {@attach showDialog} {onclose}>
	<PosterImage poster_path={suggestedMovie.poster_path} title={suggestedMovie.title} size="large" />
	<div class="content">
		{#if selectedMovieAlreadySuggested}
			<p>Noen andre har allerede foreslått {suggestedMovie.title}.</p>
			<button onclick={() => modal.close()}>Skynd deg å se den da!</button>
		{:else if haveWatched}
			<p>Jeg har allerede sett {suggestedMovie.title}.</p>
			<button onclick={() => modal.close()}>Bra for deg</button>
		{:else}
			<p>Jeg har ikke sett {suggestedMovie.title}. Vil du foreslå at jeg ser den?</p>
			<form
				{...suggestForm.enhance(async (form) => {
					if (await form.submit()) {
						localStorage.setItem(String(suggestedMovie.id), '1');
						modal.close();
					}
				})}
				class="buttons"
			>
				<input {...suggestForm.fields.id.as('hidden', String(suggestedMovie.id))} />
				{#each suggestForm.fields.id.issues() as issue (issue.message)}
					<p class="issue">{issue.message}</p>
				{/each}
				<FancyButton submitButton disabled={!!suggestForm.pending} --width="45%">Ja!</FancyButton>
				<button type="button" onclick={() => modal.close()}>Nei</button>
			</form>
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
