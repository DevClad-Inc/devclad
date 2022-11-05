import axios from 'axios';
import { API_URL, checkTokenType } from '@/services/auth.services';
import { MeetingCreateUpdate } from '@/lib/InterfacesStates.lib';

export const idTypeCheck = (id: string | undefined | null) => {
	if (typeof id === 'string' && id.length > 0 && id !== 'undefined' && id !== 'null') {
		return true;
	}
	return false;
};

export const getMeeting = (token: string, id: string) => {
	const url = `${API_URL}/social/meetings/${id}/`;
	if (checkTokenType(token) && idTypeCheck(id)) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const createUpdateMeeting = (token: string, data: MeetingCreateUpdate) => {
	const url = `${API_URL}/social/meetings/all/`;

	/*
	  {
            "invites": [
                "pat"
            ],
            "type_of": "1:1 Match",
            "name": "1:1 Meeting",
            "link": null,
            "time": "2022-11-16T18:00:00Z",
            "organizer": "arth"
        }
	*/

	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};
