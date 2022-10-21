/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosResponse } from 'axios';
import { Profile, SocialProfile, AdditionalSP } from '@/lib/InterfacesStates.lib';
import { refreshToken, API_URL, verifyToken, checkTokenType } from '@/services/auth.services';
import serverlessCookie from '@/lib/serverlessCookie.lib';

export async function getProfile(
	token: string,
	username: string
): Promise<AxiosResponse<Profile> | null> {
	const url = `${API_URL}/users/profile/${username}/`;
	const refresh = await serverlessCookie<string>('refresh');
	let isVerified = false;
	if (checkTokenType(token)) {
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
	if ((token === undefined || !isVerified) && refresh) {
		await refreshToken();
	}
	return null;
}

export async function updateProfile(token: string, values: Profile, profileData: Profile) {
	const { pronouns, about, website, linkedin, calendly } = values;
	if (checkTokenType(token) && profileData) {
		return axios({
			method: 'PATCH',
			url: `${API_URL}/users/profile/`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				pronouns,
				about,
				website,
				linkedin,
				calendly,
			},
		});
	}
	return null;
}

export async function updateProfileAvatar(token: string, avatar: File) {
	const url = `${import.meta.env.VITE_API_URL}/users/profile/`;
	const formData = new FormData();
	formData.append('avatar', avatar);
	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return null;
}

export async function getSocialProfile(token: string) {
	const url = `${API_URL}/social/profile/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return null;
}

export async function getUsernameSocialProfile(token: string, username: string) {
	const url = `${API_URL}/social/profile/${username}/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return null;
}

export async function updateSocialProfile(
	token: string,
	values: SocialProfile,
	socialProfileData: SocialProfile
) {
	const {
		preferred_dev_type,
		idea_status,
		dev_type,
		raw_xp,
		languages,
		purpose,
		location,
		timezone,
	} = values;
	if (token && socialProfileData) {
		return axios({
			method: 'PATCH',
			url: `${API_URL}/social/profile/`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				languages: languages === '' ? socialProfileData.languages : languages,
				location: location === '' ? socialProfileData.location : location,
				purpose: purpose === '' ? socialProfileData.purpose : purpose,
				timezone,
				dev_type: dev_type === '' ? socialProfileData.dev_type : dev_type,
				preferred_dev_type:
					preferred_dev_type === ''
						? socialProfileData.preferred_dev_type
						: preferred_dev_type,
				idea_status: idea_status === '' ? socialProfileData.idea_status : idea_status,
				raw_xp,
			},
		});
	}
	return null;
}

export async function getAdditionalSP(token: string) {
	const url = `${API_URL}/social/additional-prefs/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
}

export async function updateAdditionalSP(token: string, values: AdditionalSP) {
	const { video_call_friendly, available_always_off } = values;
	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url: `${API_URL}/social/additional-prefs/`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				video_call_friendly,
				available_always_off,
			},
		});
	}
	return null;
}

export async function checkProfileEmpty(token: string) {
	const url = `${API_URL}/users/is-complete/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return null;
}

export async function checkSocialProfileEmpty(token: string) {
	const url = `${API_URL}/social/is-complete/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}
	return null;
}

/*
This deals with UserStatus Model.
getStatus() - This is to check "approved" field.
setSubmittedStatus() - This is to set the "status" field to "Submitted".
*/
export const getStatus = async (token: string | undefined) => {
	const url = `${API_URL}/users/status/`;
	if (token !== undefined && token !== '') {
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

export const setSubmittedStatus = async (token: string) => {
	const url = `${API_URL}/users/status/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: { status: 'Submitted' },
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

// =================== ONE-ONE ML ===================

export const getOneOne = async (token: string) => {
	const url = `${API_URL}/social/one-one/`;
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

export const getShadowUsers = async (token: string) => {
	const url = `${API_URL}/social/shadow/`;
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

export const shadowUser = async (
	token: string,
	username: string,
	shadowed: string[],
	shadow: boolean
) => {
	const url = `${API_URL}/social/shadow/`;

	if (shadow) {
		shadowed.push(username);
	} else {
		const index = shadowed.indexOf(username);
		if (index > -1) {
			shadowed.splice(index, 1);
		}
	}
	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: { shadowed },
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const getSkippedUsers = async (token: string) => {
	const url = `${API_URL}/social/skipped/`;
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

export const skipUser = async (
	token: string,
	username: string,
	skipped: string[],
	skip: boolean
) => {
	const url = `${API_URL}/social/skipped/`;

	if (skip) {
		if (skipped.indexOf(username) === -1) {
			skipped.push(username);
		}
	} else {
		const index = skipped.indexOf(username);
		if (index > -1) {
			skipped.splice(index, 1);
		}
	}
	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: { skipped },
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

// =================== circle ===================
export const getAdded = async (token: string) => {
	const url = `${API_URL}/social/added/`;
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

export const getCircle = async (token: string, username: string) => {
	const url = `${API_URL}/social/circle/${username}/get/`;
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

// Add is only for One-One
export const patchCircle = async (
	token: string,
	operationUsername: string,
	circle: string[],
	operation: string
) => {
	let url = `${API_URL}/social/circle/`;
	if (operation === 'add') {
		url += `${operationUsername}/add/`;
		if (circle.indexOf(operationUsername) === -1) {
			circle.push(operationUsername);
		}
	} else if (operation === 'remove') {
		url += `${operationUsername}/remove/`;
		const index = circle.indexOf(operationUsername);
		if (index > -1) {
			circle.splice(index, 1);
		}
	}

	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: { circle },
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}
	return null;
};

export const getBlockedUsers = async (token: string) => {
	const url = `${API_URL}/social/block/`;
	if (checkTokenType(token)) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const blockUser = async (
	token: string,
	operationUsername: string,
	blocked: string[],
	operation: string
) => {
	const url = `${API_URL}/social/block/`;

	if (operation === 'block') {
		if (blocked.indexOf(operationUsername) === -1) {
			blocked.push(operationUsername);
		}
	} else if (operation === 'unblock') {
		const index = blocked.indexOf(operationUsername);
		if (index > -1) {
			blocked.splice(index, 1);
		}
	}

	if (checkTokenType(token)) {
		return axios({
			method: 'PATCH',
			url,
			data: { blocked },
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		});
	}
	return null;
};
