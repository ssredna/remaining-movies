<script lang="ts">
	import tmdbLogo from '$lib/images/tmdb-logo.svg';
	import traktLogo from '$lib/images/trakt-logo.svg';
	import Suggestions from './Suggestions.svelte';

	export let data;
	export let form;
</script>

<svelte:head>
	<title>Nedtelling til 1000 filmer</title>
</svelte:head>

<div class="container">
	<section class="hero">
		<h1 class="linear-wipe">{data.remainingMovies}</h1>
		<p>filmer igjen til jeg har sett 1000</p>
	</section>

	<section class="history">
		<h2>De siste filmene jeg har sett:</h2>
		<div class="latest-movies-container">
			{#each data.latestMovies as movie}
				<div class="movie">
					<p>{movie.title}</p>
					<img src={movie.posterUrl} alt={movie.title} class="poster" />
				</div>
			{/each}
		</div>
	</section>

	<section class="suggestions">
		<Suggestions searchResults={form?.searchResults} />
		{#each data.suggestedMovies as suggestedMovie}
			{suggestedMovie.title}
		{/each}
	</section>

	<footer>
		<img class="logo" src={traktLogo} alt="Trakt logo" />
		<img class="logo" src={tmdbLogo} alt="The Movie DB logo" />
	</footer>
</div>

<style>
	.container {
		padding-top: 8rem;
		display: grid;
		grid-template-areas:
			'hero'
			'suggestions'
			'history'
			'footer';
		justify-items: center;
	}

	h1 {
		color: rgb(150, 54, 70);
		font-size: 10rem;
		margin: 0;
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
		grid-area: hero;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.history {
		grid-area: history;
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

	.suggestions {
		grid-area: suggestions;
		width: 80%;
		box-sizing: border-box;
	}

	@media only screen and (min-width: 900px) {
		.container {
			display: grid;
			grid-template-areas:
				'hero suggestions'
				'history suggestions'
				'footer footer';
			grid-template-columns: 2fr 1fr;
		}

		h1 {
			font-size: 20rem;
		}

		.latest-movies-container {
			display: flex;
			gap: 2rem;
			padding: 0 2rem;
		}

		.poster {
			height: 350px;
		}

		.suggestions {
			padding-top: 4rem;
			padding-right: 2rem;
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
		grid-area: footer;
		padding: 4rem 2rem 2rem 0;
		display: flex;
		justify-self: flex-end;
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
