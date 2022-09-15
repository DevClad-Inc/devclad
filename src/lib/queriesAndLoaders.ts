import { getUser } from '@/services/auth.services';
import { getProfile, getSocialProfile, getStatus } from '@/services/profile.services';

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

// profileempty and socialempty query are only used in Onboarding
// verified query is only used in ChangeEmail
// so not making a reusable query for them

export async function userLoader(qc:any) {
  return (
    qc.getQueryData(userQuery().queryKey)
      ?? (await qc.fetchQuery(userQuery()))
  );
}

export async function profileLoader(qc:any) {
  return (
    qc.getQueryData(profileQuery().queryKey)
        ?? (await qc.fetchQuery(profileQuery()))
  );
}
