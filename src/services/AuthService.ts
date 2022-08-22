import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getUser() {
  const token = localStorage.getItem('token');
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
    .then((resp) => resp).catch((err) => err);
}

export async function logIn(email: string, password: string) {
  const url = `${API_URL}/auth/login/`;
  const response = await axios
    .post(url, {
      email,
      password,
      headers,
      credentials: 'same-origin',
      withCredentials: true,
    })
    .then((resp) => {
      // console.log('resp.data ->', resp.data);
      localStorage.setItem('token', resp.data.access_token);
      localStorage.setItem('refresh', resp.data.refresh_token);
    });
  return response;
}

export async function refreshToken() {
  const url = `${API_URL}/auth/token/refresh/`;
  const response = await axios
    .post(url, {
      refresh: localStorage.getItem('refresh'),
      headers,
      credentials: 'same-origin',
      withCredentials: true,
    })
    .then((resp) => {
      // console.log('resp.data ->', resp.data);
      localStorage.setItem('token', resp.data.access);
    })
    .catch(() => {});
  return response;
}

export async function logOut() {
  const url = `${API_URL}/auth/logout/`;
  const response = await axios
    .post(url, {
      headers,
      credentials: 'same-origin',
      withCredentials: true,
    })
    .then(() => {
      // console.log('resp.data ->', resp.data);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('loggedInUser');
    })
    .catch(() => {});
  return response;
}
