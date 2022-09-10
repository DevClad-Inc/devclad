export interface NewUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password1: string;
  password2: string;
}

export interface User {
  pk?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export const initialUserState: User = {
  pk: undefined,
  username: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
};

export interface Profile {
  uid?: string;
  avatar?: string;
  pronouns?: string;
  about?: string;
  website?: string;
  linkedin?: string;
  calendly?: string;
}

export const initialProfileState : Profile = {
  uid: undefined,
  avatar: undefined,
  pronouns: undefined,
  about: undefined,
  website: undefined,
  linkedin: undefined,
  calendly: undefined,
};

export interface SocialProfile {
  languages?: string;
  raw_xp?: number;
  purpose?: string;
  location?: string;
  video_call_friendly?: boolean;
  timezone?: string;
  preferred_timezone_deviation?: string;
  dev_type?: string;
  preferred_dev_type?: string;
  idea_status?: string;
}

export interface SocialProfileUpdate extends SocialProfile {
  videoCallFriendly?: boolean;
  rawXP?: number;
  preferredTimezoneDeviation?: string;
  devType?: string;
  preferredDevType?: string;
  ideaStatus?: string;
}

export const initialSocialProfileState: SocialProfile = {
  languages: undefined,
  raw_xp: undefined,
  purpose: undefined,
  location: undefined,
  video_call_friendly: undefined,
  timezone: undefined,
  preferred_timezone_deviation: undefined,
  dev_type: undefined,
  preferred_dev_type: undefined,
  idea_status: undefined,
};

export interface UserStatus {
  status?: string;
  approved?: boolean;
}

export const initialUserStatus: UserStatus = {
  status: undefined,
  approved: undefined,
};
