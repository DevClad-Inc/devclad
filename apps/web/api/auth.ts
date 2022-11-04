/* eslint-disable turbo/no-undeclared-env-vars */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
	const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
	const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
	switch (true) {
		case req.url?.startsWith('/api/auth/login/github/'): {
			const state = crypto.getRandomValues(new Uint8Array(32)).toString();
			const SCOPE = 'user';
			const redirectUrl =
				`https://github.com/login/oauth/authorize` +
				`?client_id=${CLIENT_ID}` +
				`&redirect_uri=${REDIRECT_URI}` +
				`&state=${state}` +
				`&scope=${SCOPE}`;
			res.redirect(redirectUrl).end();
			break;
		}
		case req.url?.startsWith('/api/auth/complete/github'): {
			const { code } = req.query;
			const tokenUrl = 'https://github.com/login/oauth/access_token';
			const tokenResponse = await fetch(tokenUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify({
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					code,
				}),
			}).then((resp) => resp.json());
			res.status(200).json(tokenResponse);
			break;
		}
		default:
			res.status(404).send('Not found');
	}
}
