
/**
 * Netlify Function: Chat Message Handler
 * 
 * This serverless function handles chat interactions between users and the AI model.
 * It processes incoming messages, sends them to OpenRouter's API, and returns the AI's response.
 * 
 * Environment Variables Required:
 * - auth_ai: OpenRouter API key
 * - OPENROUTER_API_URL: OpenRouter API endpoint
 * - model: AI model to use (e.g., "mistralai/mistral-nemo")
 */

import type { Handler } from '@netlify/functions';


/**
 * Main handler function for processing chat messages
 * @param {Object} event - The incoming HTTP event from Netlify
 * @returns {Promise<Object>} Response object with status code and message
 */
export const handler: Handler = async (event) => {

	//hanfle wrong kind of request ( not POST)
	if (event.httpMethod !== 'POST') {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: 'Method Not Allowed' }),
		};
	}


	try {
		const { text } = JSON.parse(event.body || '{}');
		if (!text) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: 'No message provided' }),
			};
		}

		const apiKey = process.env['auth_ai'];
		const apiURL = process.env['OPENROUTER_API_URL'];
		const model = process.env['model'];

		if (!apiKey) {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: 'Missing OpenRouter API key' }),
			};
		}

		const response = await fetch(apiURL || '', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: model,
				messages: [
					{ role: 'system', content: 'You are Sensei Bryan, a helpful educational AI assistant.' },
					{ role: 'user', content: text },
				],
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			return {
				statusCode: response.status,
				body: JSON.stringify({ error: errorText }),
			};
		}

		const data = await response.json();
		const result = data.choices?.[0]?.message?.content || 'No response from AI.';

		return {
			statusCode: 200,
			body: JSON.stringify({ result }),
		};
	} catch (error: any) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message || 'Unknown error' }),
		};
	}
};
