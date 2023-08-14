import { writable } from 'svelte/store';
import type { movie } from '../routes/+page.server';

export const searchResults = writable<movie[]>([]);
