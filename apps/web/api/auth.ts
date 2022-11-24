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

interface OAuthGithubResponse {
	access: string;
	refresh: string;
}

const OAuthGithub = async (
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
	/*
	 * this is a request to the backend to connect the github account to the user
	 * apiHeader contains { access_token } (auth-guard)
	 */
	const apiResp = await fetch(apiURL, {
		method: 'PATCH',
		headers: { ...apiHeaders },
		body: JSON.stringify({
			access_token: token,
			username: username.toLowerCase(),
		}),
	}).then((resp: { json: () => Promise<OAuthGithubResponse> }) => resp.json());
	return apiResp as OAuthGithubResponse;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
	/* == Initialize == */
	const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
	const CLIENT_ID = process.env.VITE_GITHUB_CLIENT_ID;
	const LOGIN_URL = `${process.env.VITE_API_URL}/oauth/github/login/`; // looks like: https://api.devclad.com/oauth/github/login/
	const CONNECT_URL = `${process.env.VITE_API_URL}/oauth/github/connect/`; // looks like: https://api.devclad.com/oauth/github/connect/
	const { headers } = req; // Extracting token stored as a cookie in incoming headers.
	/* == Initialize == */

	switch (true) {
		/*
		 * After Github redirects to our client, the client will make a request to this endpoint
		 * This endpoint is responsible for exchanging the code for an access token
		 */
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
			/*
			 * username is sent to the server to associate with a user
			 * during login, it is matched with existing OAuth users' usernames
			 */
			const { access_token: accessToken } = tokenResponse as { access_token: string };
			const username = await getUsername(accessToken);
			switch (true) {
				/*
				 * LOGIN
				 * Returns { access, refresh } tokens which we set as cookies
				 */
				case req.url?.startsWith('/api/auth/complete/github/login'): {
					const apiURL = LOGIN_URL;
					const maxAge = 60 * 60 * 24 * 28;
					OAuthGithub(headers, accessToken, username, apiURL, 'login')
						.then((apiResp) => {
							if (apiResp) {
								const { refresh, access } = apiResp;
								res.setHeader('Set-Cookie', [
									// ! this cookie-setting mechanism will not work as intended in Safari in dev mode.
									// As a choice, this function is optimized for chromium/firefox (vercel dev mode)
									// Since it's httpOnly, *expect* the user to not be able to logIn.
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
				/*
				 * CONNECT
				 * Returns a confirmation, that's it.
				 */
				case req.url?.startsWith('/api/auth/complete/github/connect'): {
					const apiURL = CONNECT_URL;
					OAuthGithub(headers, accessToken, username, apiURL, 'connect')
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
