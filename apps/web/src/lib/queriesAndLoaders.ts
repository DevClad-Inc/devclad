import { QueryClient } from '@tanstack/react-query';
import { getUser } from '@/services/auth.services';
import {
	getAdded,
	getAdditionalSP,
	getBlockedUsers,
	getCircle,
	getOneOne,
	getShadowUsers,
	getSkippedUsers,
	getSocialProfile,
	getStatus,
	getProfile,
	getUsernameSocialProfile,
} from '@/services/profile.services';
import { getStreamToken, getStreamUID } from '@/services/stream.services';
import { getMeeting } from '@/services/meetings.services';
import serverlessCookie from './serverlessCookie.lib';

// ! only using social profile loader rn

export const streamQuery = (token: string) => ({
	queryKey: ['stream'],
	queryFn: () => getStreamToken(token),
	staleTime: 1000 * 60 * 60 * 24, // 24 hours
	cacheTime: 1000 * 60 * 60 * 24, // 24 hours
	refetchOnWindowFocus: false,
});

export const streamUIDQuery = (token: string, username: string) => ({
	queryKey: ['streamUID', username],
	queryFn: () => getStreamUID(token, username),
	staleTime: 1000 * 60 * 60 * 24, //
	cacheTime: 1000 * 60 * 60 * 24, //
	refetchOnWindowFocus: false,
});

export const tokenQuery = () => ({
	queryKey: ['token'],
	queryFn: () => serverlessCookie<string>('token'),
	staleTime: 1000 * 60 * 10, // 10 minutes; sort of like a connection check
});

export const refreshQuery = () => ({
	queryKey: ['refresh'],
	queryFn: () => serverlessCookie<string>('refresh'),
	staleTime: 1000 * 60 * 10, // 10 minutes; sort of like a connection check
});

export const meetingQuery = (uid: string) => ({
	queryKey: ['meeting', uid],
	queryFn: () => getMeeting(uid),
	staleTime: 1000 * 60 * 5, // 5 minutes
	cacheTime: 1000 * 60 * 5, // 5 minutes
	refetchOnWindowFocus: false,
});

export const userQuery = (token: string) => ({
	queryKey: ['user'],
	queryFn: () => getUser(token),
	enabled: Boolean(token),
});

export const socialProfileQuery = () => ({
	queryKey: ['social-profile'],
	queryFn: () => getSocialProfile(),
});

export const additionalSPQuery = () => ({
	queryKey: ['additional-sprefs'],
	queryFn: () => getAdditionalSP(),
});

export const statusQuery = (token: string) => ({
	queryKey: ['userStatus'],
	queryFn: () => getStatus(token),
});

export const profileQuery = (token: string, username: string) => ({
	queryKey: ['profile', username],
	queryFn: () => getProfile(token, username),
	enabled: Boolean(username) && username !== '',
});

export const socialProfileUsernameQuery = (username: string) => ({
	queryKey: ['social-profile', username],
	queryFn: () => getUsernameSocialProfile(username),
});

export const userMatchesQuery = () => ({
	queryKey: ['matches'],
	queryFn: () => getOneOne(),
	staleTime: 1000 * 60 * 60 * 24, // 24 hours
});

export const userCircleQuery = (username: string) => ({
	queryKey: ['circle', username],
	enabled: Boolean(username),
	queryFn: () => getCircle(username),
});

export const userAddedQuery = () => ({
	queryKey: ['added'],
	queryFn: () => getAdded(),
});

export const userBlockedQuery = () => ({
	queryKey: ['blocked'],
	queryFn: () => getBlockedUsers(),
});

export const userShadowedQuery = () => ({
	queryKey: ['shadowed'],
	queryFn: () => getShadowUsers(),
});

export const userSkippedQuery = () => ({
	queryKey: ['skipped'],
	queryFn: () => getSkippedUsers(),
});

// profileempty and socialempty query are only used in Onboarding
// verified query is only used in ChangeEmail
// so not making a reusable query for them

// export const initialDataLoader = (qc: QueryClient) => async () => {
// 	const query = initialDataQuery();
// 	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
// };

export const userLoader = (qc: QueryClient, token: string) => async () =>
	qc.getQueryData(userQuery(token).queryKey) ?? (await qc.fetchQuery(userQuery(token)));

export const socialProfileLoader = (qc: QueryClient) => async () => {
	const query = socialProfileQuery();
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};

export const statusLoader = (qc: QueryClient, token: string) => async () =>
	qc.getQueryData(statusQuery(token).queryKey) ?? (await qc.fetchQuery(statusQuery(token)));

export const profileLoader = (qc: QueryClient, token: string) => async (username: string) => {
	const query = profileQuery(username, token);
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};

export const socialProfileUsernameLoader = (qc: QueryClient) => async (username: string) => {
	const query = socialProfileUsernameQuery(username);
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};
