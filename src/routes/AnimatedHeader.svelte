<h1 class="linear-wipe">
	<slot>????</slot>
</h1>

<style>
	h1 {
		color: rgb(150, 54, 70);
		font-size: 9rem;
		margin: 0;
		letter-spacing: -0.4rem;
		padding: 0 0.5rem; /* to avoid text clipping with negative letter spacing */
		margin-top: -1.5rem;
		margin-bottom: -2rem;
	}

	@media only screen and (min-width: 900px) {
		h1 {
			font-size: 22rem;
			margin-top: -3rem;
			margin-bottom: -3.8rem;
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
