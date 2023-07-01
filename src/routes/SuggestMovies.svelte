<script lang="ts">
	import SuggestMoviesModal from './SuggestMoviesModal.svelte';

	let showModal = false;
</script>

<button on:click={() => (showModal = true)}>Foreslå filmer</button>

{#if showModal}
	<SuggestMoviesModal on:close={() => (showModal = false)} />
{/if}

<style>
	button {
		border: 1px solid black;
		padding: 0.5rem;
	}
</style>
