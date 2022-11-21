import axios from 'axios';
import Cookies from 'js-cookie';
import { QueryClient } from '@tanstack/react-query';
import { checkTokenType, DEVELOPMENT, refreshToken } from '@/services/auth.services';

export default async function cookieAdapter<TState>(
	key: string,
	value?: string,
	maxAge?: number,
	del?: boolean,
	qc?: QueryClient
): Promise<TState | null> {
	const url = `/api/cookies`;
	const secure = Boolean(!DEVELOPMENT); // use serverless function with httponly cookies in secure env
	const test = false;
	if (secure || test) {
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
			if (key === 'token' && qc) {
				// refresh token is being called here because the token got expired on the client
				await refreshToken(qc);
				const response = await axios({
					method: 'GET',
					url,
					params: { key },
					headers: { 'Content-Type': 'application/json' },
				});
				return response.data.value as TState;
			}
			return null;
		}
	} else {
		// use non-httpOnly cookies in dev env directly from Cookies lib
		if (checkTokenType(value) && !del) {
			Cookies.set(key, value as string);
			return value as TState;
		}
		if (del) {
			Cookies.remove(key, { path: '/', secure });
			return null;
		}

		if (Cookies.get(key) === undefined && Cookies.get('refresh')) {
			// refresh token is being called here because the token got expired on the client
			await refreshToken(qc as QueryClient);
		}
		return Cookies.get(key) as TState;
	}
}
