<script lang="ts">
	export let big: boolean;
</script>

<h1 class="linear-wipe" class:big>
	<slot>??</slot>
</h1>

<style>
	h1 {
		color: rgb(150, 54, 70);
		font-size: 20rem;
		margin: 0;
	}
	
	h1, big {
		font-size: 9.5rem;
	}

	@media only screen and (min-width: 900px) {
		h1 {
			font-size: 25rem;
		}
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
</style>
