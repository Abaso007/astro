import type { EndpointHandler } from '../../../@types/astro';
import type { SSROptions } from '../../render/dev';
import { createRenderContext } from '../../render/index.js';
import { callEndpoint } from '../index.js';

export async function call(options: SSROptions) {
	const { env, preload, middleware } = options;
	const endpointHandler = preload as unknown as EndpointHandler;

	const ctx = await createRenderContext({
		request: options.request,
		pathname: options.pathname,
		route: options.route,
		env,
		mod: preload,
	});

	return await callEndpoint(endpointHandler, env, ctx, middleware?.onRequest);
}
