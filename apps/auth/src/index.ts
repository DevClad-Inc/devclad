export default {
	async fetch(request: Request) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
			'Access-Control-Allow-Headers':
				'Content-Type, Authorization, Accept, X-Requested-With, withCredentials',
		};

		function handleOptions(req: Request) {
			console.log(req.headers);
			if (
				req.headers.get('Origin') !== null &&
				req.headers.get('Access-Control-Request-Method') !== null &&
				req.headers.get('Access-Control-Request-Headers') !== null
			) {
				// Handle CORS pre-flight request.
				return new Response(null, {
					headers: corsHeaders,
				});
			}
			// Handle standard OPTIONS request.
			return new Response(null, {
				headers: {
					Allow: 'GET, HEAD, POST, OPTIONS',
				},
			});
		}

		if (request.method === 'OPTIONS') {
			return handleOptions(request);
		}

		const getCookie = (cookieString: string, key: string): string | null => {
			const cookies = cookieString ? cookieString.split('; ') : [];
			if (cookies) {
				const cookie = cookies.find((c) => c.startsWith(`${key}=`));
				if (cookie) {
					return cookie.split('=')[1];
				}
			}
			return null;
		};

		const DOMAIN = 'https://auth.devclad.com';
		const { pathname } = new URL(request.url);

		switch (pathname) {
			case '/setCookie/accessToken/': {
				if (request.method !== 'POST' && request.method !== 'OPTIONS') {
					return new Response(
						JSON.stringify({ message: 'Invalid request method' }, null, 2),
						{
							headers: { 'Content-Type': 'application/json' },
							status: 405,
							statusText: 'Method Not Allowed',
						}
					);
				}
				const { accessToken } = (await request.json()) as { accessToken: string };
				const accessCookie = `accessToken=${accessToken}; Max-Age=3600; Path=/; SameSite=None; HttpOnly`;
				const response = new Response(
					JSON.stringify(
						{
							message: 'Refresh token set',
							fetchURL: `${DOMAIN}/getCookie/?key=accessToken`,
						},
						null,
						2
					)
				);
				response.headers.set('Set-Cookie', accessCookie);
				response.headers.set('Access-Control-Allow-Origin', '*');
				return response;
			}
			case '/setCookie/refreshToken/': {
				if (request.method !== 'POST' && request.method !== 'OPTIONS') {
					return new Response(
						JSON.stringify({ message: 'Invalid request method' }, null, 2),
						{
							headers: { 'Content-Type': 'application/json' },
							status: 405,
							statusText: 'Method Not Allowed',
						}
					);
				}
				const { refreshToken } = (await request.json()) as { refreshToken: string };
				const refreshCookie = `refreshToken=${refreshToken}; Max-Age=86400; Path=/; SameSite=Lax; HttpOnly`;
				return new Response(
					JSON.stringify(
						{
							message: 'Refresh token set',
							fetchURL: `${DOMAIN}/getCookie/?key=refreshToken`,
						},
						null,
						2
					),
					{
						headers: {
							'Set-Cookie': refreshCookie,
							'Content-Type': 'application/json',
						},
					}
				);
			}
			case '/getCookie': {
				if (request.method !== 'GET' && request.method !== 'OPTIONS') {
					return new Response(
						JSON.stringify({ message: 'Invalid request method' }, null, 2),
						{
							headers: { 'Content-Type': 'application/json' },
							status: 405,
							statusText: 'Method Not Allowed',
						}
					);
				}
				const { searchParams } = new URL(request.url);
				const key = searchParams.get('key');
				if (key) {
					const cookieString = request.headers.get('Cookie') as string;
					const value = getCookie(cookieString, key);
					if (value) {
						const payload = {
							key,
							value,
						};
						const response = new Response(JSON.stringify({ payload }, null, 2), {
							headers: { 'Content-Type': 'application/json' },
						});
						response.headers.set('Access-Control-Allow-Origin', '*');
						return response;
					}
					const response = new Response(
						JSON.stringify({ message: 'Cookie not found' }, null, 2),
						{ headers: { 'Content-Type': 'application/json' } }
					);
					response.headers.set('Access-Control-Allow-Origin', '*');
				}
				break;
			}
			default:
				return new Response(JSON.stringify({ message: 'Invalid operation' }, null, 2), {
					headers: { 'Content-Type': 'application/json' },
				});
		}

		return new Response(JSON.stringify({ message: 'Invalid operation' }, null, 2), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};
