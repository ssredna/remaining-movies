import { error } from '@sveltejs/kit';
import * as v from 'valibot';

type ServerFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type Schema<T> = v.BaseSchema<unknown, T, v.BaseIssue<unknown>>;
const UPSTREAM_TIMEOUT_MS = 10_000;

function withTimeout(init: RequestInit | undefined): RequestInit {
	const timeoutSignal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
	const signal = init?.signal ? AbortSignal.any([init.signal, timeoutSignal]) : timeoutSignal;

	return { ...init, signal };
}

function upstreamError(message: string): never {
	error(502, message);
}

/**
 * Shared upstream request wrapper.
 *
 * External APIs do not throw on HTTP errors, so every Trakt/TMDB/Supabase call
 * should pass through here before reading the response body. This keeps server
 * logs specific while exposing only generic 502 errors to users.
 */
async function fetchResponse(
	fetchFn: ServerFetch,
	input: RequestInfo | URL,
	init: RequestInit | undefined,
	serviceName: string
) {
	let response: Response;

	try {
		response = await fetchFn(input, withTimeout(init));
	} catch (cause) {
		console.error(`${serviceName} request failed`, cause);
		upstreamError('Upstream service request failed');
	}

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		console.error(`${serviceName} returned ${response.status}`, body);
		upstreamError('Upstream service request failed');
	}

	return response;
}

/**
 * Fetch and parse a JSON response from an upstream service.
 *
 * Use this for endpoints where the response body is part of our app data. Pass a
 * Valibot schema when the shape matters so malformed-but-valid JSON fails before
 * route code tries to read fields from it.
 */
export async function fetchJson<T>(
	fetchFn: ServerFetch,
	input: RequestInfo | URL,
	init: RequestInit | undefined,
	serviceName: string,
	schema?: Schema<T>
): Promise<T> {
	const response = await fetchResponse(fetchFn, input, init, serviceName);
	let data: unknown;

	try {
		data = await response.json();
	} catch (cause) {
		console.error(`${serviceName} returned invalid JSON`, cause);
		upstreamError('Upstream service returned invalid response');
	}

	if (schema) {
		const result = v.safeParse(schema, data);

		if (!result.success) {
			console.error(`${serviceName} returned unexpected response shape`, result.issues);
			upstreamError('Upstream service returned invalid response');
		}

		return result.output;
	}

	if (data === undefined) {
		console.error(`${serviceName} returned no JSON data`);
		upstreamError('Upstream service returned invalid response');
	}

	return data as T;
}

/**
 * Fetch and parse optional JSON from an upstream service.
 *
 * Use this for non-critical data where a failed upstream call should be logged,
 * but should not prevent the rest of the page from rendering.
 */
export async function fetchOptionalJson<T>(
	fetchFn: ServerFetch,
	input: RequestInfo | URL,
	init: RequestInit | undefined,
	serviceName: string,
	schema?: Schema<T>
): Promise<T | null> {
	let response: Response;

	try {
		response = await fetchFn(input, withTimeout(init));
	} catch (cause) {
		console.error(`${serviceName} request failed`, cause);
		return null;
	}

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		console.error(`${serviceName} returned ${response.status}`, body);
		return null;
	}

	let data: unknown;

	try {
		data = await response.json();
	} catch (cause) {
		console.error(`${serviceName} returned invalid JSON`, cause);
		return null;
	}

	if (schema) {
		const result = v.safeParse(schema, data);

		if (!result.success) {
			console.error(`${serviceName} returned unexpected response shape`, result.issues);
			return null;
		}

		return result.output;
	}

	if (data === undefined) {
		console.error(`${serviceName} returned no JSON data`);
		return null;
	}

	return data as T;
}

/**
 * Fetch an upstream service when only success/failure matters.
 *
 * This is for write calls like Supabase inserts/RPCs where we intentionally do
 * not read a response body, but still need non-2xx responses to stop the action.
 */
export async function fetchOk(
	fetchFn: ServerFetch,
	input: RequestInfo | URL,
	init: RequestInit | undefined,
	serviceName: string
) {
	await fetchResponse(fetchFn, input, init, serviceName);
}
