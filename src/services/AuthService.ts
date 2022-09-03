import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { delMany } from 'idb-keyval';
import Cookies from 'js-cookie';
import { Profile } from '../utils/InterfacesStates.utils';

/*
Bug in Axios: method signature does not work with PATCH/PUT. Returning an axios call.
*/
const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const qc = new QueryClient();

const API_URL = import.meta.env.VITE_API_URL;
// const twoHour = new Date(new Date().getTime() + ((120 * 60) * 1000));

export async function refreshToken() {
  const url = `${API_URL}/auth/token/refresh/`;
  const token = Cookies.get('token');
  const response = await axios
    .post(url, {
      refresh: Cookies.get('refresh'),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'same-origin',
    })
    .then((resp) => {
      Cookies.set('token', resp.data.access, {
        sameSite: 'strict',
        secure: true,
      });
      qc.invalidateQueries();
      // window.location.reload();
    })
    .catch(() => null);
  return response;
}

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

export async function getUser() {
  const url = `${API_URL}/auth/user/`;
  const token = Cookies.get('token');
  if (token) {
    // return user data
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

// todo: make updateUser more like updateProfile, I wrote this earlier and it's sorta lower quality
export async function updateUser(first_name?: string, last_name?: string, username?: string) {
  const token = Cookies.get('token');
  if (token) {
    // method signature does not work with Patch/Put idk why
    return axios({
      method: 'PATCH',
      url: `${API_URL}/auth/user/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        first_name,
        last_name,
        username,
      },
    });
  }
  return null;
}

export async function updateProfile(values: any, profileData: Profile) {
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
  }
  return null;
}

export interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
}

export async function SignUp(user: NewUser) {
  return axios
    .post(
      `${API_URL}/auth/registration/`,
      {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password1: user.password1,
        password2: user.password2,
        headers,
      },
    )
    .then((resp) => {
      Cookies.set('token', resp.data.access_token, {
        // expires: twoHour,
        sameSite: 'strict',
        secure: true, // change to false while developing on safari
        // safari does not treat localhost as secure even for testing purposes
      });
      Cookies.set('refresh', resp.data.refresh_token, {
        expires: 30,
        sameSite: 'strict',
        secure: true,
      });
      return resp;
    }).catch((err) => err);
}

export async function logIn(email: string, password: string) {
  const url = `${API_URL}/auth/login/`;
  const response = await axios
    .post(url, {
      email,
      password,
      headers,
      credentials: 'same-origin',
    })
    .then((resp) => {
      // console.log(resp);
      Cookies.set('token', resp.data.access_token, {
        // expires: twoHour,
        sameSite: 'strict',
        secure: true,
      });
      Cookies.set('refresh', resp.data.refresh_token, {
        expires: 30,
        sameSite: 'strict',
        secure: true,
      });
      // console.log(Cookies.get('token'));
    });
  return response;
}

export async function logOut() {
  const url = `${API_URL}/auth/logout/`;
  const response = await axios
    .post(url, {
      headers,
      credentials: 'same-origin',
    })
    .then(() => {
      // console.log('resp.data ->', resp.data);
      Cookies.remove('token');
      Cookies.remove('refresh');
      delMany(['loggedInUser', 'profile']);
    })
    .catch(() => null);
  return response;
}
