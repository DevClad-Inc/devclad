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
					res.status(404).json({ error: 'Not Found' });
				}
			} else {
				res.status(400).json({ error: 'Bad Request' });
			}
			break;
		case 'PUT':
			if (body) {
				const { key, value } = body as { key: string; value: string };
				res.setHeader('Set-Cookie', `${key}=${value}; Path=/; HttpOnly`);
				res.status(200).json({ value });
			} else {
				res.status(400).json({ error: 'Bad Request' });
			}
			break;
		default:
			res.status(405).json({ error: 'Method Not Allowed' });
	}
}
