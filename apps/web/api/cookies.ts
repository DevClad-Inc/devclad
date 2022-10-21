import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

	const { body, headers, query } = req;

	switch (req.method) {
		case 'GET':
			if (query && headers.cookie) {
				const { key } = query as { key: string };
				const value = getCookie(headers.cookie, key);
				if (value) {
					res.status(200).json({ value });
				} else {
					res.status(404).json({ error: 'Cookie not found' });
				}
			} else {
				res.status(404).json({ error: 'Not found' });
			}
			break;
		case 'PUT':
			if (body) {
				const { key, value, maxAge, secure, del } = body as {
					key: string;
					value: string;
					maxAge: number;
					secure: boolean;
					del: boolean;
				};
				switch (del) {
					case true:
						res.setHeader(
							'Set-Cookie',
							`${key}=''; Path=/; HttpOnly; Secure=${secure}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/;`
						);
						res.status(200).end();
						break;
					default:
						res.setHeader(
							'Set-Cookie',
							`${key}=${value}; Path=/; HttpOnly; Max-Age=${maxAge}; Secure=${secure}`
						);
						res.status(200).json({ value });
						break;
				}
			} else {
				res.status(400).json({ error: 'Bad Request' });
			}
			break;
		default:
			res.status(405).json({ error: 'Method Not Allowed' });
	}
}
