import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Bindings {
	OPEN_AI_KEY: string;
	AI: Ai;
}

const app = new Hono<{ Bindings: Bindings }>(); // AI bindings that are passed to the worker

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

app.use(
	'/*',
	cors({
		origin: '*', // Allow requests from next js app
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'], // Allow Content-Type to the allowed headers to fix CORS issue
		allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT'], // Allow POST method
		exposeHeaders: ['X-Custom-Header', 'X-Kuma-Revision'], // Expose custom headers
		maxAge: 600, // Cache preflight request for 10 minutes
		credentials: true, // Allow credentials
	})
);

app.post('/translateDocument', async (c) => {
	const { documentData, targetLanguage } = await c.req.json();
	//Generate a summary of the document
	const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
		input_text: documentData,
		max_length: 1000,
	});

	//Translate the summary to the target language
	const response = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summaryResponse.summary,
		source_lang: 'english',
		target_lang: targetLanguage,
	});

	return new Response(JSON.stringify(response));
});

export default app;
