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

export interface LoginResponse {
	access_token?: string;
	refresh_token?: string;
}

export interface Profile {
	avatar: string;
	pronouns: string;
	about: string;
	website: string;
	linkedin: string;
	calendly: string;
}

export interface UserStatus {
	status?: string;
	approved?: boolean;
}

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
