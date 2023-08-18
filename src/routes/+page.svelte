<script lang="ts">
	import { browser } from '$app/environment';
	import tmdbLogo from '$lib/images/tmdb-logo.svg';
	import traktLogo from '$lib/images/trakt-logo.svg';
	import AnimatedHeader from './AnimatedHeader.svelte';
	import SuggestMovies from './SuggestMovies.svelte';
	import SuggestedMovie from './SuggestedMovie.svelte';

	export let data;
	export let form;

	if (form?.successfullySuggestedMovieId && browser) {
		localStorage.setItem(String(form.successfullySuggestedMovieId), '1');
	}
</script>

<svelte:head>
	<title>Hvor mange filmer har jeg sett?</title>
</svelte:head>

<div class="container">
	<section class="hero">
		<p>jeg har sett</p>
		<AnimatedHeader>{data.numberOfWatchedMovies}</AnimatedHeader>
		<p>filmer</p>
	</section>

	<section class="history">
		<h2>De siste filmene jeg har sett:</h2>
		<div class="latest-movies-container">
			{#each data.latestMovies as movie}
				<div class="history-item">
					<p>{movie.title}</p>
					<img src={movie.posterUrl} alt={movie.title} class="poster" />
				</div>
			{/each}
		</div>
	</section>

	<section class="suggestions">
		<SuggestMovies />
		<div class="suggested-movies">
			<h2>Foreslåtte filmer:</h2>
			<div class="suggestion-items">
				{#each data.suggestedMovies as suggestedMovie}
					<SuggestedMovie movie={suggestedMovie} />
				{/each}
			</div>
		</div>
	</section>

	<footer>
		<img class="logo" src={traktLogo} alt="Trakt logo" />
		<img class="logo" src={tmdbLogo} alt="The Movie DB logo" />
	</footer>
</div>

<style>
	.container {
		display: grid;
		grid-template-areas:
			'hero'
			'suggestions'
			'history'
			'footer';
		justify-items: center;
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
		padding-top: 22vh;
		padding-bottom: 28vh;
	}

	.history {
		grid-area: history;
		width: 90%;
		display: grid;
		justify-items: center;
		margin-top: 3rem;
	}

	.latest-movies-container {
		display: grid;
		gap: 2rem;
	}

	.history-item {
		background-color: rgb(255, 176, 112);
		border-radius: 10px;
		padding: 1rem;
		width: 80%;
		justify-self: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.poster {
		height: 300px;
		border-radius: 5px;
	}

	.suggestions {
		grid-area: suggestions;
		width: 85%;
		box-sizing: border-box;
	}

	.suggested-movies {
		margin-top: 4rem;
	}

	.suggestion-items {
		background-color: rgb(245, 230, 99);
		border-radius: 8px;
		padding: 0.2rem;
		max-height: 26rem;
		overflow-y: auto;
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

		.hero {
			padding-top: 6rem;
			padding-bottom: 5rem;
		}

		.history {
			width: 100%;
			margin-top: 0;
		}

		.history-item {
			width: auto;
		}

		.suggestions {
			padding-top: 7rem;
			width: 85%;
		}

		.latest-movies-container {
			display: flex;
			gap: 2rem;
			padding: 0 2rem;
		}

		.suggested-movies {
			margin-top: 2rem;
		}

		.suggestion-items {
			max-height: 33rem;
		}

		.poster {
			height: 350px;
		}
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

	:global(body) {
		background-color: rgb(255, 188, 133);
		margin: 0;
	}
</style>
