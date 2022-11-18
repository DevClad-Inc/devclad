import { Profile } from '@/lib/types.lib';

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
	readonly first_name: string;
	readonly last_name: string;
	readonly video_call_friendly: boolean;
	readonly preferred_day: string;
	readonly preferred_time: string;
}
