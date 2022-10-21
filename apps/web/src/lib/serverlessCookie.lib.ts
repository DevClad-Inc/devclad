import axios from 'axios';

export default async function serverlessCookie<TState>(
	key: string,
	value?: string,
	maxAge?: number
): Promise<TState> {
	const url = `/api/cookies`;
	const secure = import.meta.env.VITE_DEVELOPMENT;
	if (value) {
		return axios({
			method: 'PUT',
			url,
			data: {
				key,
				value,
				maxAge,
				secure,
			},
			headers: { 'Content-Type': 'application/json' },
		}).then((response) => response.data.value);
	}
	return axios({
		method: 'GET',
		url,
		params: {
			key,
		},
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.data.value)
		.catch(() => null);
}
