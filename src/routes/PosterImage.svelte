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

	$: posterUrl =
		size === 'small'
			? smallPosterUrlFromPosterPath(poster_path)
			: size === 'medium'
			? mediumPosterUrlFromPosterPath(poster_path)
			: size === 'large'
			? largePosterUrlFromPosterPath(poster_path)
			: undefined;
</script>

<object
	data={posterUrl}
	type="image/jpeg"
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	class:large={size === 'large'}
	{title}
>
	<img
		src={noImage}
		alt={title}
		class:small={size === 'small'}
		class:medium={size === 'medium'}
		class:large={size === 'large'}
	/>
</object>

<style>
	.small {
		height: 75px;
		border-radius: 3px;
	}

	.medium {
		height: 150px;
		border-radius: 5px;
		display: block;
	}

	.large {
		height: 300px;
		border-radius: 10px;
		display: block;
	}
</style>
