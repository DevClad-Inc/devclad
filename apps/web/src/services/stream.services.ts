import axios from 'axios';
import serverlessCookie from '@/lib/serverlessCookie.lib';
import { API_URL } from './auth.services';

export const getStreamToken = async () => {
	const url = `${API_URL}/stream/token/`;
	const token = await serverlessCookie<string>('token');

	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then((resp) => resp.data)
			.catch(() => null);
	}
	return null;
};

// meant to be used for other users
// token/ already returns uid and token for current user
export const getStreamUID = async (username: string) => {
	const url = `${API_URL}/stream/uid/${username}/`;
	const token = await serverlessCookie<string>('token');

	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then((resp) => resp.data)
			.catch(() => null);
	}
	return null;
};
