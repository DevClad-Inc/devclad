import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, initialUserState } from '@/lib/InterfacesStates.lib';
import {
	refreshQuery,
	statusQuery,
	streamQuery,
	tokenQuery,
	userQuery,
} from '@/lib/queriesAndLoaders';

export type StreamTokenT = {
	token: string;
	uid: string;
};

export function useAuth() {
	const tokenRef = React.useRef<string | undefined>(undefined);
	const refreshRef = React.useRef<string | undefined>(undefined);
	const authedRef = React.useRef<boolean>(false);
	const streamTokenRef = React.useRef<StreamTokenT | null>(null);
	const userRef = React.useRef<User>({ ...initialUserState });

	const { isSuccess: tokenSuccess, data: tokenData } = useQuery(tokenQuery());
	const { isSuccess: refreshSuccess, data: refreshData } = useQuery(refreshQuery());

	if (tokenSuccess && tokenData) {
		tokenRef.current = tokenData;
	}

	if (refreshSuccess && refreshData) {
		refreshRef.current = refreshData;
	}

	const { isSuccess: userSuccess, data: userData } = useQuery({
		...userQuery(tokenRef.current !== undefined ? tokenRef.current : ''),
		enabled: Boolean(tokenData),
	});
	const { isSuccess: streamSuccess, data: streamData } = useQuery({
		...streamQuery(),
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
	const { loggedInUser, token } = useAuth();

	const { isSuccess, data } = useQuery({
		...statusQuery(token),
		enabled: Boolean(loggedInUser),
	});

	if (isSuccess && data && approved !== data.data.approved && status !== data.data.status) {
		approved.current = data.data.approved;
		status.current = data.data.status;
	}
	return { approved: approved.current, status: status.current };
}
