/* eslint-disable turbo/no-undeclared-env-vars */
import Airtable from 'airtable';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	Airtable.configure({
		endpointUrl: 'https://api.airtable.com',
		apiKey: process.env.AIRTABLE_API_KEY,
	});

	const base = Airtable.base(process.env.AIRTABLE_BASE as string);

	const { email } = (await request.body) as { email: string };

	switch (request.method) {
		case 'POST':
			try {
				base('Table 1').create([
					{
						fields: { Email: email },
					},
				]);
			} catch (error) {
				response.status(500).json({ error });
			}
			response.status(200).end();
			break;
		default:
			response.status(405).json({ error: 'Method not allowed' });
	}
}
