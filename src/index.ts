import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

// AI bindings
interface Bindings {
	OPEN_AI_KEY: string;
	AI: Ai;
}

const app = new Hono<{ Bindings: Bindings }>(); // AI bindings that are passed to the worker

// cors
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

app.post('/translateDocument', async (c) => {});
