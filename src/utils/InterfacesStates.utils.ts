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
