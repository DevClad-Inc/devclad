import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'isomorphic-fetch';
import { convertTimeZone } from '@devclad/lib';
import type { MeetingEmail } from '@/app/stream/types';
/*
 * Function to send email invites to users after they have scheduled a meeting
 * uses sendgrid mailing server
 */

const verifyToken = async (token: string): Promise<boolean> => {
	const apiURL = process.env.VITE_API_URL;
	const apiHeaders = {
		'Content-Type': 'application/json',
	};
	const body = JSON.stringify({
		token,
	});
	const resp = await fetch(`${apiURL}/auth/token/verify/`, {
		method: 'POST',
		headers: { ...apiHeaders },
		body,
	});
	if (resp.status === 200) {
		return true;
	}
	return false;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sgMail = require('@sendgrid/mail');
// this is documented somewhere in the github discussion of vercel;
// when using vite with vercel serverless, use the require syntax

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { headers } = req;
	const cookieToken = headers.cookie?.split('; ').find((c) => c.startsWith('token='));
	const tokenValue = cookieToken?.split('=')[1];

	const devMode = process.env.NODE_ENV === 'development';

	if (!devMode && (!tokenValue || !verifyToken(tokenValue))) {
		res.status(401).json({ error: 'Unauthorized' }).end();
	}

	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	switch (req.method) {
		case 'POST': {
			const { body } = req;
			const { email: Email } = body;
			const { typeOf, time, uid, email, firstName, inviteName, timeZone } =
				Email as MeetingEmail;
			const message = {
				to: devMode ? 'arth@letterbolt.app' : email,
				from: 'Arth from DevClad<arth@devclad.com>',
				template_id: process.env.SENDGRID_SCHEDULE_TID,
				dynamic_template_data: {
					typeOf,
					firstName,
					inviteName,
					time: convertTimeZone(time, timeZone),
					link: `${process.env.VITE_CLIENT_URL}/meetings/${uid}`,
				},
			};
			sgMail
				.send(message)
				.then(() => {
					res.status(200).json({
						message: 'Email sent successfully',
					});
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

/* a sample request body

{
    "typeOf": "1:1 Match",
    "time": "2022-11-24T03:45:00Z",
    "uid": "56fb3f59-584a-4ad0-b2e4-58ba8736a9fb",
    "email": "arth@letterbolt.app",
    "firstName": "Arth",
    "inviteName": "Pat",
    "timeZone": "Asia/Kolkata"
}

*/
