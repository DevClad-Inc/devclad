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
	avatar: string;
	pronouns: string;
	about: string;
	website: string;
	linkedin: string;
	calendly: string;
}

export interface SocialProfile {
	timezone: string;
	purpose: string;
	dev_type?: string;
	location?: string;
	preferred_dev_type?: string;
	languages?: string;
	raw_xp: number;
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
	video_call_friendly: boolean;
	available_always_off: boolean;
	preferred_day: string;
	preferred_time: string;
}

export interface MatchProfile extends Profile, SocialProfile {
	first_name: string;
	last_name: string;
	video_call_friendly: boolean;
	preferred_day: string;
	preferred_time: string;
}

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

export interface ILoginForm extends InterfaceEmail {
	password: string;
	errors?: {
		email?: string;
		password?: string;
	};
}

export interface IUpdateUserForm {
	firstName?: string;
	lastName?: string;
	username?: string;
	errors?: {
		firstName?: string;
		lastName?: string;
		username?: string;
	};
}

export interface IUpdateProfileForm extends Profile {
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

export interface MeetingCreateUpdate {
	name: string;
	invites: string[];
	type_of: string;
	time: string;
	organizer: string | number; // username when fetching all meetings, id when fetching individual meeting
}

export interface Meeting extends MeetingCreateUpdate {
	id: number;
	uid: string;
	link: string;
	attended: boolean;
}
