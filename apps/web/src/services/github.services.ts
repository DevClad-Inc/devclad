import axios, { AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { API_URL, checkTokenType, verifyToken } from '@/services/auth.services';

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
