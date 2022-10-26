import axios from 'axios';
import Cookies from 'js-cookie';
import { checkTokenType, DEVELOPMENT } from '@/services/auth.services';

export default async function serverlessCookie<TState>(
	key: string,
	value?: string,
	maxAge?: number,
	del?: boolean
): Promise<TState | null> {
	const url = `/api/cookies`;
	const secure = !DEVELOPMENT;

	// use serverless function with httponly cookies in secure env
	if (secure) {
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
	} else {
		if (checkTokenType(value) && !del) {
			Cookies.set(key, value as string);
			return value as TState;
		}
		if (del) {
			Cookies.remove(key, { path: '/', secure });
			return null;
		}
		return Cookies.get(key) as TState;
	}
}
