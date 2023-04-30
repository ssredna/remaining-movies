<script lang="ts">
	// @ts-ignore
	import AutoComplete from 'simple-svelte-autocomplete';
	// import { VITE_TMDB_CLIENT_ID } from '$env/static/private';
	import noImage from '$lib/images/no-image.png';

	interface Movie {
		title: string;
	}

	let selectedMovie: Movie;
	async function searchMovie(queryString: string) {
		const url =
			`https://api.themoviedb.org/3/search/movie?api_key=${VITE_TMDB_CLIENT_ID}&query=` +
			encodeURIComponent(queryString);

		const response = await fetch(url);
		const result = await response.json();
		return result.results;
	}

	function posterUrlFromPosterPath(posterPath: string) {
		return `https://image.tmdb.org/t/p/w92${posterPath}`;
	}
</script>

<AutoComplete
	searchFunction={searchMovie}
	bind:selectedItem={selectedMovie}
	labelFieldName="title"
	maxItemsToShowInList={10}
	delay={500}
	localFiltering={false}
>
	<div slot="item" let:item let:label>
		<object
			data={posterUrlFromPosterPath(item.poster_path)}
			type="image/jpeg"
			class="poster"
			title={item.title}
		>
			<img src={noImage} alt="Name" class="poster" />
		</object>
		{@html label}
	</div>
</AutoComplete>

<style>
	.poster {
		height: 50px;
	}
</style>
