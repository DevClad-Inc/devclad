import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/types.lib';
import {
	githubDataQuery,
	refreshQuery,
	statusQuery,
	streamQuery,
	tokenQuery,
	userQuery,
} from '@/lib/queries.lib';
import { checkTokenType } from './auth.services';

export type StreamTokenT = {
	token: string;
	uid: string;
};

export function useAuth() {
	const qc = useQueryClient();
	const tokenRef = React.useRef<string>('');
	const refreshRef = React.useRef<string>('');
	const authedRef = React.useRef<boolean>(false);
	const userRef = React.useRef<User>({ ...initialUserState });
	const streamTokenRef = React.useRef<StreamTokenT | null>(null);

	const { isSuccess: tokenSuccess, data: tokenData } = useQuery({
		...tokenQuery(qc),
	});
	const { isSuccess: refreshSuccess, data: refreshData } = useQuery({
		...refreshQuery(),
	});
	if (tokenSuccess && tokenData !== '') {
		tokenRef.current = tokenData as string;
	}

	if (refreshSuccess && refreshData && refreshData !== '') {
		refreshRef.current = refreshData;
	}

	const { isSuccess: userSuccess, data: userData } = useQuery({
		...userQuery(tokenRef.current ? tokenRef.current : '', qc),
		enabled: Boolean(tokenData),
	});
	const { isSuccess: streamSuccess, data: streamData } = useQuery({
		...streamQuery(tokenRef.current ? tokenRef.current : ''),
		enabled: Boolean(userData),
	});

	if (streamSuccess && streamData) {
		streamTokenRef.current = streamData;
	}

	if (userSuccess && userData) {
		userRef.current = userData.data;
		authedRef.current = true;
	}

	const undefinedUser = Object.values(userRef.current).every((value) => value === undefined);

	if (undefinedUser) {
		authedRef.current = false;
	}
	return {
		authed: authedRef.current,
		loggedInUser: userRef.current,
		token: tokenRef.current,
		refresh: refreshRef.current,
		streamToken: streamTokenRef.current,
	};
}

export function useApproved(): { approved: boolean; status: string } {
	const approved = React.useRef<boolean>(false);
	const status = React.useRef<string>('Not Submitted');
	const { token } = useAuth();
	const qc = useQueryClient();
	const { isSuccess, data } = useQuery({
		...statusQuery(token, qc),
		enabled: checkTokenType(token),
	});

	if (isSuccess && data && approved !== data.data.approved && status !== data.data.status) {
		approved.current = data.data.approved;
		status.current = data.data.status;
	}
	return { approved: approved.current, status: status.current };
}

export function useGithubOAuth(): {
	username: string;
	accessToken: string;
	accessTokenWorkspaces: string;
} {
	const username = React.useRef<string>('');
	const accessToken = React.useRef<string>('');
	const accessTokenWorkspaces = React.useRef<string>('');
	const { token } = useAuth();
	const qc = useQueryClient();
	const { isSuccess, data } = useQuery({
		...githubDataQuery(token, qc),
		enabled: checkTokenType(token),
	});

	if (isSuccess && data && username.current !== data.username) {
		username.current = data.username;
		accessToken.current = data.access_token;
		accessTokenWorkspaces.current = data.access_token_workspaces;
	}

	return {
		username: username.current,
		accessToken: accessToken.current,
		accessTokenWorkspaces: accessTokenWorkspaces.current,
	};
}
