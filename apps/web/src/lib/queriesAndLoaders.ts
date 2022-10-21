// import { QueryClient } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { getUser } from '@/services/auth.services';
import {
	getAdded,
	getAdditionalSP,
	getBlockedUsers,
	getCircle,
	getOneOne,
	getProfile,
	getShadowUsers,
	getSkippedUsers,
	getSocialProfile,
	getStatus,
	getUsernameProfile,
	getUsernameSocialProfile,
} from '@/services/profile.services';
import { getStreamToken, getStreamUID } from '@/services/stream.services';
import { getMeeting } from '@/services/meetings.services';
import serverlessCookie from './serverlessCookie.lib';

// ! only using social profile loader rn

export const streamQuery = () => ({
	queryKey: ['stream'],
	queryFn: () => getStreamToken(),
	staleTime: 1000 * 60 * 60 * 24, // 24 hours
	cacheTime: 1000 * 60 * 60 * 24, // 24 hours
	refetchOnWindowFocus: false,
});

export const streamUIDQuery = (username: string) => ({
	queryKey: ['streamUID', username],
	queryFn: () => getStreamUID(username),
	staleTime: 1000 * 60 * 60 * 24, //
	cacheTime: 1000 * 60 * 60 * 24, //
	refetchOnWindowFocus: false,
});

export const tokenQuery = () => ({
	queryKey: ['token'],
	queryFn: () => serverlessCookie<string>('token'),
	placeholderData: '',
	staleTime: 1000 * 60 * 60 * 12, // 12 hours
	refetchOnWindowFocus: true, // explicitly stating for clarity
});

export const refreshQuery = () => ({
	queryKey: ['refresh'],
	queryFn: () => serverlessCookie<string>('refresh'),
	placeholderData: '',
	staleTime: 1000 * 60 * 60 * 24 * 14, // 14 days
	refetchOnWindowFocus: true, // explicitly stating for clarity
});

export const meetingQuery = (uid: string) => ({
	queryKey: ['meeting', uid],
	queryFn: () => getMeeting(uid),
	staleTime: 1000 * 60 * 5, // 5 minutes
	cacheTime: 1000 * 60 * 5, // 5 minutes
	refetchOnWindowFocus: false,
});

export const userQuery = (token: string | undefined) => ({
	queryKey: ['user'],
	queryFn: () => getUser(token),
	enabled: token !== undefined,
});

export const profileQuery = (token: string | undefined) => ({
	queryKey: ['profile'],
	queryFn: () => getProfile(token),
	enabled: token !== undefined,
});

export const socialProfileQuery = () => ({
	queryKey: ['social-profile'],
	queryFn: () => getSocialProfile(),
});

export const additionalSPQuery = () => ({
	queryKey: ['additional-sprefs'],
	queryFn: () => getAdditionalSP(),
});

export const statusQuery = (token: string | undefined) => ({
	queryKey: ['userStatus'],
	queryFn: () => getStatus(token),
});

export const profileUsernameQuery = (username: string) => ({
	queryKey: ['profile', username],
	queryFn: () => getUsernameProfile(username),
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

export const profileLoader = (qc: QueryClient, token: string) => async () => {
	const query = profileQuery(token);
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};

export const socialProfileLoader = (qc: QueryClient) => async () => {
	const query = socialProfileQuery();
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};

export const statusLoader = (qc: QueryClient, token: string) => async () =>
	qc.getQueryData(statusQuery(token).queryKey) ?? (await qc.fetchQuery(statusQuery(token)));

export const profileUsernameLoader = (qc: QueryClient) => async (username: string) => {
	const query = profileUsernameQuery(username);
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};

export const socialProfileUsernameLoader = (qc: QueryClient) => async (username: string) => {
	const query = socialProfileUsernameQuery(username);
	return qc.getQueryData(query.queryKey) ?? (await qc.fetchQuery(query));
};
