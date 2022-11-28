import axios from 'axios';
import Cookies from 'js-cookie';
import { QueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import { LoginResponse, NewUser, User } from '@/lib/types.lib';
import { refreshQuery, tokenQuery } from '@/lib/queries.lib';
import cookieAdapter from '@/lib/cookieAdapter.lib';

export const API_URL = import.meta.env.VITE_API_URL;
export const DEVELOPMENT = import.meta.env.DEV;
export const CF_KEY = import.meta.env.VITE_CF_SITE_KEY;

const headers = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

export const checkTokenType = (token: string | undefined | null) => {
	if (
		typeof token === 'string' &&
		token.length > 0 &&
		token !== 'undefined' &&
		token !== 'null'
	) {
		return true;
	}
	return false;
};

export const verifyEmail = async (key: string) => {
	const url = `${API_URL}/auth/registration/verify-email/`;
	const response = await axios.post(url, { key }, { headers });
	return response.data;
};

export const passwordReset = async (
	password1: string,
	password2: string,
	uid: string,
	token: string
) => {
	const url = `${API_URL}/auth/password/reset/confirm/`;
	const response = await axios.post(
		url,
		{
			new_password1: password1,
			new_password2: password2,
			uid,
			token,
		},
		{ headers }
	);
	return response.data;
};

export const passwordChange = async (token: string, password1: string, password2: string) => {
	const url = `${API_URL}/auth/password/change/`;
	if (checkTokenType(token)) {
		const response = await axios.post(
			url,
			{
				new_password1: password1,
				new_password2: password2,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
			}
		);
		return response;
	}
	return null;
};

export const changeEmail = (token: string, email: string) => {
	const url = `${API_URL}/users/change-email/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: { email },
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}
	return null;
};

export const checkVerified = (token: string) => {
	/*
	 * Check if user's email is verified
	 */
	const url = `${API_URL}/users/change-email/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}
	return null;
};

export const forgotPassword = async (email: string) => {
	/*
	 * Send email to user with password reset link
	 */
	const url = `${API_URL}/auth/password/reset/`;
	const response = await axios.post(url, { email }, { headers });
	return response.data;
};

export const resendEmail = async (email: string) => {
	const url = `${API_URL}/auth/registration/resend-email/`;
	const response = await axios.post(url, { email }, { headers });
	return response.data;
};

export async function refreshToken(queryClient: QueryClient) {
	/*
	 * Refresh token with old refresh token
	 * set new token and refresh token in cookies
	 * set returned tokens in queryClient cache. saved as fresh queries.
	 */
	const url = `${API_URL}/auth/token/refresh/`;
	const refresh = await cookieAdapter<string>('refresh');
	if (checkTokenType(refresh)) {
		return axios
			.post(url, {
				refresh,
				headers: {
					Authorization: `Bearer ${refresh}`,
				},
				credentials: 'same-origin',
			})
			.then((resp) => {
				cookieAdapter<string>('token', resp.data.access, 60 * 60 * 36, false).then(() => {
					cookieAdapter<string>('refresh', resp.data.refresh, 60 * 60 * 24 * 28, false);
					queryClient
						.setQueryData(tokenQuery().queryKey, resp.data.access)
						.then(() =>
							queryClient.setQueryData(refreshQuery().queryKey, resp.data.refresh)
						)
						.then(() => {
							queryClient.invalidateQueries();
						});
				});
			});
	}
	return null;
}

export async function verifyToken(token: string, queryClient?: QueryClient): Promise<boolean> {
	const url = `${API_URL}/auth/token/verify/`;
	return axios({
		method: 'POST',
		url,
		data: { token },
		headers: { 'Content-Type': 'application/json' },
	})
		.then((resp) => {
			if (resp.status === 200) {
				return true;
			}
			return false;
		})
		.catch(() => {
			// case: token expired on the server but not on client
			if (queryClient) {
				refreshToken(queryClient);
			}
			return false;
		});
}

export async function getUser(token: string, queryClient?: QueryClient) {
	const url = `${API_URL}/auth/user/`;
	let isTokenVerified = false;
	if (checkTokenType(token)) {
		isTokenVerified = await verifyToken(token, queryClient);
	}
	if (isTokenVerified) {
		return axios
			.get<User>(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((resp) => resp)
			.catch(() => null);
	}
	return null;
}

export function updateUser(
	token: string,
	first_name?: string,
	last_name?: string,
	username?: string
) {
	if (checkTokenType(token)) {
		return axios.patch<User>(
			`${API_URL}/auth/user/`,
			{ first_name, last_name, username },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
	}
	return null;
}

export async function SignUp(user: NewUser) {
	return axios
		.post(`${API_URL}/auth/registration/`, {
			first_name: user.firstName,
			last_name: user.lastName,
			email: user.email,
			password1: user.password1,
			password2: user.password2,
			headers,
		})
		.then((resp) => resp)
		.catch((err) => err);
}

export async function logIn(queryClient: QueryClient, email: string, password: string) {
	const url = `${API_URL}/auth/login/`;
	let token;
	const response = await axios
		.post<LoginResponse>(url, {
			email,
			password,
			headers,
			credentials: 'include',
		})
		.then((resp) => {
			cookieAdapter<string>('token', resp.data.access_token, 60 * 60 * 24, false).then(() => {
				token = resp.data.access_token;
				queryClient.setQueryData(tokenQuery().queryKey, resp.data.access_token);
				queryClient.setQueryData(refreshQuery().queryKey, resp.data.refresh_token);
				cookieAdapter<string>(
					'refresh',
					resp.data.refresh_token,
					60 * 60 * 24 * 14,
					false
				).then(() => {
					Cookies.set('loggedIn', 'true', {
						path: '/',
						sameSite: 'Strict',
					});
				});
			});
		});

	return { response, token };
}

export async function logOut() {
	const refresh = await cookieAdapter<string>('refresh');
	const url = `${API_URL}/auth/logout/`;

	if (refresh) {
		Cookies.remove('loggedIn');
		const response = cookieAdapter<string>('token', '', 0, true).then(async () => {
			await axios
				.post(url, {
					refresh,
					headers,
					credentials: 'same-origin',
				})
				.then(async () => {
					await delMany(['loggedInUser', 'profile']);
				})
				.then(() => {
					cookieAdapter<string>('refresh', '', 0, true).then(() => {
						window.location.reload();
					});
				})
				.catch(() => window.location.reload());
		});
		return response;
	}
	return null;
}
