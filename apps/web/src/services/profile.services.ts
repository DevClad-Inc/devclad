/* eslint-disable @typescript-eslint/naming-convention */
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { Profile, SocialProfile, AdditionalSP } from '@/lib/InterfacesStates.lib';
import { refreshToken, API_URL, verifyToken } from '@/services/auth.services';
import serverlessCookie from '@/lib/serverlessCookie.lib';

export async function getProfile(token: string): Promise<AxiosResponse<Profile> | null> {
	const url = `${API_URL}/users/profile/`;
	let isVerified = false;
	if (typeof token === 'string' && token.length > 0) {
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
	if ((token === undefined || !isVerified) && Cookies.get('refresh')) {
		await refreshToken();
	}
	return null;
}

export async function getUsernameProfile(username: string) {
	const url = `${API_URL}/users/profile/${username}/`;
	const token = await serverlessCookie<string>('token');
	if (token) {
		return axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((resp) => resp)
			.catch(() => null);
	}
	return null;
}

export async function updateProfile(values: Profile, profileData: Profile) {
	const { pronouns, about, website, linkedin, calendly } = values;
	const token = await serverlessCookie<string>('token');
	if (token && profileData) {
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

export async function updateProfileAvatar(avatar: File) {
	const url = `${import.meta.env.VITE_API_URL}/users/profile/`;
	const token = await serverlessCookie<string>('token');
	const formData = new FormData();
	formData.append('avatar', avatar);
	if (token) {
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

export async function getSocialProfile() {
	const url = `${API_URL}/social/profile/`;
	const token = await serverlessCookie<string>('token');
	if (token) {
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

export async function getUsernameSocialProfile(username: string) {
	const url = `${API_URL}/social/profile/${username}/`;
	const token = await serverlessCookie<string>('token');
	if (token) {
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

export async function updateSocialProfile(values: SocialProfile, socialProfileData: SocialProfile) {
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
	const token = await serverlessCookie<string>('token');
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

export async function getAdditionalSP() {
	const url = `${API_URL}/social/additional-prefs/`;
	const token = await serverlessCookie<string>('token');
	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
}

export async function updateAdditionalSP(values: AdditionalSP) {
	const { video_call_friendly, available_always_off } = values;
	const token = await serverlessCookie<string>('token');
	if (token) {
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

export async function checkProfileEmpty() {
	const url = `${API_URL}/users/is-complete/`;
	const token = await serverlessCookie<string>('token');
	if (token) {
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

export async function checkSocialProfileEmpty() {
	const url = `${API_URL}/social/is-complete/`;
	const token = await serverlessCookie<string>('token');
	if (token) {
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

export const setSubmittedStatus = async () => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/users/status/`;
	if (token) {
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

export const getOneOne = async () => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/one-one/`;
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

export const getShadowUsers = async () => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/shadow/`;
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

export const shadowUser = async (username: string, shadowed: string[], shadow: boolean) => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/shadow/`;

	if (shadow) {
		shadowed.push(username);
	} else {
		const index = shadowed.indexOf(username);
		if (index > -1) {
			shadowed.splice(index, 1);
		}
	}
	if (token) {
		return axios({
			method: 'PATCH',
			url,
			data: { shadowed },
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const getSkippedUsers = async () => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/skipped/`;
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

export const skipUser = async (username: string, skipped: string[], skip: boolean) => {
	const token = await serverlessCookie<string>('token');
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
	if (token) {
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
export const getAdded = async () => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/added/`;
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

export const getCircle = async (username: string) => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/circle/${username}/get/`;
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

// Add is only for One-One
export const patchCircle = async (
	operationUsername: string,
	circle: string[],
	operation: string
) => {
	const token = await serverlessCookie<string>('token');
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

	if (token) {
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

export const getBlockedUsers = async () => {
	const token = await serverlessCookie<string>('token');
	const url = `${API_URL}/social/block/`;
	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
};

export const blockUser = async (
	operationUsername: string,
	blocked: string[],
	operation: string
) => {
	const token = await serverlessCookie<string>('token');
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

	if (token) {
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
