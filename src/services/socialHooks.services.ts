import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsernameProfile, getUsernameSocialProfile } from '@/services/profile.services';
import {
  userBlockedQuery,
  userCircleQuery,
  userMatchesQuery,
  userShadowedQuery,
  userSkippedQuery,
} from '@/lib/queriesAndLoaders';

export const useOneOneUsernames = () => {
  const usernames = [];
  const matchesQuery = useQuery(userMatchesQuery());
  if (matchesQuery.isSuccess && matchesQuery.data !== null) {
    const { data } = matchesQuery.data;
    for (let i = 0; i < data.matches_this_week.length; i += 1) {
      usernames.push(data.matches_this_week[i]);
    }
  }
  return { usernames };
};

export const useShadowedUsernames = () => {
  const usernames = [];
  const shadowedQuery = useQuery(userShadowedQuery());
  if (shadowedQuery.isSuccess && shadowedQuery.data !== null) {
    const { data } = shadowedQuery.data;
    for (let i = 0; i < data.length; i += 1) {
      usernames.push(data.shadowed_users[i]);
    }
  }
  return { usernames };
};

export const useSkippedUsernames = () => {
  const usernames = [];
  const skippedQuery = useQuery(userSkippedQuery());
  if (skippedQuery.isSuccess && skippedQuery.data !== null) {
    const { data } = skippedQuery.data;
    for (let i = 0; i < data.length; i += 1) {
      usernames.push(data.skipped_users[i]);
    }
  }
  return { usernames };
};

export const useCircleUsernames = (username: string) => {
  const usernames = [];
  const circleQuery = useQuery(userCircleQuery(username));
  if (circleQuery.isSuccess && circleQuery.data !== null) {
    const { data } = circleQuery.data;
    for (let i = 0; i < data.circle.length; i += 1) {
      usernames.push(data.circle[i]);
    }
  }
  return { usernames };
};

export const useBlockedUsernames = () => {
  const usernames = [];
  const blockedQuery = useQuery(userBlockedQuery());
  if (blockedQuery.isSuccess && blockedQuery.data !== null) {
    const { data } = blockedQuery.data;
    for (let i = 0; i < data.blocked_users.length; i += 1) {
      usernames.push(data.blocked_users[i]);
    }
  }
  return { usernames };
};

export const useOneOneProfile = (username: string) => {
  const profileQuery = useQuery(['profile', username], async () => getUsernameProfile(username), {
    enabled: username !== '',
    staleTime: 1000 * 5 * 60, // 5 minutes
  });
  const socialProfileQuery = useQuery(
    ['social-profile', username],
    async () => getUsernameSocialProfile(username),
    {
      enabled: username !== '',
      staleTime: 1000 * 5 * 60, // 5 minutes
    }
  );
  if (
    profileQuery.isSuccess &&
    socialProfileQuery.isSuccess &&
    profileQuery.data !== null &&
    socialProfileQuery.data !== null
  ) {
    const { data: profile } = profileQuery.data;
    const { data: socialProfile } = socialProfileQuery.data;
    return { ...profile, ...socialProfile };
  }
  return null;
};

export const useConnected = (username: string, otherUser: string): boolean => {
  const [connected, setConnected] = React.useState(false);
  const circle = useCircleUsernames(username);
  const otherUserCircle = useCircleUsernames(otherUser);
  const { usernames } = circle;
  const { usernames: otherUsernames } = otherUserCircle;
  if (usernames !== undefined && otherUsernames !== undefined) {
    if (usernames.includes(otherUser) && otherUsernames.includes(username) && !connected) {
      setConnected(true);
    } else if (!usernames.includes(otherUser) && !otherUsernames.includes(username) && connected) {
      setConnected(false);
    }
  }
  return connected;
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

export const useAdded = (username: string, otherUser: string): boolean => {
  const [added, setAdded] = React.useState(false);
  const circleQuery = useCircleUsernames(username);
  if (circleQuery.usernames.includes(otherUser) && !added) {
    setAdded(true);
  }
  return added;
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
