import axios from 'axios';
import Cookies from 'js-cookie';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const API_URL = import.meta.env.VITE_API_URL;
const fortyFive = new Date(new Date().getTime() + ((45 * 60) * 1000));

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
        expires: fortyFive,
        sameSite: 'lax',
        secure: true,
      });
    })
    .catch(() => {});
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
  if (token === 'undefined' && Cookies.get('refresh')) {
    refreshToken();
  }
  return null;
}

export async function getUser() {
  const token = Cookies.get('token');
  if (token) {
    // return user data
    return axios
      .get(`${API_URL}/auth/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => resp)
      .catch(() => {});
  }
  if (token === undefined && Cookies.get('refresh')) {
    // refresh token
    refreshToken();
  }
  return null;
}

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

export async function updateProfile(values: any) {
  const {
    timezone, pronouns,
    about, website, linkedin,
  } = values;
  const token = Cookies.get('token');
  if (token) {
    // method signature does not work with Patch/Put idk why
    return axios({
      method: 'PATCH',
      url: `${API_URL}/users/profile/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        timezone,
        pronouns,
        about,
        website,
        linkedin,
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
        expires: fortyFive,
        sameSite: 'lax',
        secure: true,
      });
      Cookies.set('refresh', resp.data.refresh_token, {
        expires: 30,
        sameSite: 'lax',
        secure: true,
      });
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
      Cookies.set('token', resp.data.access_token, {
        expires: fortyFive,
        sameSite: 'lax',
        secure: true,
      });
      Cookies.set('refresh', resp.data.refresh_token, {
        expires: 30,
        sameSite: 'lax',
        secure: true,
      });
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
      // delMany(['loggedInUser', 'profile']);
    })
    .catch(() => {});
  return response;
}
