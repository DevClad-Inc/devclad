// import { QueryClient } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { getUser } from '@/services/auth.services';
import {
  getProfile, getSocialProfile, getStatus, getUsernameProfile, getUsernameSocialProfile,
} from '@/services/profile.services';

// ! not using loaders yet

export const userQuery = () => ({
  queryKey: ['user'],
  queryFn: async () => getUser(),
});

export const profileQuery = () => ({
  queryKey: ['profile'],
  queryFn: async () => getProfile(),
});

export const socialProfileQuery = () => ({
  queryKey: ['social-profile'],
  queryFn: async () => getSocialProfile(),
});

export const statusQuery = () => ({
  queryKey: ['userStatus'],
  queryFn: async () => getStatus(),
});

export const profileUsernameQuery = (username: string) => ({
  queryKey: ['profile', username],
  queryFn: async () => getUsernameProfile(username),
});

export const socialProfileUsernameQuery = (username: string) => ({
  queryKey: ['social-profile', username],
  queryFn: async () => getUsernameSocialProfile(username),
});

// profileempty and socialempty query are only used in Onboarding
// verified query is only used in ChangeEmail
// so not making a reusable query for them

export const userLoader = (qc: QueryClient) => async () => (
  qc.getQueryData(userQuery().queryKey)
      ?? (await qc.fetchQuery(userQuery()))
);

export const profileLoader = (qc:QueryClient) => async () => {
  const query = profileQuery();
  return qc.getQueryData(query.queryKey)
    ?? (await qc.fetchQuery(query));
};

export const socialProfileLoader = (qc: QueryClient) => async () => {
  const query = socialProfileQuery();
  return (
    qc.getQueryData(query.queryKey)
      ?? (await qc.fetchQuery(query))
  );
};

export const statusLoader = (qc: QueryClient) => async () => (
  qc.getQueryData(statusQuery().queryKey)
  ?? (await qc.fetchQuery(statusQuery()))
);
