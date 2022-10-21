import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
	additionalSPQuery,
	profileQuery,
	socialProfileUsernameQuery,
	socialProfileQuery,
	userBlockedQuery,
	userCircleQuery,
	userMatchesQuery,
	userShadowedQuery,
	userSkippedQuery,
	streamUIDQuery,
	userAddedQuery,
} from '@/lib/queriesAndLoaders';
import { Profile, SocialProfile } from '@/lib/InterfacesStates.lib';
import { useAuth } from '@/services/useAuth.services';
import { checkTokenType } from './auth.services';

export const useStreamUID = (username: string) => {
	const { token } = useAuth();
	const { isSuccess, data } = useQuery({
		...streamUIDQuery(token, username),
		enabled: checkTokenType(token) && Boolean(username),
	});
	if (isSuccess && data) {
		const { uid } = data as { uid: string };
		return uid;
	}
	return null;
};

export const useOneOneUsernames = () => {
	const { token } = useAuth();
	const usernames = [];
	const matchesQuery = useQuery(userMatchesQuery(token));
	if (matchesQuery.isSuccess && matchesQuery.data !== null) {
		const { data } = matchesQuery.data;
		for (let i = 0; i < data.matches_this_week.length; i += 1) {
			usernames.push(data.matches_this_week[i]);
		}
	}
	return { usernames };
};

export const useShadowedUsernames = () => {
	const { token } = useAuth();
	const usernames = [];
	const shadowedQuery = useQuery(userShadowedQuery(token));
	if (shadowedQuery.isSuccess && shadowedQuery.data !== null) {
		const { data } = shadowedQuery.data;
		for (let i = 0; i < data.length; i += 1) {
			usernames.push(data.shadowed[i]);
		}
	}
	return { usernames };
};

export const useSkippedUsernames = () => {
	const { token } = useAuth();
	const usernames = [];
	const skippedQuery = useQuery(userSkippedQuery(token));
	if (skippedQuery.isSuccess && skippedQuery.data !== null) {
		const { data } = skippedQuery.data;
		for (let i = 0; i < data.length; i += 1) {
			usernames.push(data.skipped[i]);
		}
	}
	return { usernames };
};

export const useCircle = () => {
	const { token, loggedInUser } = useAuth();
	const { username } = loggedInUser;
	const usernames = [];
	const circleQuery = useQuery(userCircleQuery(token, username as string));
	if (circleQuery.isSuccess && circleQuery.data !== null) {
		const { data } = circleQuery.data;
		for (let i = 0; i < data.circle.length; i += 1) {
			usernames.push(data.circle[i]);
		}
	}
	return { usernames };
};

export const useAddedUsernames = () => {
	const { token } = useAuth();
	const usernames = [];
	const addedQuery = useQuery(userAddedQuery(token));
	if (addedQuery.isSuccess && addedQuery.data !== null) {
		const { data } = addedQuery.data;
		for (let i = 0; i < data.added.length; i += 1) {
			usernames.push(data.added[i]);
		}
	}
	return { usernames };
};

export const useBlockedUsernames = () => {
	const { token } = useAuth();
	const usernames = [];
	const blockedQuery = useQuery(userBlockedQuery(token));
	if (blockedQuery.isSuccess && blockedQuery.data !== null) {
		const { data } = blockedQuery.data;
		for (let i = 0; i < data.blocked.length; i += 1) {
			usernames.push(data.blocked[i]);
		}
	}
	return { usernames };
};

export const useOneOneProfile = (username: string) => {
	const { token } = useAuth();
	const profileQ = useQuery({
		...profileQuery(token, username),
		enabled: Boolean(username) && checkTokenType(token),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
	const spUsernameQuery = useQuery({
		...socialProfileUsernameQuery(token, username),
		enabled: username !== '',
		staleTime: 1000 * 5 * 60, // 5 minutes
	});
	if (
		profileQ.isSuccess &&
		spUsernameQuery.isSuccess &&
		profileQ.data !== null &&
		spUsernameQuery.data !== null
	) {
		const { data: profile } = profileQ.data;
		const { data: socialProfile } = spUsernameQuery.data;
		return { ...profile, ...socialProfile };
	}
	return null;
};

export const useSocialProfile = ({ initialSocialData }: { initialSocialData: unknown | null }) => {
	const { token } = useAuth();
	const spQuery = useQuery({
		...socialProfileQuery(token),
		initialData: initialSocialData,
	});
	if (spQuery.isSuccess && spQuery.data !== null) {
		const { data } = spQuery.data as { data: SocialProfile };
		return data;
	}
	return null;
};

export const useProfile = (username: string) => {
	const profileRef = React.useRef<Profile | null>(null);
	const { token } = useAuth();
	const profileQ = useQuery({
		...profileQuery(token, username),
		enabled: Boolean(username) && checkTokenType(token),
	});
	if (profileQ.isSuccess && profileQ.data !== null) {
		const { data } = profileQ.data;
		profileRef.current = data;
	}
	return profileRef.current;
};

export const useAdditionalSP = () => {
	const { token } = useAuth();
	const additionalSocialProfileQuery = useQuery(additionalSPQuery(token));
	if (additionalSocialProfileQuery.isSuccess && additionalSocialProfileQuery.data !== null) {
		const { data } = additionalSocialProfileQuery.data;
		return data;
	}
	return null;
};

export const useConnected = (otherUser: string): boolean => {
	const [connected, setConnected] = React.useState(false);
	const circle = useCircle();
	const { usernames } = circle;
	if (usernames !== undefined) {
		if (usernames.includes(otherUser) && !connected) {
			setConnected(true);
		} else if (!usernames.includes(otherUser) && connected) {
			setConnected(false);
		}
	}
	return connected;
};

export const useAdded = (otherUser: string): boolean => {
	const [added, setAdded] = React.useState(false);
	const addedUsers = useAddedUsernames();
	if (addedUsers.usernames.includes(otherUser) && !added) {
		setAdded(true);
	}
	return added;
};

export const useBlocked = (username: string): boolean => {
	const [blocked, setBlocked] = React.useState(false);
	const blockedUsers = useBlockedUsernames();
	const { usernames } = blockedUsers;
	if (usernames !== undefined) {
		if (usernames.includes(username) && !blocked) {
			setBlocked(true);
		} else if (!usernames.includes(username) && blocked) {
			setBlocked(false);
		}
	}
	return blocked;
};

export const useSkipped = (otherUser: string): boolean => {
	const [skipped, setSkipped] = React.useState(false);
	const skippedUsers = useSkippedUsernames();
	const { usernames } = skippedUsers;
	if (usernames !== undefined) {
		if (usernames.includes(otherUser) && !skipped) {
			setSkipped(true);
		} else if (!usernames.includes(otherUser) && skipped) {
			setSkipped(false);
		}
	}
	return skipped;
};

export const useShadowed = (otherUser: string): boolean => {
	const [shadowed, setShadowed] = React.useState(false);
	const shadowedUsers = useShadowedUsernames();
	const { usernames } = shadowedUsers;
	if (usernames !== undefined) {
		if (usernames.includes(otherUser) && !shadowed) {
			setShadowed(true);
		} else if (!usernames.includes(otherUser) && shadowed) {
			setShadowed(false);
		}
	}
	return shadowed;
};
