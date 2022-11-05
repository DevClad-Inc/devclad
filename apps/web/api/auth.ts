/* eslint-disable turbo/no-undeclared-env-vars */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { IncomingHttpHeaders } from 'http';
import fetch from 'isomorphic-fetch';

const getUsername = async (token: string) => {
	const url = 'https://api.github.com/user';
	const response = await fetch(url, {
		headers: {
			Authorization: `token ${token}`,
		},
	});
	const { login } = (await response.json()) as { login: string };
	return login;
};

interface ConnectGithubResponse {
	access: string;
	refresh: string;
}

const connectGithub = async (
	headers: IncomingHttpHeaders,
	token: string,
	username: string,
	apiURL: string,
	operation: 'connect' | 'login'
) => {
	let apiHeaders: Record<string, string> = {};
	if (operation === 'connect') {
		const cookieToken = headers.cookie?.split('; ').find((c) => c.startsWith('token='));
		const tokenValue = cookieToken?.split('=')[1];
		if (tokenValue) {
			apiHeaders = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${tokenValue}`,
			};
		} else {
			return null;
		}
	} else {
		apiHeaders = {
			'Content-Type': 'application/json',
		};
	}
	const apiResp = await fetch(apiURL, {
		method: 'PATCH',
		headers: { ...apiHeaders },
		body: JSON.stringify({
			access_token: token,
			username: username.toLowerCase(),
		}),
	}).then((resp: { json: () => Promise<ConnectGithubResponse> }) => resp.json());
	return apiResp as ConnectGithubResponse;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
	const CLIENT_ID = process.env.VITE_GITHUB_CLIENT_ID;
	const LOGIN_URL = `${process.env.VITE_API_URL}/oauth/github/login/`;
	const CONNECT_URL = `${process.env.VITE_API_URL}/oauth/github/connect/`;
	const { headers } = req;
	switch (true) {
		// callback
		case req.url?.startsWith('/api/auth/complete/github'): {
			const { code } = req.body;
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
			}).then((resp: { json: () => Promise<Record<string, string>> }) => resp.json());
			const { access_token: accessToken } = tokenResponse as { access_token: string };
			const username = await getUsername(accessToken);
			switch (true) {
				case req.url?.startsWith('/api/auth/complete/github/login'): {
					const apiURL = LOGIN_URL;
					const maxAge = 60 * 60 * 24 * 28;
					connectGithub(headers, accessToken, username, apiURL, 'login')
						.then((apiResp) => {
							if (apiResp) {
								const { refresh, access } = apiResp;
								res.setHeader('Set-Cookie', [
									// ! unpreditable behavior when using serverless functions (cause of cookies) in Safari in dev mode
									`token=${access}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict; Secure`,
									`refresh=${refresh}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict; Secure`,
									`loggedIn=true; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure`,
								]);
								res.status(200).json({ success: true });
							}
						})
						.catch((err) => {
							res.status(500).json(err).end();
						});
					break;
				}
				case req.url?.startsWith('/api/auth/complete/github/connect'): {
					const apiURL = CONNECT_URL;
					connectGithub(headers, accessToken, username, apiURL, 'connect')
						.then(() => {
							res.status(200).json({ success: true });
						})
						.catch((err) => {
							res.status(500).json(err);
						});
					break;
				}
				default: {
					break;
				}
			}
			break;
		}
		default:
			res.status(404).send('Not found');
	}
}
