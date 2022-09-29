import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getOneOne,
  getUsernameProfile,
  getUsernameSocialProfile,
} from '@/services/profile.services';
import { userCircleQuery } from '@/lib/queriesAndLoaders';

export function useOneOneUsernames() {
  const usernames = [];
  const matchesQuery = useQuery(['matches'], () => getOneOne());
  if (matchesQuery.isSuccess && matchesQuery.data !== null) {
    const { data } = matchesQuery.data;
    for (let i = 0; i < data.matches_this_week.length; i += 1) {
      usernames.push(data.matches_this_week[i]);
    }
  }
  return { usernames };
}

export function useCircleUsernames(username: string) {
  const usernames = [];
  const circleQuery = useQuery(userCircleQuery(username));
  if (circleQuery.isSuccess && circleQuery.data !== null) {
    const { data } = circleQuery.data;
    for (let i = 0; i < data.circle.length; i += 1) {
      usernames.push(data.circle[i]);
    }
  }
  return { usernames };
}

export function useOneOneProfile(username: string) {
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
}

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

export const useAdded = (username: string, otherUser: string): boolean => {
  const [added, setAdded] = React.useState(false);
  const circleQuery = useCircleUsernames(username);
  if (circleQuery.usernames.includes(otherUser) && !added) {
    setAdded(true);
  }
  return added;
};
