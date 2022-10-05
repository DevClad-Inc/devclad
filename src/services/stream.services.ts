import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from './auth.services';

// eslint-disable-next-line import/prefer-default-export
export const getStreamToken = async () => {
  const url = `${API_URL}/stream/token/`;
  const token = Cookies.get('token');

  if (token) {
    return axios({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((resp) => resp.data.token)
      .catch(() => null);
  }
  return null;
};
