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

// const timeUntilSundayMidnightUTC = () => {
//   const now = new Date();
//   const sunday = new Date(now); // in UTC
//   sunday.setDate((now.getUTCDate() + (7 - now.getUTCDay())) % 7);
//   sunday.setUTCHours(0, 0, 0, 0);
//   return sunday.getTime() - now.getTime();
// };

/* !why not just modify response from the backend?
reason: we want to keep the API as reusable as possible
AND, it helps with caching pieces of data */
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
