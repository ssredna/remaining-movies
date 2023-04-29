<script lang="ts">
	import tmdbLogo from '$lib/images/tmdb-logo.svg';
	import traktLogo from '$lib/images/trakt-logo.svg';
	export let data;
</script>

<section class="hero">
	<h1 class="linear-wipe">{data.remainingMovies}</h1>
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
<footer>
	<img class="logo" src={traktLogo} alt="Trakt logo" />
	<img class="logo" src={tmdbLogo} alt="The Movie DB logo" />
</footer>

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
		text-align: center;
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
		display: grid;
		gap: 2rem;
	}

	.poster {
		height: 300px;
		border-radius: 5px;
	}

	@media only screen and (min-width: 900px) {
		h1 {
			font-size: 20rem;
		}
		.latest-movies-container {
			display: flex;
			gap: 2rem;
			padding: 0 1rem;
		}

		.poster {
			height: 350px;
		}
	}

	.movie {
		background-color: rgb(255, 176, 112);
		padding: 1rem;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	footer {
		padding: 4rem 2rem 2rem 0;
		display: flex;
		justify-content: flex-end;
		gap: 2rem;
	}

	.logo {
		width: 3rem;
	}

	@keyframes move-bg {
		to {
			background-position: var(--bg-size) 0;
		}
	}

	.linear-wipe {
		--bg-size: 400%;
		--color-one: hsl(350, 47%, 40%);
		--color-two: hsl(27, 100%, 56%);
		background: linear-gradient(90deg, var(--color-one), var(--color-two), var(--color-one)) 0 0 /
			var(--bg-size) 100%;
		color: transparent;
		-webkit-background-clip: text;
		background-clip: text;
		animation: move-bg 8s infinite linear;
	}

	:global(body) {
		background-color: rgb(255, 188, 133);
	}
</style>
