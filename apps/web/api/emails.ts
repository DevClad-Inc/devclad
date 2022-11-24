/* eslint-disable @typescript-eslint/no-var-requires */
import type { VercelRequest, VercelResponse } from '@vercel/node';
// import type { Meeting } from '@/app/stream/types';
/*
 * Function to send email invites to users after they have scheduled a meeting
 * uses sendgrid mailing server
 */

const sgMail = require('@sendgrid/mail');

export default async function handler(req: VercelRequest, res: VercelResponse) {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	switch (req.method) {
		case 'POST': {
			// const { body } = req as { body: Meeting };
			const msg = {
				to: 'arthtyagi7@gmail.com',
				from: 'Arth from DevClad<arth@devclad.com>',
				subject: 'DevClad Test',
				text: 'test, test, test',
				html: '<strong>testing on main branch cause shiz fucked</strong>',
			};
			sgMail
				.send(msg)
				.then(() => {
					res.status(200).json({ message: 'Email sent successfully' });
				})
				.catch((error: unknown) => {
					res.status(400).json({ message: 'Email not sent', error });
				});
			break;
		}
		default:
			res.setHeader('Allow', ['POST']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
			break;
	}
}
