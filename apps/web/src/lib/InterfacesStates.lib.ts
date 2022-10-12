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
	avatar?: string;
	pronouns?: string;
	about?: string;
	website?: string;
	linkedin?: string;
	calendly?: string;
}

export const initialProfileState: Profile = {
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
	dev_type?: string;
	preferred_dev_type?: string;
	idea_status?: string;
}

export interface SocialProfileFormValues extends SocialProfile {
	errors?: {
		languages?: string;
		raw_xp?: string;
		purpose?: string;
		location?: string;
		timezone?: string;
		dev_type?: string;
		preferred_dev_type?: string;
		idea_status?: string;
	};
}

export interface AdditionalSP {
	video_call_friendly?: boolean;
	available_always_off?: boolean;
}

export const initialSocialProfileState: SocialProfile = {
	languages: undefined,
	raw_xp: undefined,
	purpose: undefined,
	location: undefined,
	video_call_friendly: undefined,
	timezone: undefined,
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

// FORMS

export interface SignupFormValues extends NewUser {
	errors?: {
		firstName?: string;
		lastName?: string;
		email?: string;
		password1?: string;
		password2?: string;
	};
}

export interface InterfaceEmail {
	email: string;
	errors?: {
		email?: string;
	};
}

export interface LoginFormValues {
	email: string;
	password: string;
	errors?: {
		email?: string;
		password?: string;
	};
}

export interface UpdateUserFormValues {
	firstName?: string;
	lastName?: string;
	username?: string;
	errors?: {
		firstName?: string;
		lastName?: string;
		username?: string;
	};
}

export interface UpdateProfileFormValues extends Profile {
	errors?: {
		pronouns?: string;
		about?: string;
		website?: string;
		linkedin?: string;
		calendly?: string;
	};
}

export interface PasswordReset {
	password1: string;
	password2: string;
	errors?: {
		password1?: string;
		password2?: string;
	};
}
export interface MatchProfile extends Profile, SocialProfile {
	first_name?: string;
	last_name?: string;
}
