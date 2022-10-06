/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import { QueryClient } from '@tanstack/react-query';
import { Profile, SocialProfile, AdditionalSP } from '@/lib/InterfacesStates.lib';
import { refreshToken, API_URL, verifyToken } from '@/services/auth.services';

const qc = new QueryClient();

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
    await qc.invalidateQueries().then(async () => {
      await refreshToken().catch(() => {
        Cookies.remove('token');
        Cookies.remove('refresh');
        delMany(['loggedInUser', 'profile']);
      });
    });
  }
  return null;
}

export async function getUsernameProfile(username: string) {
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

export async function updateProfile(values: Profile, profileData: Profile) {
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

export async function updateProfileAvatar(avatar: File) {
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

export async function getSocialProfile() {
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

export async function getUsernameSocialProfile(username: string) {
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
          preferred_dev_type === '' ? socialProfileData.preferred_dev_type : preferred_dev_type,
        idea_status: idea_status === '' ? socialProfileData.idea_status : idea_status,
        raw_xp,
      },
    });
  }
  return null;
}

export async function getAdditionalSP() {
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

export async function updateAdditionalSP(values: AdditionalSP) {
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

export async function checkProfileEmpty() {
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

export async function checkSocialProfileEmpty() {
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
export const getStatus = async () => {
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

export const setSubmittedStatus = async () => {
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

export const getOneOne = async () => {
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

export const getShadowUsers = async () => {
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

export const shadowUser = async (username: string, shadowed: string[], shadow: boolean) => {
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
      data: { shadowed_users: shadowed },
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return null;
};

export const getSkippedUsers = async () => {
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

export const skipUser = async (username: string, skipped: string[], skip: boolean) => {
  const token = Cookies.get('token');
  const url = `${API_URL}/social/skipped/`;

  if (skip) {
    skipped.push(username);
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
      data: { skipped_users: skipped },
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return null;
};

// =================== circle ===================
export const getCircle = async (username: string) => {
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
export const PatchCircle = async (
  operationUsername: string,
  circle: string[],
  operation: string
) => {
  const token = Cookies.get('token');
  let url = `${API_URL}/social/circle/`;

  if (operation === 'add') {
    url += `${operationUsername}/add/`;
    circle.push(operationUsername);
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

export const blockUser = async (
  operationUsername: string,
  blocked: string[],
  operation: string
) => {
  const token = Cookies.get('token');
  const url = `${API_URL}/social/block/`;

  if (operation === 'block') {
    blocked.push(operationUsername);
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
      data: { blocked_users: blocked },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
  return null;
};
