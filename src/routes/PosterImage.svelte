<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import {
		largePosterUrlFromPosterPath,
		mediumPosterUrlFromPosterPath,
		smallPosterUrlFromPosterPath
	} from '$lib/utils';

	export let size: 'small' | 'medium' | 'large';
	export let poster_path: string;
	export let title: string;

	let image: HTMLImageElement;

	$: posterUrl =
		size === 'small'
			? smallPosterUrlFromPosterPath(poster_path)
			: size === 'medium'
			? mediumPosterUrlFromPosterPath(poster_path)
			: size === 'large'
			? largePosterUrlFromPosterPath(poster_path)
			: undefined;
</script>

<img
	bind:this={image}
	src={posterUrl}
	alt={title}
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	class:large={size === 'large'}
	on:error={() => {
		image.src = noImage;
	}}
/>

<style>
	.small {
		height: 75px;
		max-width: 50px;
		border-radius: 3px;
	}

	.medium {
		height: 150px;
		border-radius: 5px;
		display: block;
	}

	.large {
		height: 175px;
		border-radius: 10px;
		display: block;
	}

	@media only screen and (min-width: 900px) {
		.large {
			height: 300px;
		}
	}
</style>
