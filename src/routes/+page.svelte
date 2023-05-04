<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import tmdbLogo from '$lib/images/tmdb-logo.svg';
	import traktLogo from '$lib/images/trakt-logo.svg';
	import { smallPosterUrlFromPosterPath } from '$lib/utils';
	import Suggest from './Suggest.svelte';

	export let data;
	export let form;

	$: suggestedMovieIds = data.suggestedMovies.map((movie) => movie.id);
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
				<div class="history-item">
					<p>{movie.title}</p>
					<img src={movie.posterUrl} alt={movie.title} class="poster" />
				</div>
			{/each}
		</div>
	</section>

	<section class="suggestions">
		<Suggest
			searchResults={form?.searchResults}
			queriedString={form?.queryString}
			{suggestedMovieIds}
		/>
		<div class="suggested-movies">
			<h2>Foreslåtte filmer:</h2>
			<div class="suggestion-items">
				{#each data.suggestedMovies as suggestedMovie}
					<div class="suggestion-item">
						<div>
							<object
								data={smallPosterUrlFromPosterPath(suggestedMovie.poster_path)}
								type="image/jpeg"
								class="suggestion-poster"
								title={suggestedMovie.title}
							>
								<img src={noImage} alt="Name" class="suggestion-poster" />
							</object>
						</div>
						<div class="suggestion-item-text">
							{@html suggestedMovie.title}
						</div>
					</div>
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

	h1 {
		color: rgb(150, 54, 70);
		font-size: 20rem;
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
		padding-top: 14vh;
		padding-bottom: 22vh;
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
		max-height: 33rem;
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
			padding-top: 3rem;
			padding-bottom: 0rem;
		}

		.hero > p {
			margin-top: -3rem;
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

		h1 {
			font-size: 25rem;
		}

		.latest-movies-container {
			display: flex;
			gap: 2rem;
			padding: 0 2rem;
		}

		.suggested-movies {
			margin-top: 2rem;
		}

		.poster {
			height: 350px;
		}
	}

	.suggestion-item {
		background-color: rgb(246, 234, 121);
		box-sizing: border-box;
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.3rem;
		border: 0;
		width: 100%;
	}

	.suggestion-poster {
		height: 75px;
		border-radius: 3px;
	}

	.suggestion-item-text {
		color: rgb(150, 54, 70);
		font-size: 1.2rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
		--color-one: rgb(150, 54, 70);
		--color-two: rgb(255, 132, 31);
		background: linear-gradient(90deg, var(--color-one), var(--color-two), var(--color-one)) 0 0 /
			var(--bg-size) 100%;
		color: transparent;
		-webkit-background-clip: text;
		background-clip: text;
		animation: move-bg 8s infinite linear;
	}

	:global(body) {
		background-color: rgb(255, 188, 133);
		margin: 0;
	}
</style>
