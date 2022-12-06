import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL, checkTokenType, verifyToken } from '@/services/auth.services';

export const checkAdmin = async (token: string, qc: QueryClient) => {
	const url = `${API_URL}/internal/check-admin/`;
	let isTokenVerified = false;
	if (checkTokenType(token)) {
		isTokenVerified = await verifyToken(token, qc);
	}
	if (isTokenVerified) {
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

export const getUsers = async (token: string, filter?: string) => {
	let url;

	if (filter) {
		url = `${API_URL}/internal/users/?status=${filter}`;
	} else {
		url = `${API_URL}/internal/users`;
	}
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

export const adminQuery = (token: string, qc: QueryClient) => ({
	queryKey: ['admin'],
	queryFn: () => checkAdmin(token, qc),
	enabled: checkTokenType(token),
});

export const usersQuery = (token: string, filter?: string) => ({
	queryKey: ['manage-users'],
	queryFn: () => getUsers(token, filter),
	enabled: checkTokenType(token),
});
