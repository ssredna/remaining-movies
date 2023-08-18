<script lang="ts">
	export let value: string;
	export let disabled = false;
</script>

<input type="submit" {value} {disabled} on:click />

<style>
	input {
		display: block;
		width: var(--width, 100%);
		padding: 1rem 0;
		text-align: center;
		transition: 0.5s;
		color: white;
		font-weight: 700;
		font-size: 1rem;
		border-radius: 5px;
		border: 0px;
		box-shadow: 0px 0px 14px -7px #f09819;
		background-size: 200% auto;
		background-image: linear-gradient(
			45deg,
			rgb(150, 54, 70) 0%,
			rgb(255, 132, 31) 51%,
			rgb(150, 54, 70) 100%
		);
		cursor: pointer;
	}

	input:hover {
		background-position: right center;
	}

	input:active {
		transform: scale(0.95);
	}

	input:disabled {
		background-image: none;
		color: rgb(150, 54, 70);
		font-weight: normal;
		cursor: auto;
	}
</style>
