import { handleRequest } from './app.js';
import { createBindingAiClient, type AiBindingLike } from './ai/client.js';

export interface Env {
	AI: AiBindingLike;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		return handleRequest(request, { ai: createBindingAiClient(env.AI) });
	},
} satisfies ExportedHandler<Env>;
