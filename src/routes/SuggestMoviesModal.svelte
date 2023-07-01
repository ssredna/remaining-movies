<script lang="ts">
	import { onMount } from 'svelte';

	let modal: HTMLDialogElement;

	onMount(() => {
		modal.showModal();
	});
</script>

<dialog bind:this={modal} on:close>hello</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.8);
	}
</style>
