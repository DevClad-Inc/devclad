import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import { NewUser } from '@/lib/InterfacesStates.lib';
import serverlessCookie from '@/lib/serverlessCookie.lib';
import { tokenQuery } from '@/lib/queriesAndLoaders';

export const API_URL = import.meta.env.VITE_API_URL;
export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

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
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/auth/password/change/`;
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

export const changeEmail = async (email: string) => {
	const token = await serverlessCookie<string>('token');
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

export const checkVerified = async () => {
	const token = await serverlessCookie<string>('token');
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
	const refresh = Cookies.get('refresh');
	return axios
		.post(url, {
			refresh: Cookies.get('refresh'),
			headers: {
				Authorization: `Bearer ${refresh}`,
			},
			credentials: 'same-origin',
		})
		.then((resp) => {
			Cookies.set('token', resp.data.access, {
				sameSite: 'strict',
				secure: !import.meta.env.VITE_DEVELOPMENT,
			});
			Cookies.set('refresh', resp.data.refresh, {
				expires: 14, // 2 weeks
				sameSite: 'strict',
				secure: !import.meta.env.VITE_DEVELOPMENT,
			});
		})
		.then(async () => {
			await qc.invalidateQueries();
		});
	// .catch(() => {
	// 	delMany(['loggedInUser', 'profile']);
	// 	Cookies.remove('token');
	// });
}

export async function getUser(token: string) {
	const url = `${API_URL}/auth/user/`;
	let isVerified = false;
	if (token !== '') {
		isVerified = await verifyToken(token);
	}
	if (isVerified) {
		return axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((resp) => resp)
			.catch(() => null);
	}
	if ((token === '' || !isVerified) && Cookies.get('refresh')) {
		await refreshToken();
	}
	return null;
}

export async function updateUser(first_name?: string, last_name?: string, username?: string) {
	const token = await serverlessCookie<string>('token');
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
			Cookies.set('token', resp.data.access_token, {
				sameSite: 'strict',
				secure: !import.meta.env.VITE_DEVELOPMENT,
			});
			Cookies.set('refresh', resp.data.refresh_token, {
				expires: 14, // 2 weeks
				sameSite: 'strict',
				secure: !import.meta.env.VITE_DEVELOPMENT,
			});
			return resp;
		})
		.catch((err) => err);
}

export async function logIn(email: string, password: string) {
	const url = `${API_URL}/auth/login/`;
	let token;
	const response = await axios
		.post(url, {
			email,
			password,
			headers,
			credentials: 'include',
		})
		.then(async (resp) => {
			Cookies.set('token', resp.data.access_token, {
				sameSite: 'strict',
				secure: !import.meta.env.VITE_DEVELOPMENT,
			});
			Cookies.set('refresh', resp.data.refresh_token, {
				expires: 14, // 2 weeks
				sameSite: 'strict',
				secure: !import.meta.env.VITE_DEVELOPMENT,
			});
			token = qc.refetchQueries(tokenQuery().queryKey);
		});
	return { response, token };
}

export async function logOut() {
	const refresh = Cookies.get('refresh');
	const url = `${API_URL}/auth/logout/`;

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
					qc.invalidateQueries();
				});
			})
			.catch(() => null);
		return response;
	}
	return null;
}
