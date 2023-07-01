import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const searchString = url.searchParams.get('q') ?? '';
	return json(searchString.toUpperCase());
};
