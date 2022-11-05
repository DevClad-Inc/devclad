import axios, { AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { API_URL, checkTokenType, verifyToken } from '@/services/auth.services';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

export interface GithubOAuthResponse {
	access_token: string;
	access_token_workspaces: string;
	username: string;
}

export const getGithubData = async (
	token: string,
	qc: QueryClient
): Promise<GithubOAuthResponse | null> => {
	const url = `${API_URL}/oauth/github/connect/`;
	let isVerified = false;
	if (checkTokenType(token)) {
		isVerified = await verifyToken(token, qc);
	}
	if (isVerified) {
		const response: AxiosResponse<GithubOAuthResponse> = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const { data } = response as { data: GithubOAuthResponse };
		return data;
	}
	return null;
};

export const loginGithub = () => {
	const REDIRECT_URI = `${CLIENT_URL}/auth/complete/github/login/`;
	const SCOPE = 'user';
	const redirectUrl =
		`https://github.com/login/oauth/authorize` +
		`?client_id=${CLIENT_ID}` +
		`&redirect_uri=${REDIRECT_URI}` +
		`&scope=${SCOPE}`;
	window.location.href = redirectUrl;
};

export const connectGithub = () => {
	const REDIRECT_URI = `${CLIENT_URL}/auth/complete/github/connect/`;
	const SCOPE = 'user';
	const redirectUrl =
		`https://github.com/login/oauth/authorize` +
		`?client_id=${CLIENT_ID}` +
		`&redirect_uri=${REDIRECT_URI}` +
		`&scope=${SCOPE}`;
	window.location.href = redirectUrl;
};
