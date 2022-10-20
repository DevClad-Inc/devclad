import axios from 'axios';

export default async function serverlessCookie<TState>(
	key: string,
	value?: string,
	expiry?: number
): Promise<TState> {
	const url = `/api/cookies`;
	const secure = import.meta.env.PROD;
	if (value) {
		return axios({
			method: 'PUT',
			url,
			data: {
				key,
				value,
				expiry,
				secure,
			},
			headers: { 'Content-Type': 'application/json' },
		}).then((response) => response.data);
	}
	return axios({
		method: 'GET',
		url,
		params: {
			key,
		},
		headers: { 'Content-Type': 'application/json' },
	}).then((response) => response.data);
}
