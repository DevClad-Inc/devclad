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
  timezone?: string;
  avatar?: string;
  pronouns?: string;
  about?: string;
  website?: string;
  linkedin?: string;
  languages?: string;
  dev_type?: string;
  raw_xp?: number;
  purpose?: string;
  location?: string;
}

export interface ProfileUpdate extends Profile {
  devType?: string;
  rawXP?: number;
}

export const initialProfileState : Profile = {
  uid: undefined,
  timezone: undefined,
  avatar: undefined,
  pronouns: undefined,
  about: undefined,
  website: undefined,
  linkedin: undefined,
  languages: undefined,
  dev_type: undefined,
  raw_xp: undefined,
  purpose: undefined,
  location: undefined,
};

export interface SocialProfile {
  calendly?: string;
  video_call_friendly?: boolean;
  preferred_timezone_deviation?: string;
  preferred_dev_type?: string;
  idea_status?: string;
}

export interface SocialProfileUpdate extends SocialProfile {
  videoCallFriendly?: boolean;
  preferredTimezoneDeviation?: string;
  preferredDevType?: string;
  ideaStatus?: string;
}

export const initialSocialProfileState: SocialProfile = {
  calendly: undefined,
  video_call_friendly: undefined,
  preferred_timezone_deviation: undefined,
  preferred_dev_type: undefined,
  idea_status: undefined,
};
