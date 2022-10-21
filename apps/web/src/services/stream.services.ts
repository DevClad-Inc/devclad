import axios from 'axios';
import { API_URL, checkTokenType } from '@/services/auth.services';

export const getStreamToken = async (token: string) => {
	const url = `${API_URL}/stream/token/`;

	if (checkTokenType(token)) {
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
export const getStreamUID = async (token: string, username: string) => {
	const url = `${API_URL}/stream/uid/${username}/`;

	if (checkTokenType(token)) {
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
