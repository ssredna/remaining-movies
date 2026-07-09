<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import {
		largePosterUrlFromPosterPath,
		mediumPosterUrlFromPosterPath,
		smallPosterUrlFromPosterPath
	} from '$lib/utils';

	interface Props {
		size: 'small' | 'medium' | 'large';
		poster_path: string | null;
		title: string;
	}

	let { size, poster_path, title }: Props = $props();

	let posterUrl = $derived(
		!poster_path
			? noImage
			: size === 'small'
				? smallPosterUrlFromPosterPath(poster_path)
				: size === 'medium'
					? mediumPosterUrlFromPosterPath(poster_path)
					: size === 'large'
						? largePosterUrlFromPosterPath(poster_path)
						: undefined
	);
</script>

<img
	src={posterUrl}
	alt={title}
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	class:large={size === 'large'}
	onerror={(event) => {
		(event.currentTarget as HTMLImageElement).src = noImage;
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
