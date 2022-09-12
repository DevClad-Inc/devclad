/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import {
  Profile, SocialProfileUpdate, SocialProfile,
} from '@/lib/InterfacesStates.lib';
import { refreshToken } from '@/services/auth.services';

const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile() {
  const url = `${API_URL}/users/profile/`;
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
  if (token === undefined && Cookies.get('refresh')) {
    await refreshToken().catch(
      () => {
        Cookies.remove('token');
        Cookies.remove('refresh');
        delMany(['loggedInUser', 'profile']);
      },
    );
  }
  return null;
}

export async function updateProfile(values: Profile, profileData: Profile) {
  const {
    pronouns,
    about, website, linkedin, calendly,
  } = values;
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

export async function updateSocialProfile(
  values: SocialProfileUpdate,
  socialProfileData: SocialProfile,
) {
  const {
    videoCallFriendly, preferredDevType,
    ideaStatus,
    devType, rawXP, languages, purpose, location, timezone,
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
        languages: (languages === '') ? socialProfileData.languages : languages,
        location: (location === '') ? socialProfileData.location : location,
        purpose: (purpose === '') ? socialProfileData.purpose : purpose,
        video_call_friendly: videoCallFriendly,
        timezone,
        dev_type: (devType === '') ? socialProfileData.dev_type : devType,
        preferred_dev_type: (preferredDevType === '') ? socialProfileData.preferred_dev_type : preferredDevType,
        idea_status: (ideaStatus === '') ? socialProfileData.idea_status : ideaStatus,
        raw_xp: rawXP,
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
