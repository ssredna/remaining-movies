<script lang="ts">
	export let data;
</script>

<div class="container">
	<h1 class="number">{data.remainingMovies}</h1>
	<p class="text">filmer igjen til jeg har sett 1000</p>
</div>

<style>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.number {
		color: rgb(150, 54, 70);
		font-size: 8rem;
	}

	.text {
		color: rgb(150, 54, 70);
		font-size: 1.5rem;
	}

	:global(html, body) {
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	:global(body) {
		background-color: rgb(255, 188, 133);
	}
</style>
