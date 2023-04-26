export const load = async ({ fetch }) => {
	const res = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
	const pokemon = await res.json();

	return {
		pokemon
	};
};
