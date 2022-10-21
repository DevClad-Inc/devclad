import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import { NewUser } from '@/lib/InterfacesStates.lib';
import serverlessCookie from '@/lib/serverlessCookie.lib';

export const API_URL = import.meta.env.VITE_API_URL;

const headers = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
};

const qc = new QueryClient();

// const twoHour = new Date(new Date().getTime() + ((120 * 60) * 1000));

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

export const passwordChange = async (password1: string, password2: string) => {
	const url = `${API_URL}/auth/password/change/`;
	const token = serverlessCookie<string>('token');
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
};

export const changeEmail = (email: string) => {
	const token = serverlessCookie<string>('token');
	const url = `${API_URL}/users/change-email/`;
	if (token) {
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

export const checkVerified = () => {
	const token = serverlessCookie<string>('token');
	const url = `${API_URL}/users/change-email/`;
	if (token) {
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
	const url = `${API_URL}/auth/password/reset/`;
	const response = await axios.post(url, { email }, { headers });
	return response.data;
};

export const resendEmail = async (email: string) => {
	const url = `${API_URL}/auth/registration/resend-email/`;
	const response = await axios.post(url, { email }, { headers });
	return response.data;
};

export function verifyToken(token: string): Promise<boolean> {
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
		.catch(() => false);
}

export function refreshToken() {
	const url = `${API_URL}/auth/token/refresh/`;
	serverlessCookie<string>('refresh').then((refresh) => {
		if (refresh) {
			axios({
				method: 'POST',
				url,
				data: { refresh },
				headers: { Authorization: `Bearer ${refresh}` },
			})
				.then(async (resp) => {
					if (resp.status === 200) {
						await serverlessCookie<string>('token', resp.data.access, 60 * 60 * 24);
						await serverlessCookie<string>(
							'refresh',
							resp.data.refresh,
							60 * 60 * 24 * 14
						);
					}
				})
				.then(async () => {
					await qc.invalidateQueries();
				});
		}
	});
	// .catch(() => {
	// 	delMany(['loggedInUser', 'profile']);
	// 	Cookies.remove('token');
	// });
}

export async function getUser() {
	const url = `${API_URL}/auth/user/`;
	let isVerified = false;
	let refresh: string | null = null;
	await serverlessCookie<string>('refresh')
		.then((ref) => {
			if (ref) {
				refresh = ref;
			}
		})
		.catch(() => null);
	await serverlessCookie<string>('token')
		.then(async (token) => {
			if (token) {
				isVerified = await verifyToken(token);
			}
			if (isVerified) {
				return axios({
					method: 'GET',
					url,
					headers: { Authorization: `Bearer ${token}` },
				})
					.then((resp) => resp)
					.catch(() => null);
			}
			if ((token === null || !isVerified) && refresh) {
				await refreshToken();
			}
			return null;
		})
		.catch(() => null);
}

export function updateUser(first_name?: string, last_name?: string, username?: string) {
	const token = serverlessCookie<string>('token');
	if (token) {
		return axios.patch(
			`${API_URL}/auth/user/`,
			{ first_name, last_name, username },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
	}
	return null;
}

export function SignUp(user: NewUser) {
	return axios
		.post(`${API_URL}/auth/registration/`, {
			first_name: user.firstName,
			last_name: user.lastName,
			email: user.email,
			password1: user.password1,
			password2: user.password2,
			headers,
		})
		.then((resp) => {
			serverlessCookie<string>('token', resp.data.access, 60 * 60 * 24);
			serverlessCookie<string>('refresh', resp.data.refresh, 60 * 60 * 24 * 14);
			return resp;
		})
		.catch((err) => err);
}

export async function logIn(email: string, password: string) {
	const url = `${API_URL}/auth/login/`;
	const response = await axios
		.post(url, {
			email,
			password,
			headers,
			credentials: 'include',
		})
		.then(async (resp) => {
			serverlessCookie<string>('token', resp.data.access, 60 * 60 * 24);
			serverlessCookie<string>('refresh', resp.data.refresh, 60 * 60 * 24 * 14);
		});
	return response;
}

export async function logOut() {
	const url = `${API_URL}/auth/logout/`;
	return serverlessCookie<string>('refresh').then(async (refresh) => {
		if (refresh) {
			const response = await axios
				.post(url, {
					refresh,
					headers,
					credentials: 'same-origin',
				})
				.then(async () => {
					await delMany(['loggedInUser', 'profile']).then(() => {
						Cookies.remove('token');
						Cookies.remove('refresh');
					});
				})
				.catch(() => null);
			return response;
		}
		return null;
	});
}
