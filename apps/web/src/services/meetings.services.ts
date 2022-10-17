import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/services/auth.services';
import { Meeting } from '@/lib/InterfacesStates.lib';

export const getMeetings = async (uid: string) => {
	const token = Cookies.get('token');
	const url = `${API_URL}/social/meetings/${uid}/`; // either "all" or uid
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
	const url = `${API_URL}/social/meetings/${id}/`;

	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const createUpdateMeeting = async (data: Meeting) => {
	const token = Cookies.get('token');
	const url = `${API_URL}/social/meetings/`;

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
