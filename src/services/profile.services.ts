/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import {
  ProfileUpdate, Profile, SocialProfileUpdate, SocialProfile,
} from '../utils/InterfacesStates.utils';
import { refreshToken } from './auth.services';

const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  'Content-Type': 'multipart/form-data',
  Authorization: `Bearer ${Cookies.get('token')}`,
};

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

export async function updateProfile(values: ProfileUpdate, profileData: Profile) {
  const {
    timezone, pronouns, location,
    about, website, linkedin, devType, languages,
    rawXP, purpose,
  } = values;
  const token = Cookies.get('token');
  if (token && profileData) {
    return axios({
      method: 'PATCH',
      url: `${API_URL}/users/profile/`,
      headers,
      data: {
        timezone,
        dev_type: (devType === '') ? profileData.dev_type : devType,
        languages: (languages === '') ? profileData.languages : languages,
        location: (location === '') ? profileData.location : location,
        purpose: (purpose === '') ? profileData.purpose : purpose,
        pronouns,
        about,
        website,
        linkedin,
        raw_xp: rawXP,
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
      headers,
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
      headers,
    });
  }
  return null;
}

export async function updateSocialProfile(
  values: SocialProfileUpdate,
  socialProfileData: SocialProfile,
) {
  const {
    calendly, videoCallFriendly, preferredDevType,
    preferredTimezoneDeviation, ideaStatus,
  } = values;
  const token = Cookies.get('token');
  if (token && socialProfileData) {
    return axios({
      method: 'PATCH',
      url: `${API_URL}/social/profile/`,
      headers,
      data: {
        calendly: (calendly === '') ? socialProfileData.calendly : calendly,
        video_call_friendly: videoCallFriendly,
        preferred_timezone_deviation: (preferredTimezoneDeviation === '') ? socialProfileData.preferred_timezone_deviation : preferredTimezoneDeviation,
        preferred_dev_type: (preferredDevType === '') ? socialProfileData.preferred_dev_type : preferredDevType,
        idea_status: (ideaStatus === '') ? socialProfileData.idea_status : ideaStatus,
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
      headers,
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
      headers,
    });
  }
  return null;
}
