<script lang="ts">
	import noImage from '$lib/images/no-image.png';
	import { mediumPosterUrlFromPosterPath, smallPosterUrlFromPosterPath } from '$lib/utils';

	export let size: 'small' | 'medium';
	export let poster_path: string;
	export let title: string;

	$: posterUrl =
		size === 'small'
			? smallPosterUrlFromPosterPath(poster_path)
			: size === 'medium'
			? mediumPosterUrlFromPosterPath(poster_path)
			: undefined;
</script>

<object
	data={posterUrl}
	type="image/jpeg"
	class:small={size === 'small'}
	class:medium={size === 'medium'}
	{title}
>
	<img src={noImage} alt={title} class:small={size === 'small'} class:medium={size === 'medium'} />
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
</style>
