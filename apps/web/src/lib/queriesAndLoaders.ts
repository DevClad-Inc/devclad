import Cookies from 'js-cookie';
import { QueryClient } from '@tanstack/react-query';
import { checkTokenType, getUser } from '@/services/auth.services';
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
import { getMeeting, idTypeCheck } from '@/services/meetings.services';
import serverlessCookie from './serverlessCookie.lib';

// ! only using social profile loader rn

export const streamQuery = (token: string) => ({
	queryKey: ['stream'],
	queryFn: () => getStreamToken(token),
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
	enabled: Cookies.get('loggedIn') === 'true',
	staleTime: 1000 * 60 * 60 * 24,
});

export const refreshQuery = () => ({
	queryKey: ['refresh'],
	queryFn: () => serverlessCookie<string>('refresh'),
	enabled: Cookies.get('loggedIn') === 'true',
	staleTime: 1000 * 60 * 60 * 24 * 28,
});

export const meetingQuery = (token: string, uid: string) => ({
	queryKey: ['meeting', uid],
	queryFn: () => getMeeting(token, uid),
	staleTime: 1000 * 60 * 5, // 5 minutes
	cacheTime: 1000 * 60 * 5, // 5 minutes
	refetchOnWindowFocus: false,
	enabled: idTypeCheck(uid),
});

export const userQuery = (token: string, qc?: QueryClient) => ({
	queryKey: ['user'],
	queryFn: () => getUser(token, qc),
	enabled: checkTokenType(token),
});

export const socialProfileQuery = (token: string) => ({
	queryKey: ['social-profile'],
	queryFn: () => getSocialProfile(token),
});

export const additionalSPQuery = (token: string) => ({
	queryKey: ['additional-sprefs'],
	queryFn: () => getAdditionalSP(token),
});

export const statusQuery = (token: string, qc: QueryClient) => ({
	queryKey: ['userStatus'],
	queryFn: () => getStatus(token, qc),
	enabled: checkTokenType(token),
});

export const profileQuery = (token: string, username: string, qc?: QueryClient) => ({
	queryKey: ['profile', username],
	queryFn: () => getProfile(token, username, qc),
	enabled: Boolean(username) && username !== '',
});

export const socialProfileUsernameQuery = (token: string, username: string) => ({
	queryKey: ['social-profile', username],
	queryFn: () => getUsernameSocialProfile(token, username),
	enabled: Boolean(username) && username !== '' && checkTokenType(token),
});

export const userMatchesQuery = (token: string) => ({
	queryKey: ['matches'],
	queryFn: () => getOneOne(token),
	staleTime: 1000 * 60 * 60 * 24, // 24 hours
});

export const userCircleQuery = (token: string, username: string) => ({
	queryKey: ['circle', username],
	enabled: Boolean(username) && username !== '',
	queryFn: () => getCircle(token, username),
});

export const userAddedQuery = (token: string) => ({
	queryKey: ['added'],
	queryFn: () => getAdded(token),
});

export const userBlockedQuery = (token: string) => ({
	queryKey: ['blocked'],
	queryFn: () => getBlockedUsers(token),
});

export const userShadowedQuery = (token: string) => ({
	queryKey: ['shadowed'],
	queryFn: () => getShadowUsers(token),
});

export const userSkippedQuery = (token: string) => ({
	queryKey: ['skipped'],
	queryFn: () => getSkippedUsers(token),
});

// verified query is only used in ChangeEmail
// so not making a reusable query for them
