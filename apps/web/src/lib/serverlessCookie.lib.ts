import axios from 'axios';
import { checkTokenType } from '@/services/auth.services';

export default async function serverlessCookie<TState>(
	key: string,
	value?: string,
	maxAge?: number,
	del?: boolean
): Promise<TState | null> {
	const url = `/api/cookies`;
	const secure = import.meta.env.VITE_DEVELOPMENT;

	if (checkTokenType(value) && !del) {
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
		}).then((response) => response.data.value as TState);
	}
	if (del) {
		return axios({
			method: 'PUT',
			url,
			data: { key, value, maxAge, secure, del },
			headers: { 'Content-Type': 'application/json' },
		}).then((response) => response.data.value as TState);
	}

	return axios({
		method: 'GET',
		url,
		params: {
			key,
		},
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.data.value as TState)
		.catch(() => null);
}
