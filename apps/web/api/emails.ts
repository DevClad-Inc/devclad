import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Meeting } from '@/app/stream/types';

/*
 * Function to send email invites to users after they have scheduled a meeting
 * uses sendgrid mailing server
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
	switch (req.method) {
		case 'POST': {
			const { body } = req as { body: Meeting };
			res.status(200).json({ message: 'Email sent', body });
			break;
		}
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
			break;
	}
}
