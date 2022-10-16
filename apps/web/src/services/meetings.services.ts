import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/services/auth.services';

export const getMeetings = async () => {
	const token = Cookies.get('token');
	const url = `${API_URL}/meetings/`;

	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const getMeeting = async (id: string) => {
	const token = Cookies.get('token');
	const url = `${API_URL}/meetings/${id}/`;

	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const createUpdateMeeting = async (data: any) => {
	const token = Cookies.get('token');
	const url = `${API_URL}/meetings/`;

	if (token) {
		return axios({
			method: 'PATCH',
			url,
			data,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};
