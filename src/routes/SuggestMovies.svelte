<script lang="ts">
	import SuggestButton from './SuggestButton.svelte';
	import SuggestMoviesModal from './SuggestMoviesModal.svelte';

	let showModal = false;
</script>

<SuggestButton value="Foreslå film" on:click={() => (showModal = true)} />

{#if showModal}
	<SuggestMoviesModal on:close={() => (showModal = false)} />
{/if}
