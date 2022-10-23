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
		const response = await axios({
			method: 'PUT',
			url,
			data: {
				key,
				value,
				maxAge,
				secure,
			},
			headers: { 'Content-Type': 'application/json' },
		});
		return response.data.value as TState;
	}
	if (del) {
		const response = await axios({
			method: 'PUT',
			url,
			data: { key, value, maxAge, secure, del },
			headers: { 'Content-Type': 'application/json' },
		});
		return response.data.value as TState;
	}

	try {
		const response = await axios({
			method: 'GET',
			url,
			params: {
				key,
			},
			headers: { 'Content-Type': 'application/json' },
		});
		return response.data.value as TState;
	} catch {
		return null;
	}
}
