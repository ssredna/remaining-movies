<script lang="ts">
	export let data;
</script>

<section class="hero">
	<h1>{data.remainingMovies}</h1>
	<p>filmer igjen til jeg har sett 1000</p>
</section>
<section class="latest-movies-section">
	<h2>De siste filmene jeg har sett:</h2>
	<div class="latest-movies-container">
		{#each data.movies as movie}
			<div class="movie">
				<p>{movie.title}</p>
				<img src={movie.posterUrl} alt={movie.title} class="poster" />
			</div>
		{/each}
	</div>
</section>

<style>
	h1 {
		color: rgb(150, 54, 70);
		font-size: 10rem;
		margin: 1rem 0;
	}

	h2 {
		color: rgb(150, 54, 70);
		font-size: 1.5rem;
		margin: 1rem 0;
	}

	p {
		color: rgb(150, 54, 70);
		font-size: 1.5rem;
		margin: 1rem 0;
	}

	.hero {
		padding: 8rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.latest-movies-section {
		display: grid;
		justify-items: center;
	}

	.latest-movies-container {
		display: flex;
		gap: 2rem;
	}

	.movie {
		background-color: rgb(255, 176, 112);
		padding: 1rem;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.poster {
		height: 350px;
		border-radius: 5px;
	}

	:global(body) {
		background-color: rgb(255, 188, 133);
	}
</style>
