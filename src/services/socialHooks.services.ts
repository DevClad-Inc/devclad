import { useQuery } from '@tanstack/react-query';
import { getOneOne, getUsernameProfile, getUsernameSocialProfile } from '@/services/profile.services';

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

export function useOneOneProfile(username: string) {
  const profileQuery = useQuery(
    ['profile', username],
    async () => getUsernameProfile(username),
  );
  const socialProfileQuery = useQuery(
    ['social-profile', username],
    async () => getUsernameSocialProfile(username),
  );
  if (profileQuery.isSuccess && socialProfileQuery.isSuccess
      && profileQuery.data !== null && socialProfileQuery.data !== null) {
    const { data: profile } = profileQuery.data;
    const { data: socialProfile } = socialProfileQuery.data;
    return { ...profile, ...socialProfile };
  }
  return null;
}
