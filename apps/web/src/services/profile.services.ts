/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import Cookies from 'js-cookie';
import { Profile, SocialProfile, AdditionalSP } from '@/lib/InterfacesStates.lib';
import { refreshToken, API_URL, verifyToken } from '@/services/auth.services';

export async function getProfile() {
	const url = `${API_URL}/users/profile/`;
	const token = Cookies.get('token');
	let isVerified = false;
	if (token) {
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

export function getUsernameProfile(username: string) {
	const url = `${API_URL}/users/profile/${username}/`;
	const token = Cookies.get('token');
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

export function updateProfile(values: Profile, profileData: Profile) {
	const { pronouns, about, website, linkedin, calendly } = values;
	const token = Cookies.get('token');
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

export function updateProfileAvatar(avatar: File) {
	const url = `${import.meta.env.VITE_API_URL}/users/profile/`;
	const token = Cookies.get('token');
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

export function getSocialProfile() {
	const url = `${API_URL}/social/profile/`;
	const token = Cookies.get('token');
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

export function getUsernameSocialProfile(username: string) {
	const url = `${API_URL}/social/profile/${username}/`;
	const token = Cookies.get('token');
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

export function updateSocialProfile(values: SocialProfile, socialProfileData: SocialProfile) {
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
	const token = Cookies.get('token');
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

export function getAdditionalSP() {
	const url = `${API_URL}/social/additional-prefs/`;
	const token = Cookies.get('token');
	if (token) {
		return axios({
			method: 'GET',
			url,
			headers: { Authorization: `Bearer ${token}` },
		});
	}
	return null;
}

export function updateAdditionalSP(values: AdditionalSP) {
	const { video_call_friendly, available_always_off } = values;
	const token = Cookies.get('token');
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

export function checkProfileEmpty() {
	const url = `${API_URL}/users/is-complete/`;
	const token = Cookies.get('token');
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

export function checkSocialProfileEmpty() {
	const url = `${API_URL}/social/is-complete/`;
	const token = Cookies.get('token');
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
export const getStatus = () => {
	const token = Cookies.get('token');
	const url = `${API_URL}/users/status/`;
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

export const setSubmittedStatus = () => {
	const token = Cookies.get('token');
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

export const getOneOne = () => {
	const token = Cookies.get('token');
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

export const getShadowUsers = () => {
	const token = Cookies.get('token');
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

export const shadowUser = (username: string, shadowed: string[], shadow: boolean) => {
	const token = Cookies.get('token');
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

export const getSkippedUsers = () => {
	const token = Cookies.get('token');
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

export const skipUser = (username: string, skipped: string[], skip: boolean) => {
	const token = Cookies.get('token');
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
export const getAdded = () => {
	const token = Cookies.get('token');
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

export const getCircle = (username: string) => {
	const token = Cookies.get('token');
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
export const patchCircle = (operationUsername: string, circle: string[], operation: string) => {
	const token = Cookies.get('token');
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

export const getBlockedUsers = () => {
	const token = Cookies.get('token');
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

export const blockUser = (operationUsername: string, blocked: string[], operation: string) => {
	const token = Cookies.get('token');
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
