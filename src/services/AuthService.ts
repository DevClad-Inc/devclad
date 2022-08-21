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
